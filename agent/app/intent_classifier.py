from typing import Dict, Any
from .state import AgentState

class IntentClassifierNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        """
        Classifies intent between structured service request and general query.
        """
        print("--- INTENT CLASSIFICATION ---")
        input_data = state["input_data"]
        user_query = state.get("user_query", "")
        if user_query is None: user_query = ""
        user_query = user_query.lower()
        
        # Keywords that suggest a specific Kenyan government service
        service_keywords = ["passport", "id", "card", "permit", "certificate", "license", "nhif", "kra", "pin", "birth", "death", "marriage", "huduma"]
        
        intent = "service_request"
        
        # If the query is personal or doesn't mention services, it's general chat
        if user_query:
            is_generic = True
            for kw in service_keywords:
                if kw in user_query:
                    is_generic = False
                    break
            
            if is_generic:
                intent = "general_chat"
                print(f"Detected General Chat: '{user_query}'")
        
        if intent == "service_request":
             print(f"Detected Intent: {input_data.service_request.service_category} / {input_data.service_request.service_name}")
        
        return {
            "current_step": "intent_classified",
            "intent": intent
        }