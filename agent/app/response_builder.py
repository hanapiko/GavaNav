from typing import Dict, Any
from .state import AgentState
from .models import (
    AgentResponse,
    ApplicationProcess,
    AIGuidance,
    DecisionExplanation
)

class ResponseBuilderNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        print("--- BUILDING RESPONSE ---")

        # ---------- 1. Application Process ----------
        eligibility = state.get("eligibility")

        if eligibility and eligibility.status == "eligible":
            steps = [
                {"step_number": 1, "instruction": "Gather all required documents listed."},
                {
                    "step_number": 2,
                    "instruction": (
                        f"Visit {state['location_resolution'].primary_office.office_name} "
                        "or apply online if applicable."
                    )
                },
                {"step_number": 3, "instruction": "Pay the processing fee."},
                {"step_number": 4, "instruction": "Submit biometrics and application form."},
                {"step_number": 5, "instruction": "Await notification to collect your document."}
            ]
        else:
            steps = [
                {
                    "step_number": 1,
                    "instruction": "Review eligibility criteria and resolve ineligibility reasons."
                }
            ]

        application_process = ApplicationProcess(steps=steps)

        # ---------- 2. AI Guidance ----------
        service_guidance = state.get("service_guidance")

        ai_guidance = AIGuidance(
            summary_explanation=(
                "I analyzed your profile against official government requirements. "
                + (service_guidance.service_description if service_guidance else "")
            ),
            common_mistakes=[
                "Missing required photocopies",
                "Visiting the wrong service office"
            ],
            tips_for_faster_processing=[
                "Arrive early",
                "Ensure payment is completed online before visiting"
            ]
        )

        # ---------- 3. Decision Explanation ----------
        rules_applied = [
            f"Citizenship status: {state['input_data'].user_profile.citizenship_status}"
        ]

        if eligibility:
            rules_applied.extend(eligibility.reasons)

        decision_explanation = DecisionExplanation(
            rule_sources=[
                "Government Knowledge Base",
                "Official Gazette Publications"
            ],
            rules_applied=rules_applied,
            assumptions=[
                "User-provided data is accurate",
                "No recent legal changes"
            ],
            limitations=[
                "System outages are not accounted for"
            ]
        )

        # ---------- 4. Final API Response ----------
        final_response = AgentResponse(
            service_guidance={
                "service_summary": service_guidance
            },
            location_resolution={
                "service_location": state.get("location_resolution")
            },
            cost_and_time={
                "cost_information": state.get("cost_information"),
                "processing_time": state.get("processing_time")
            },
            requirements_and_eligibility={
                "required_documents": state.get("required_documents", []),
                "eligibility": eligibility
            },
            application_steps={
                "application_process": application_process
            },
            ai_guidance={
                "ai_guidance": ai_guidance
            },
            explainability={
                "decision_explanation": decision_explanation
            },
            follow_up_prompt="Would you like help with another government service?"
        )

        return {
            "final_response": final_response.model_dump()
        }
