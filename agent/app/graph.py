from langgraph.graph import StateGraph, END
from typing import Dict, Any
from .state import AgentState
from .intent_classifier import IntentClassifierNode
from .knowledge_checker import KnowledgeCheckerNode
from .location_resolver import LocationResolverNode
from .eligibility_checker import EligibilityCheckerNode
from .requirement_checker import RequirementCheckerNode
from .guardrail_checker import GuardrailCheckerNode
from .response_builder import ResponseBuilderNode
from .reasoning_engine import ReasoningEngineNode
from .search_engine import WebSearchNode

class GavaNavAgent:
    def __init__(self):
        self.workflow = StateGraph(AgentState)
        
        # Add nodes
        self.workflow.add_node("guardrail_node", GuardrailCheckerNode())
        self.workflow.add_node("intent_node", IntentClassifierNode())
        self.workflow.add_node("search_node", WebSearchNode())
        self.workflow.add_node("knowledge_node", KnowledgeCheckerNode())
        self.workflow.add_node("location_node", LocationResolverNode())
        self.workflow.add_node("eligibility_node", EligibilityCheckerNode())
        self.workflow.add_node("requirement_node", RequirementCheckerNode())
        self.workflow.add_node("reasoning_node", ReasoningEngineNode())
        self.workflow.add_node("response_node", ResponseBuilderNode())
        
        # Define edges
        self.workflow.set_entry_point("guardrail_node")
        
        # Conditional edge: If guardrail fails, stop.
        self.workflow.add_conditional_edges(
            "guardrail_node", 
            lambda s: END if s.get("error") else "intent_node"
        )
        
        # Route based on intent
        self.workflow.add_conditional_edges(
            "intent_node",
            lambda s: "reasoning_node" if s.get("intent") == "general_chat" else "search_node"
        )
        
        self.workflow.add_edge("search_node", "knowledge_node")
        self.workflow.add_edge("knowledge_node", "location_node")
        self.workflow.add_edge("location_node", "eligibility_node")
        self.workflow.add_edge("eligibility_node", "requirement_node")
        self.workflow.add_edge("requirement_node", "reasoning_node")
        self.workflow.add_edge("reasoning_node", "response_node")
        self.workflow.add_edge("response_node", END)
        
        self.app = self.workflow.compile()

        
    def invoke(self, input_data: Dict[str, Any]):
        return self.app.invoke(input_data)