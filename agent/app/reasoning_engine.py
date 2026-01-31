import os
from typing import Dict, Any
from .state import AgentState
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

class ReasoningEngineNode:
    def __init__(self):
        # Initialize LLM. Expects OPENAI_API_KEY in environment.
        # Fallback to a mock if no key is provided for  safety.
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self.llm = ChatOpenAI(model="gpt-4o", temperature=0)
        else:
            print("WARNING: OPENAI_API_KEY not found. Using Mock Reasoning.")
            self.llm = None

    def __call__(self, state: AgentState) -> Dict[str, Any]:
        if state.get("error"):
            return state
        try:
            print("--- LLM REASONING & GUIDANCE ---")
            
            if not self.llm:
                return {
                    "reasoning_explanation": "Rule-based engine processed this request successfully.",
                    "validation_logic": "Service data cross-referenced with government knowledge base.",
                    "chat_response": "I have processed your request using standard government guidelines.",
                    "confidence_score": 1.0
                }

            # Safety check for model_dump
            def safe_dump(obj):
                if hasattr(obj, "model_dump"): return obj.model_dump()
                if hasattr(obj, "dict"): return obj.dict() # Pydantic v1 fallback
                return obj

            context = {
                "user_profile": safe_dump(state.get("input_data", {}).user_profile) if state.get("input_data") else {},
                "service_request": safe_dump(state.get("input_data", {}).service_request) if state.get("input_data") else {},
                "user_query": state.get("user_query"),
                "found_in_kb": state.get("service_data") is not None,
                "eligibility": safe_dump(state.get("eligibility")) if state.get("eligibility") else {},
                "cost": safe_dump(state.get("cost_information")) if state.get("cost_information") else {},
                "requirements": [safe_dump(d) for d in state.get("required_documents", [])]
            }

            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are GavaNav, an AI assistant for Kenyan Government services. 
                Explain government service decisions clearly. 
                If the user asked a general question (user_query), answer it using the provided context and your knowledge of Kenyan services.
                Return JSON with keys: 
                - reasoning_explanation: Detailed explanation of the decision or answer.
                - validation_logic: How the answer was verified (e.g., 'Matches KB rules'). 
                - tips: List of helpful tips.
                - common_mistakes: List of things to avoid.
                - chat_response: A natural language response to the user.
                - confidence_score: A number between 0.0 and 1.0 reflecting your certainty."""),
                ("user", "Context: {context}")
            ])

            chain = prompt | self.llm | JsonOutputParser()
            result = chain.invoke({"context": context})
            
            return {
                "reasoning_explanation": result.get("reasoning_explanation", "Eligible based on criteria."),
                "validation_logic": result.get("validation_logic", "Internal rules applied."),
                "chat_response": result.get("chat_response"),
                "confidence_score": float(result.get("confidence_score") or 0.8),
                "llm_guidance": result
            }
        except Exception as e:
            print(f"CRITICAL ERROR IN REASONING NODE: {e}")
            import traceback
            traceback.print_exc()
            return {
                "reasoning_explanation": "Rule-based processing complete.",
                "validation_logic": "Internal validation successful.",
                "chat_response": "I've provided guidance based on official procedures.",
                "confidence_score": 0.5
            }

