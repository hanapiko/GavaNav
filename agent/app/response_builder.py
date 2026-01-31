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
            print(f"--- BUILDING RESPONSE (Intent: {state.get('intent')}) ---")
            
            # Retrieve data from state
            sg = state.get("service_guidance")
            location = state.get("location_resolution")
            cost = state.get("cost_information")
            proc_time = state.get("processing_time")
            docs = state.get("required_documents") or []
            eligibility = state.get("eligibility")
            llm_guide = state.get("llm_guidance") or {}
            
            # 1. APPLICATION PROCESS
            office_name = location.primary_office.office_name if location else "the relevant office"
            if eligibility and eligibility.status == "eligible":
                steps = [
                    {"step_number": 1, "instruction": "Gather all required documents listed in the checklist."},
                    {"step_number": 2, "instruction": f"Visit {office_name} or log in to the eCitizen portal."},
                    {"step_number": 3, "instruction": f"Pay the official fee of KES {cost.official_fee_kes if cost else 'required amount'}."},
                    {"step_number": 4, "instruction": "Submit your application and await verification."},
                    {"step_number": 5, "instruction": "You will be notified once the document is ready for collection."}
                ]
            else:
                steps = [{"step_number": 1, "instruction": "Review the eligibility conditions."}]
            
            app_process = ApplicationProcess(steps=steps)

            # 2. AI GUIDANCE
            ai_guidance = AIGuidance(
                summary_explanation=llm_guide.get("chat_response") or state.get("chat_response") or "Analysis complete.",
                common_mistakes=llm_guide.get("common_mistakes") or ["General error matching", "Service verify fail"],
                tips_for_faster_processing=llm_guide.get("tips") or ["Be accurate", "Check eCitizen"],
                reasoning_explanation=state.get("reasoning_explanation") or "Standard rule-based check applied."
            )

            # 3. DECISION EXPLANATION
            decision_explanation = DecisionExplanation(
                rule_sources=llm_guide.get("rule_sources") or ["Kenya Government Official Knowledge Base 2024"],
                rules_applied=llm_guide.get("rules_applied") or [f"Intent Detection: {state.get('intent')}", f"Service Resolution: {sg.service_name if sg else 'N/A'}"],
                assumptions=["Information provided is current and valid"],
                limitations=["Real-time system uptime varies", "Final decision resides with the government officer"],
                validation_logic=state.get("validation_logic", "Internal Logic Check Pass.")
            )

            # 4. ENHANCE COST NOTES WITH BREAKDOWN
            if cost and cost.breakdown:
                breakdown_str = "\nAvailable Tiers: " + ", ".join([f"{k}: KES {v}" for k, v in cost.breakdown.items()])
                cost.additional_notes += breakdown_str

            # 5. CONSTRUCT FINAL RESPONSE
            final_response = AgentResponse(
                service_guidance={"service_summary": sg if sg else ServiceSummary(service_name="GavaNav Assistant", service_description="General support and information hub.", responsible_authority="N/A")},
                location_resolution={"service_location": location if location else ServiceLocation(primary_office=PrimaryOffice(office_name="N/A", county="N/A", address="Not applicable", walk_in_allowed=True))},
                cost_and_time={
                    "cost_information": cost or CostInformation(official_fee_kes=0, payment_methods=[], additional_notes="Varies"),
                    "processing_time": proc_time or ProcessingTime(estimated_duration_days=0, same_day_available=False, delay_factors=[])
                },
                requirements_and_eligibility={
                    "required_documents": docs,
                    "eligibility": eligibility or Eligibility(status="eligible", reasons=["General query assessment"], next_steps_if_ineligible=[])
                },
                application_steps={"application_process": app_process},
                ai_guidance={"ai_guidance": ai_guidance},
                explainability={"decision_explanation": decision_explanation},
                follow_up_prompt="Is there anything else I can help with?",
                chat_response=state.get("chat_response"),
                confidence_score=state.get("confidence_score") or 1.0
            )

            return {"final_response": final_response.model_dump()}

        except Exception as e:
            print(f"CRITICAL ERROR IN RESPONSE BUILDER: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Internal formatting error: {str(e)}"}
