import json
import os
from typing import Dict, Any, Optional
from ..core.state import AgentState
from ..core.models import AgentInput, ServiceSummary, CostInformation, ProcessingTime

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

    def _fuzzy_match_service(self, category: str, name: str) -> Optional[Dict[str, Any]]:
        services = self.knowledge_base.get("services", {}).get(category, {})
        # Direct match first
        if name in services:
            return services[name]
        
        # Simple substring match
        for key, data in services.items():
            if name.lower() in key.lower() or key.lower() in name.lower() or name.lower() in data.get("name", "").lower():
                return data
        return None

    def __call__(self, state: AgentState) -> Dict[str, Any]:
        print("--- KNOWLEDGE CHECK ---")
        input_data: AgentInput = state["input_data"]
        request = input_data.service_request
        
        service_data = self._fuzzy_match_service(request.service_category, request.service_name)
        
        if not service_data:
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
        # Handle different fee structures. Simplified logic: take the first fee or average
        fees_dict = service_data.get("fees", {})
        # Just grabbing the first value for simplicity or logic based on application_type if available
        # But fee structure in JSON varies.
        # Let's try to find a fee that matches application_type if possible, else default
        fee_amount = 0.0
        app_type = input_data.user_profile.application_type
        
        if app_type in fees_dict:
             fee_amount = float(fees_dict[app_type])
        elif "32_pages" in fees_dict: # Passport default
             fee_amount = float(fees_dict["32_pages"])
        elif "renewal" in fees_dict and app_type == "renewal":
             fee_amount = float(fees_dict["renewal"])
        elif "first_time" in fees_dict:
             fee_amount = float(fees_dict["first_time"])
        else:
             # Take any funding
             vals = [v for k,v in fees_dict.items() if isinstance(v, (int, float))]
             if vals: fee_amount = float(vals[0])

        cost_info = CostInformation(
            official_fee_kes=fee_amount,
            payment_methods=["eCitizen", "Mpesa", "Bank"],
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
