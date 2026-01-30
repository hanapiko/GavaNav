from typing import Dict, Any, List
from ..core.state import AgentState
from ..core.models import RequiredDocument

class RequirementCheckerNode:
    def __call__(self, state: AgentState) -> Dict[str, Any]:
        print("--- REQUIREMENT CHECK ---")
        input_data = state["input_data"]
        app_type = input_data.user_profile.application_type
        service_data = state.get("service_data", {})
        
        reqs_map = service_data.get("requirements", {})
        
        # Get specific requirements or default to any available
        docs_data = []
        if app_type in reqs_map:
            docs_data = reqs_map[app_type]
        else:
            # Fallback: grab the first list found
            if reqs_map:
                docs_data = list(reqs_map.values())[0]
        
        required_documents = []
        for d in docs_data:
            required_documents.append(RequiredDocument(
                document_name=d["name"],
                mandatory=d["mandatory"],
                notes=d["notes"]
            ))
            
        return {
            "required_documents": required_documents
        }