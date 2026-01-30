from typing import Dict, Any
from ..core.state import AgentState
from ..core.models import (
    AgentResponse, 
    ApplicationProcess, 
    AIGuidance, 
    DecisionExplanation
)

class ResponseBuilderNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        print("--- BUILDING RESPONSE ---")
        
        # 1. Application Process (Generic based on eligibility)
        steps = []
        if state.get("eligibility") and state["eligibility"].status == "eligible":
            steps = [
                {"step_number": 1, "instruction": "Gather all required documents listed."},
                {"step_number": 2, "instruction": f"Visit {state['location_resolution'].primary_office.office_name} or apply online if applicable."},
                {"step_number": 3, "instruction": "Pay the processing fee."},
                {"step_number": 4, "instruction": "Submit biometrics and application form."},
                {"step_number": 5, "instruction": "Await notification to collect your document."}
            ]
        else:
            steps = [{"step_number": 1, "instruction": "Review eligibility criteria and address reasons for ineligibility."}]

        app_process = ApplicationProcess(steps=steps)

        # 2. AI Guidance
        ai_guidance = AIGuidance(
            summary_explanation="I have analyzed your profile against official requirements. " + 
                                (state["service_guidance"].service_description if state.get("service_guidance") else ""),
            common_mistakes=["Forgetting photocopies of original documents", "Going to the wrong office"],
            tips_for_faster_processing=["Go early in the morning", "Ensure all fee payments are via Mpesa/Online"]
        )

        # 3. Decision Explanation
        eligibility = state.get("eligibility")
        rules_applied = [f"Citizenship: {state['input_data'].user_profile.citizenship_status}"]
        if eligibility:
             rules_applied.extend(eligibility.reasons)
        
        explanation = DecisionExplanation(
            rule_sources=["Knowledge Base (eCitizen Rules)", "Official Gazettes"],
            rules_applied=rules_applied,
            assumptions=["User data is accurate", "No legislative changes in last 24h"],
            limitations=["Does not account for impromptu system maintenance"]
        )

        # Construct Final Response
        # Note: We wrap the lists/objects into Dicts as per the Output Contract keys (e.g. "service_guidance" key)
        # Actually Model 'AgentResponse' has fields like 'service_guidance: Dict[str, ServiceSummary]' ??
        # Wait, the contract says:
        # { "service_guidance": { "service_summary": { ... } } }
        # My Pydantic model 'AgentResponse' did this:
        # service_guidance: Dict[str, ServiceSummary] # Key: service_summary
        
        # So I need to structure it carefully.
        
        final_resp = AgentResponse(
            service_guidance={"service_summary": state["service_guidance"]},
            location_resolution={"service_location": state["location_resolution"]},
            cost_and_time={
                "cost_information": state["cost_information"],
                "processing_time": state["processing_time"]
            },
            requirements_and_eligibility={
                "required_documents": state["required_documents"],
                "eligibility": state["eligibility"]
            },
            application_steps={"application_process": app_process},
            ai_guidance={"ai_guidance": ai_guidance},
            explainability={"decision_explanation": explanation},
            follow_up_prompt="Would you like help locating another service?"
        )

        # Convert pydantic to dict for the State
        return {
            "final_response": final_resp.model_dump()
        }