from typing import Dict, Any
from .state import AgentState

class IntentClassifierNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        """
        In a text-based agent, this would use LLM to classify intent.
        With structured input, we just acknowledge the intent.
        """
        print("--- INTENT CLASSIFICATION ---")
        input_data = state["input_data"]
        print(f"Detected Intent: {input_data.service_request.service_category} / {input_data.service_request.service_name}")
        
        return {
            "current_step": "intent_classified"
        }