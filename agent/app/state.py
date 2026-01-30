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
    
    # Internal Processing State
    current_step: str
    error: Optional[str]
    service_data: Optional[Dict[str, Any]] # Raw data from knowledge base specific to the requested service
    
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
    
    # Final Response
    final_response: Optional[Dict[str, Any]] # The complete JSON response