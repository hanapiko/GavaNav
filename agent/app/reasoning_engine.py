import os
from typing import Dict, Any
from .state import AgentState
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

class ReasoningEngineNode:
    def __init__(self):
        from dotenv import load_dotenv
        load_dotenv()
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
            
            user_query = state.get("user_query", "")
            service_data = state.get("service_data")
            found_in_kb = service_data is not None
            
            # 1. Check for 'meaningless' or too short input
            is_noise = False
            if user_query and len(user_query.strip()) < 4:
                is_noise = True
            
            # --- PREPARE DYNAMIC MOCK IF NO LLM ---
            if not self.llm:
                service_name = service_data.get("name", "the requested service") if found_in_kb else "government services"
                
                if is_noise:
                    return {
                        "reasoning_explanation": "Query is too short or ambiguous to provide specific guidance.",
                        "validation_logic": "Input failed quality threshold.",
                        "chat_response": "I'm sorry, could you please provide more details about your request? I want to make sure I give you the most accurate information.",
                        "confidence_score": 0.2,
                        "llm_guidance": {
                            "tips": ["Be specific about the service you need", "Include your current situation"],
                            "common_mistakes": ["Typing too little information"]
                        }
                    }

                if found_in_kb:
                    explanation = f"I've verified the details for {service_name} from the official internal database."
                    chat_resp = f"I've found the official requirements for {service_name}. You'll need to pay KES {state.get('cost_information').official_fee_kes if state.get('cost_information') else 'the standard fee'} and visit a {state.get('location_resolution').primary_office.office_name if state.get('location_resolution') else 'Huduma Centre'}."
                    conf = 1.0
                else:
                    explanation = "Service not found in primary database. Search based on general knowledge."
                    chat_resp = "I couldn't find a specific match in our rule-set, but I've provided some general guidance based on common Kenyan government procedures."
                    conf = 0.6

                return {
                    "reasoning_explanation": explanation,
                    "validation_logic": "Cross-referenced with internal Knowledge Base." if found_in_kb else "Heuristic matching applied.",
                    "chat_response": chat_resp,
                    "confidence_score": conf,
                    "llm_guidance": {
                        "tips": ["Always carry original documents", "Confirm office hours before visiting"],
                        "common_mistakes": ["Forgetting to carry photocopies", "Using unauthorized agents"],
                        "reasoning_explanation": explanation
                    }
                }

            # --- REAL LLM LOGIC ---
            # Safety check for model_dump
            def safe_dump(obj):
                if hasattr(obj, "model_dump"): return obj.model_dump()
                if hasattr(obj, "dict"): return obj.dict()
                return obj

            context = {
                "user_profile": safe_dump(state.get("input_data", {}).user_profile) if state.get("input_data") else {},
                "service_request": safe_dump(state.get("input_data", {}).service_request) if state.get("input_data") else {},
                "user_query": user_query,
                "found_in_kb": found_in_kb,
                "service_data": service_data,
                "eligibility": safe_dump(state.get("eligibility")) if state.get("eligibility") else {},
                "cost": safe_dump(state.get("cost_information")) if state.get("cost_information") else {},
                "requirements": [safe_dump(d) for d in state.get("required_documents", [])]
            }

            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are GavaNav, the official AI Reasoning Engine for Kenyan Government services. 
                Your goal is to provide deep, custom-tailored analysis of the user's situation.
                
                STRICT GUIDELINES:
                1. NO GENERIC RESPONSES. Do not use phrases like "I am an AI" or "Standard procedures apply".
                2. DYNAMIC REASONING: Explain exactly how the user's specific profile (age: {age}, residency: {residency}) and specific query affects the decision.
                3. TRANSPARENCY: If the service data was found in our Knowledge Base (found_in_kb: {found_in_kb}), mention that the data is verified.
                4. TAILORED TIPS: Provide 3 tips that are uniquely relevant to the user's specific sub-situation (e.g. if they are in Nairobi, mention Nairobi-specific centers).
                5. CONFIDENCE SCORING: 
                   - 0.9-1.0: Found in KB and perfectly matches query.
                   - 0.6-0.8: Match is fuzzy or based on general procedures.
                   - <0.5: Highly ambiguous or likely noise.

                Return JSON with keys: 
                - reasoning_explanation: Step-by-step logic used to reach the conclusion.
                - validation_logic: The specific rule or KB entry that validates this.
                - tips: Array of 3 specific, actionable tips.
                - common_mistakes: Array of 2 pitfalls to avoid for THIS specific service.
                - chat_response: A natural, human-like response addressing the user by their situation (e.g., 'As a resident of {residency}...').
                - confidence_score: A precision float."""),
                ("user", "Context: {context}")
            ])

            chain = prompt | self.llm | JsonOutputParser()
            # Injecting variables directly into the template for better prompt grounding
            result = chain.invoke({
                "context": context,
                "age": context["user_profile"].get("age", "N/A"),
                "residency": context["user_profile"].get("citizenship_status", "N/A"),
                "found_in_kb": found_in_kb
            })
            
            return {
                "reasoning_explanation": result.get("reasoning_explanation", "Processed successfully."),
                "validation_logic": result.get("validation_logic", "Internal rules applied."),
                "chat_response": result.get("chat_response"),
                "confidence_score": float(result.get("confidence_score") or 0.8),
                "llm_guidance": result
            }
        except Exception as e:
            print(f"CRITICAL ERROR IN REASONING NODE: {e}")
            import traceback
            traceback.print_exc()
            
            # Identify if it's a quota error to inform the user
            error_msg = str(e)
            is_quota = "insufficient_quota" in error_msg or "429" in error_msg
            
            # FALLBACK: Use service_data to build a non-generic response
            if found_in_kb:
                name = service_data.get("name", "the service")
                auth = service_data.get("authority", "government authorities")
                fee = state.get("cost_information").official_fee_kes if state.get("cost_information") else "the standard amount"
                time = state.get("processing_time").estimated_duration_days if state.get("processing_time") else "a few"
                
                chat_resp = f"I've analyzed your request for a {name}. According to {auth}, the official fee is KES {fee} and it typically takes {time} days to process. Please ensure you have all required documents ready."
                if is_quota:
                    chat_resp += " (Note: Advanced AI analysis is currently limited due to API quota, but I have pulled the exact rules from our official database.)"
                
                tips = [f"Visit {auth} offices early in the morning", "Ensure all photocopies match your originals"]
                mistakes = ["Paying fees to third-party agents", "Submitting incomplete application forms"]
            else:
                chat_resp = "I couldn't find specific official data for that service in my registry, but I can guide you on general government procedures."
                tips = ["Check the eCitizen portal for new listings", "Visit the nearest Huduma Centre"]
                mistakes = ["Proceeding without official verification"]

            return {
                "reasoning_explanation": f"Rule-based recovery for {service_data.get('name') if found_in_kb else 'unknown service'}.",
                "validation_logic": "Verified against local Knowledge Base (2024 Edition).",
                "chat_response": chat_resp,
                "confidence_score": 0.8 if found_in_kb else 0.4,
                "llm_guidance": {
                    "tips": tips,
                    "common_mistakes": mistakes,
                    "reasoning_explanation": chat_resp
                }
            }

