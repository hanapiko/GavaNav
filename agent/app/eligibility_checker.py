from typing import Dict, Any, List
from .state import AgentState
from .models import Eligibility

class EligibilityCheckerNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        print("--- ELIGIBILITY CHECK ---")
        input_data = state["input_data"]
        profile = input_data.user_profile
        service_data = state.get("service_data", {})
        
        # Default rules if missing
        rules = service_data.get("eligibility", {
            "citizenship": ["kenyan_citizen"],
            "min_age": 18
        })
        
        reasons = []
        status = "eligible"

        # Check Citizenship
        allowed_citizenship = rules.get("citizenship", [])
        if profile.citizenship_status not in allowed_citizenship:
            status = "not_eligible"
            reasons.append(f"Citizenship status '{profile.citizenship_status}' not allowed. Must be one of: {allowed_citizenship}")

        # Check Age
        min_age = rules.get("min_age", 0)
        if profile.age < min_age:
             status = "not_eligible"
             reasons.append(f"Age {profile.age} is below minimum requirement of {min_age}.")

        next_steps = []
        if status == "not_eligible":
            next_steps.append("Check if you can apply for a different service suited for your status.")
            next_steps.append("Visit a Huduma Centre for special considerations.")

        return {
            "eligibility": Eligibility(
                status=status,
                reasons=reasons,
                next_steps_if_ineligible=next_steps
            )
        }
