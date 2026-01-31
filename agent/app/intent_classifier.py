from typing import Dict, Any
from .state import AgentState

class IntentClassifierNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        """
        Classifies intent between structured service request and general query.
        """
        print("--- INTENT CLASSIFICATION ---")
        input_data = state["input_data"]
        user_query = state.get("user_query")
        
        if user_query:
             print(f"Detected User Query: {user_query}")
        
        print(f"Detected Intent: {input_data.service_request.service_category} / {input_data.service_request.service_name}")
        
        return {
            "current_step": "intent_classified"
        }