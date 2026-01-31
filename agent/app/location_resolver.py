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
        print("--- LOCATION RESOLVER ---")
        input_data = state["input_data"]
        county = input_data.user_profile.county.lower()
        
        # Default fallback
        locations_db = self.kb.get("locations", {})
        
        # Try exact match or fallback to Nairobi
        if county in locations_db:
            city_key = county
        elif "nairobi" in county:
            city_key = "nairobi"
        elif "mombasa" in county:
            city_key = "mombasa"
        elif "kisumu" in county:
            city_key = "kisumu"
        else:
            city_key = "nairobi" # Fallback
            
        area_offices = locations_db.get(city_key, {}).get("huduma", [])
        
        if not area_offices:
             # Hardcoded fallback
             primary = PrimaryOffice(
                 office_name="Huduma Centre GPO",
                 county="Nairobi",
                 address="Teleposta Towers",
                 walk_in_allowed=True
             )
             alts = []
        else:
            main = area_offices[0]
            primary = PrimaryOffice(
                office_name=main["name"],
                county=city_key.capitalize(),
                address=main["address"],
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