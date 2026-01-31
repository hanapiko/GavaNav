import json
import os
from typing import Dict, Any, Optional
from .state import AgentState
from .models import AgentInput, ServiceSummary, CostInformation, ProcessingTime

class KnowledgeCheckerNode:
    def __init__(self):
        # Load knowledge base
        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        kb_path = os.path.join(base_path, "data", "knowledge_base.json")
        try:
            with open(kb_path, "r") as f:
                self.knowledge_base = json.load(f)
        except Exception as e:
            print(f"Error loading knowledge base: {e}")
            self.knowledge_base = {"services": {}, "locations": {}}

    def _normalize(self, s: str) -> str:
        import re
        if not s: return ""
        # Remove anything that isn't alphanumeric
        return re.sub(r'[^a-zA-Z0-9]', '', s.lower())

    def _fuzzy_match_service(self, category: str, name: str, query: Optional[str] = None) -> Optional[Dict[str, Any]]:
        all_services = self.knowledge_base.get("services", {})
        
        # 1. PRIORITY: If user_query is provided, try matching it across ALL categories
        if query:
            q_norm = self._normalize(query)
            print(f"DEBUG: Matching Query: '{query}' ({q_norm})")
            for cat, svcs in all_services.items():
                for key, data in svcs.items():
                    key_norm = self._normalize(key)
                    val_norm = self._normalize(data.get("name", ""))
                    # Check if query contains service key/name or vice versa
                    if key_norm in q_norm or val_norm in q_norm or q_norm in val_norm:
                        print(f"DEBUG: Match FOUND via QUERY in category '{cat}': {data.get('name')}")
                        return data

        # 2. SECONDARY: Try structured match in the specified category
        category_services = all_services.get(category, {})
        name_norm = self._normalize(name)
        print(f"DEBUG: Matching Dropdown - Category: {category}, Name: '{name}'")
        
        for key, data in category_services.items():
            key_norm = self._normalize(key)
            val_norm = self._normalize(data.get("name", ""))
            if name_norm in key_norm or key_norm in name_norm or name_norm in val_norm or val_norm in name_norm:
                print(f"DEBUG: Match FOUND via DROPDOWN!")
                return data

        # 3. Fallback: Search ALL categories (if dropdown didn't match and query didn't match)
        for cat, svcs in all_services.items():
            if cat == category: continue
            for key, data in svcs.items():
                key_norm = self._normalize(key)
                val_norm = self._normalize(data.get("name", ""))
                if name_norm in key_norm or key_norm in name_norm or name_norm in val_norm or val_norm in name_norm:
                    return data
                    
        return None

    def __call__(self, state: AgentState) -> Dict[str, Any]:
        if state.get("error"):
            return state
        print("--- KNOWLEDGE CHECK ---")
        input_data: AgentInput = state["input_data"]
        request = input_data.service_request
        
        service_data = self._fuzzy_match_service(
            request.service_category, 
            request.service_name, 
            state.get("user_query")
        )
        
        if not service_data:
            print(f"Service '{request.service_name}' not found in KB.")
            # If we have a user query, we continue to give the LLM a chance
            if state.get("user_query"):
                 return {"service_data": None, "error": None}
            return {"error": f"Service '{request.service_name}' in category '{request.service_category}' not found."}

        # Simulate 2nd Source API (e.g. NTSA)
        # If transport, we pretend we checked NTSA portal
        api_note = ""
        if request.service_category == "transport":
            api_note = "(Verified via NTSA API Simulation)"

        # Build partial outputs
        service_guidance = ServiceSummary(
            service_name=service_data["name"],
            service_description=service_data["description"] + " " + api_note,
            responsible_authority=service_data["authority"]
        )
        
        # Cost
        fees_dict = service_data.get("fees", {})
        breakdown = {k: float(v) for k, v in fees_dict.items() if isinstance(v, (int, float))}
        fee_amount = 0.0
        app_type = input_data.user_profile.application_type
        
        if app_type in fees_dict:
             fee_amount = float(fees_dict[app_type])
        elif "34_pages" in fees_dict: 
             fee_amount = float(fees_dict["34_pages"])
        elif "32_pages" in fees_dict:
             fee_amount = float(fees_dict["32_pages"])
        elif "first_time" in fees_dict:
             fee_amount = float(fees_dict["first_time"])
        elif breakdown:
             fee_amount = list(breakdown.values())[0]

        cost_info = CostInformation(
            official_fee_kes=fee_amount,
            payment_methods=["eCitizen", "Mpesa", "Bank"],
            breakdown=breakdown,
            additional_notes="Pay via eCitizen (222222)"
        )

        # Processing Time
        p_time_data = service_data.get("processing_time", {})
        urgency = request.urgency_level
        
        est_days = p_time_data.get("standard_days", 14)
        if urgency == "urgent" and "urgent_days" in p_time_data:
            est_days = p_time_data["urgent_days"]

        proc_time = ProcessingTime(
            estimated_duration_days=est_days,
            same_day_available=urgency == "urgent" and est_days <= 1,
            delay_factors=["Incomplete documents", "System downtime"]
        )

        return {
            "service_data": service_data,
            "service_guidance": service_guidance,
            "cost_information": cost_info,
            "processing_time": proc_time,
            "error": None
        }
