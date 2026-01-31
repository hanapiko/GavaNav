import json
import os
from typing import Dict, Any, List
from .state import AgentState
from .models import ServiceLocation, PrimaryOffice

class LocationResolverNode:
    def __init__(self):
        # Load knowledge base for locations
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        kb_path = os.path.join(base_path, "data", "knowledge_base.json")
        try:
            with open(kb_path, "r") as f:
                self.kb = json.load(f)
        except:
            self.kb = {}

    def __call__(self, state: AgentState) -> Dict[str, Any]:
        if state.get("error"):
            return state
        print("--- LOCATION SYNC ---")
        input_data = state["input_data"]
        county = input_data.user_profile.county.lower()
        search_results = state.get("search_results") or []
        
        # 1. PRIORITY: Check Live Search Results for specific buildings
        building_found = None
        for res in search_results:
            if "operating at" in res.get("content", ""):
                import re
                match = re.search(r"operating at (.*?)\.", res["content"])
                if match:
                    building_found = match.group(1)
                    break

        # 2. Check KB for locations
        locations_db = self.kb.get("locations", {})
        city_key = None
        for key in locations_db:
            if key in county or county in key:
                city_key = key
                break
        
        if not city_key:
             city_key = "nairobi" # Default logic
            
        area_offices = locations_db.get(city_key, {}).get("huduma", [])
        
        if not area_offices:
             primary = PrimaryOffice(
                 office_name=building_found or f"Huduma Centre {input_data.user_profile.county.capitalize()}",
                 county=input_data.user_profile.county.capitalize(),
                 address=building_found or "County Headquarters",
                 walk_in_allowed=True
             )
             alts = []
        else:
            main = area_offices[0]
            primary = PrimaryOffice(
                office_name=building_found or main["name"],
                county=city_key.capitalize(),
                address=building_found or main["address"],
                walk_in_allowed=main["walk_in"]
            )
            alts = area_offices[1:]

        loc_resolution = ServiceLocation(
            primary_office=primary,
            alternative_offices=alts
        )
        
        return {
            "location_resolution": loc_resolution
        }