from langgraph.graph import StateGraph, END
from graph.state import AgentState
from graph.nodes import (
    classify_intent,
    retrieve_rules,
    build_response,
    handle_general_inquiry,
)

//decision maker: decides the next node
def route(state: AgentState) -> str:
    if state["detected_intent"] == "service_application":
        return "retrieve_rules"
    return "general_help"


def build_workflow():
    graph = StateGraph(AgentState)

    graph.add_node("classify_intent", classify_intent)
    graph.add_node("retrieve_rules", retrieve_rules)
    graph.add_node("build_response", build_response)
    graph.add_node("general_help", handle_general_inquiry)

    graph.set_entry_point("classify_intent")

    graph.add_conditional_edges(
        "classify_intent",
        route,
        {
            "retrieve_rules": "retrieve_rules",
            "general_help": "general_help",
        },
    )

    graph.add_edge("retrieve_rules", "build_response")
    graph.add_edge("build_response", END)
    graph.add_edge("general_help", END)

    return graph.compile()
