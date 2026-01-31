from typing import TypedDict, Optional, List, Dict, Any
from .models import (
    AgentInput, 
    ServiceSummary, 
    ServiceLocation, 
    CostInformation, 
    ProcessingTime,
    RequiredDocument,
    Eligibility,
    ApplicationProcess,
    AIGuidance,
    DecisionExplanation
)

class AgentState(TypedDict):
    # Input
    input_data: AgentInput
    user_query: Optional[str]
    chat_history: List[Dict[str, str]]
    
    # Internal Processing State
    current_step: str
    intent: Optional[str] # e.g., "service_request" or "general_chat"
    error: Optional[str]
    service_data: Optional[Dict[str, Any]]
    
    # Partial Outputs (to be built up by nodes)
    service_guidance: Optional[ServiceSummary]
    location_resolution: Optional[ServiceLocation]
    cost_information: Optional[CostInformation]
    processing_time: Optional[ProcessingTime]
    required_documents: List[RequiredDocument]
    eligibility: Optional[Eligibility]
    application_process: Optional[ApplicationProcess]
    ai_guidance: Optional[AIGuidance]
    decision_explanation: Optional[DecisionExplanation]
    # LLM Reasoning
    reasoning_explanation: Optional[str]
    validation_logic: Optional[str]
    chat_response: Optional[str]
    confidence_score: Optional[float]
    llm_guidance: Optional[Dict[str, Any]]
    search_results: Optional[List[Dict[str, Any]]] # Live data from web search
    
    # Final Response
    final_response: Optional[Dict[str, Any]] 