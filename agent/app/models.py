from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, Literal
from datetime import datetime

# --- INPUT MODELS ---

class UserProfile(BaseModel):
    county: str = Field(..., description="County of residence")
    sub_county: Optional[str] = Field(None, description="Sub-county of residence")
    age: int = Field(..., description="Age of the applicant")
    citizenship_status: Literal["kenyan_citizen", "resident", "foreign_national"]
    application_type: Literal["first_time", "renewal", "replacement"]

class ServiceRequest(BaseModel):
    # Expanded category list to match frontend and future services
    service_category: str = Field(..., description="Category of the service (e.g., identity, transport, health, civil_registration, etc.)")
    service_name: str = Field(..., description="Specific name of the service")
    urgency_level: Literal["normal", "urgent"]

class SessionContext(BaseModel):
    language_preference: Literal["en", "sw"]
    device_type: Literal["mobile", "desktop"]
    timestamp: str = Field(..., description="ISO-8601 string")

class AgentInput(BaseModel):
    user_profile: UserProfile
    service_request: ServiceRequest
    session_context: SessionContext
    user_query: Optional[str] = Field(None, description="Free-text user query or follow-up question")

# --- OUTPUT MODELS ---

class ServiceSummary(BaseModel):
    service_name: str
    service_description: str
    responsible_authority: str

class PrimaryOffice(BaseModel):
    office_name: str
    county: str
    address: str
    walk_in_allowed: bool

class ServiceLocation(BaseModel):
    primary_office: PrimaryOffice
    alternative_offices: List[Dict[str, Any]] = Field(default_factory=list)

class CostInformation(BaseModel):
    official_fee_kes: float
    payment_methods: List[str]
    additional_notes: str

class ProcessingTime(BaseModel):
    estimated_duration_days: int
    same_day_available: bool
    delay_factors: List[str]

class RequiredDocument(BaseModel):
    document_name: str
    mandatory: bool
    notes: str = ""

class Eligibility(BaseModel):
    status: Literal["eligible", "conditionally_eligible", "not_eligible"]
    reasons: List[str]
    next_steps_if_ineligible: List[str]

class ApplicationProcess(BaseModel):
    steps: List[Dict[str, Any]]

class AIGuidance(BaseModel):
    summary_explanation: str
    common_mistakes: List[str]
    tips_for_faster_processing: List[str]
    # New field for LLM provided guidance
    reasoning_explanation: Optional[str] = None 

class DecisionExplanation(BaseModel):
    rule_sources: List[str]
    rules_applied: List[str]
    assumptions: List[str]
    limitations: List[str]
    # New field for how the decision was validated
    validation_logic: Optional[str] = None

class AgentResponse(BaseModel):
    service_guidance: Dict[str, ServiceSummary]
    location_resolution: Dict[str, ServiceLocation]
    cost_and_time: Dict[str, Any]
    requirements_and_eligibility: Dict[str, Any]
    application_steps: Dict[str, ApplicationProcess]
    ai_guidance: Dict[str, AIGuidance]
    explainability: Dict[str, DecisionExplanation]
    follow_up_prompt: str
    chat_response: Optional[str] = None
    confidence_score: float = Field(default=1.0, ge=0.0, le=1.0)