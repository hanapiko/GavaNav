from graph.workflow import build_workflow
from graph.state import AgentState

def main():
    # Build (compile) the LangGraph workflow
    agent = build_workflow()

    # Initial state (THIS IS REQUIRED)
    state: AgentState = {
        "user_message": "How do I apply for a passport?",
        "detected_intent": "",
        "detected_service": "",
        "detected_location": None,
        "service_rules": {},
        "steps": [],
        "explanation": "",
        "confidence_score": 0.0,
        "metadata": {},
    }

    # Run the agent
    result = agent.invoke(state)

    # Print results
    print("\n--- AGENT OUTPUT ---")
    print("Steps:", result.get("steps"))
    print("Explanation:", result.get("explanation"))
    print("Confidence:", result.get("confidence_score"))


if __name__ == "__main__":
    main()
