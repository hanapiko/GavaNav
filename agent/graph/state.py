from typing import TypedDict, List, Optional, Dict, Any

class AgentState(TypedDict):
    user_message: str

    detected_intent: str
    detected_service: str
    detected_location: Optional[str]

    service_rules: Dict[str, Any]

    steps: List[str]
    explanation: str
    confidence_score: float

    metadata: Dict[str, Any]
