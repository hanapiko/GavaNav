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
    service_category: Literal["identity", "health", "transport", "social_services", "education"]
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

    @validator("session_context")
    def validate_timestamp(cls, v):
        # Basic validation to ensure ISO format if needed, 
        # but pydantic can handle datetime parsing if we changed type to datetime.
        # Keeping as string per contract, but good to know.
        return v

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
    steps: List[Dict[str, Any]]  # Expected format: { "step_number": 1, "instruction": "string" }

class AIGuidance(BaseModel):
    summary_explanation: str
    common_mistakes: List[str]
    tips_for_faster_processing: List[str]

class DecisionExplanation(BaseModel):
    rule_sources: List[str]
    rules_applied: List[str]
    assumptions: List[str]
    limitations: List[str]

class AgentResponse(BaseModel):
    service_guidance: Dict[str, ServiceSummary] # Key: service_summary
    location_resolution: Dict[str, ServiceLocation] # Key: service_location
    cost_and_time: Dict[str, Any] # Keys: cost_information, processing_time
    requirements_and_eligibility: Dict[str, Any] # Keys: required_documents, eligibility
    application_steps: Dict[str, ApplicationProcess] # Key: application_process
    ai_guidance: Dict[str, AIGuidance] # Key: ai_guidance
    explainability: Dict[str, DecisionExplanation] # Key: decision_explanation
    follow_up_prompt: str