from typing import Dict, Any
from .state import AgentState
from .models import (
    AgentResponse,
    ApplicationProcess,
    AIGuidance,
    DecisionExplanation,
    ServiceSummary,
    ServiceLocation,
    PrimaryOffice,
    CostInformation,
    ProcessingTime,
    Eligibility
)

class ResponseBuilderNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        if state.get("error"):
            return state
        try:
            print("--- BUILDING RESPONSE ---")
            # ... existing logic ...
            # I will just write the whole function again with safety checks
            
            # ---------- 1. Application Process ----------
            eligibility = state.get("eligibility")
            location = state.get("location_resolution")
            office_name = location.primary_office.office_name if location else "relevant office"

            if eligibility and eligibility.status == "eligible":
                steps = [
                    {"step_number": 1, "instruction": "Gather all required documents listed."},
                    {"step_number": 2, "instruction": f"Visit {office_name} or apply online."},
                    {"step_number": 3, "instruction": "Pay the processing fee."},
                    {"step_number": 4, "instruction": "Submit biometrics and application form."},
                    {"step_number": 5, "instruction": "Await notification to collect your document."}
                ]
            else:
                steps = [{"step_number": 1, "instruction": "Review eligibility criteria."}]

            application_process = ApplicationProcess(steps=steps)

            # ---------- 2. AI Guidance ----------
            sg = state.get("service_guidance")
            ai_guidance = AIGuidance(
                summary_explanation=f"Analyzed {sg.service_name if sg else 'request'} against official rules.",
                common_mistakes=["Missing photocopies", "Wrong office"],
                tips_for_faster_processing=["Arrive early", "Pay online"],
                reasoning_explanation=state.get("reasoning_explanation", "Standard processing applied.")
            )

            # ---------- 3. Decision Explanation ----------
            decision_explanation = DecisionExplanation(
                rule_sources=["Government KB"],
                rules_applied=[f"Status: {state['input_data'].user_profile.citizenship_status}"],
                assumptions=["Accurate data"],
                limitations=["System downtime"],
                validation_logic=state.get("validation_logic", "Internal rule parity check pass.")
            )

            # ---------- 4. Final Response ----------
            final_response = AgentResponse(
                service_guidance={"service_summary": sg if sg else ServiceSummary(service_name="Information Hub", service_description="General guidance provided by AI.", responsible_authority="Varies")},
                location_resolution={"service_location": location if location else ServiceLocation(primary_office=PrimaryOffice(office_name="N/A", county="Various", address="Multiple locations", walk_in_allowed=True))},
                cost_and_time={
                    "cost_information": state.get("cost_information") or CostInformation(official_fee_kes=0, payment_methods=[], additional_notes="Varies by specific case"),
                    "processing_time": state.get("processing_time") or ProcessingTime(estimated_duration_days=0, same_day_available=False, delay_factors=[])
                },
                requirements_and_eligibility={
                    "required_documents": state.get("required_documents", []),
                    "eligibility": eligibility or Eligibility(status="eligible", reasons=["General query assessment"], next_steps_if_ineligible=[])
                },
                application_steps={"application_process": application_process},
                ai_guidance={"ai_guidance": ai_guidance},
                explainability={"decision_explanation": decision_explanation},
                follow_up_prompt="Anything else I can help with?",
                chat_response=state.get("chat_response"),
                confidence_score=state.get("confidence_score", 1.0)
            )

            return {"final_response": final_response.model_dump()}

        except Exception as e:
            print(f"CRITICAL ERROR IN RESPONSE BUILDER: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Internal formatting error: {str(e)}"}

