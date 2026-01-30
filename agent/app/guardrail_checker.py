from typing import Dict, Any
from .state import AgentState
from .models import AgentInput

class GuardrailCheckerNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        """
        Validates the input data against the strict Pydantic models.
        In a real scenario, this might also check for malicious content, PII leakage, etc.
        """
        print("--- GUARDRAIL CHECK ---")
        
        # Since we are using TypedDict for state, input_data is expected to be present.
        input_data = state.get("input_data")
        
        if not input_data:
            return {"error": "Missing input data"}

        # If input_data is already an instance of AgentInput, we are good.
        # If it's a dict, we try to parse it.
        try:
            if not isinstance(input_data, AgentInput):
                # This re-validation ensures strict adherence even if passed as dict
                validated_input = AgentInput(**input_data)
                # We return the validated input model to ensure downstream nodes use the model
                return {"input_data": validated_input, "error": None}
            return {"error": None}
            
        except Exception as e:
            return {"error": f"Guardrail Violation: Invalid Input format. {str(e)}"}