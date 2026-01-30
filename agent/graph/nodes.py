import json
from graph.state import AgentState
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "rules.json"


def classify_intent(state: AgentState) -> AgentState:
    message = state["user_message"].lower()

    if "passport" in message:
        state["detected_intent"] = "service_application"
        state["detected_service"] = "Passport"
    else:
        state["detected_intent"] = "general_inquiry"
        state["detected_service"] = "Unknown"

    state["metadata"]["classification_method"] = "keyword_matching"
    return state


def retrieve_rules(state: AgentState) -> AgentState:
    if state["detected_service"] == "Unknown":
        return state

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        rules = json.load(f)

    service = state["detected_service"]
    state["service_rules"] = rules.get(service, {})
    return state


def build_response(state: AgentState) -> AgentState:
    rules = state.get("service_rules", {})

    if not rules:
        state["explanation"] = "I couldn't find official information for this service."
        state["confidence_score"] = 0.4
        return state

    state["steps"] = rules.get("requirements", [])
    state["explanation"] = (
        f"💰 Cost: KES {rules.get('cost')}\n"
        f"⏱ Processing Time: {rules.get('processing_time')}\n"
        f"🌐 Apply via eCitizen"
    )
    state["confidence_score"] = 0.95
    return state


def handle_general_inquiry(state: AgentState) -> AgentState:
    state["explanation"] = (
        "I'm GavaNav. I help you understand Kenyan government services "
        "like passports, IDs, and permits."
    )
    state["confidence_score"] = 0.8
    return state
