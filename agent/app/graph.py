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

class GavaNavAgent:
    def __init__(self):
        self.workflow = StateGraph(AgentState)
        
        # Add nodes
        self.workflow.add_node("guardrail", GuardrailCheckerNode())
        self.workflow.add_node("intent", IntentClassifierNode())
        self.workflow.add_node("knowledge", KnowledgeCheckerNode())
        self.workflow.add_node("location", LocationResolverNode())
        self.workflow.add_node("eligibility", EligibilityCheckerNode())
        self.workflow.add_node("requirements", RequirementCheckerNode())
        self.workflow.add_node("response", ResponseBuilderNode())
        
        # Define edges
        self.workflow.set_entry_point("guardrail")
        
        # Conditional edge: If guardrail fails, stop? 
        # For now, we assume happy path or error propagation via state
        self.workflow.add_edge("guardrail", "intent")
        self.workflow.add_edge("intent", "knowledge")
        self.workflow.add_edge("knowledge", "location")
        self.workflow.add_edge("location", "eligibility")
        self.workflow.add_edge("eligibility", "requirements")
        self.workflow.add_edge("requirements", "response")
        self.workflow.add_edge("response", END)
        
        self.app = self.workflow.compile()
        
    def invoke(self, input_data: Dict[str, Any]):
        return self.app.invoke(input_data)