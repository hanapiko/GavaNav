from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from .models import AgentInput, AgentResponse
from .graph import GavaNavAgent

router = APIRouter()
agent = GavaNavAgent()

@router.post("/agent", response_model=Dict[str, Any]) 
# Note: Return type is Dict because AgentResponse structure is complex and we want the final_response dict
# But for better docs we could use AgentResponse, but the graph returns state.
async def run_agent(input_data: AgentInput):
    try:
        # Initialize state with input
        initial_state = {
            "input_data": input_data,
            # Initialize other keys to None/Empty to satisfy TypedDict if needed 
            # (TypedDict usually doesn't enforce all keys at init if partial=False, but StateGraph handles it)
        }
        
        result_state = agent.invoke(initial_state)
        
        if result_state.get("error"):
            raise HTTPException(status_code=400, detail=result_state["error"])
            
        final = result_state.get("final_response")
        if not final:
            raise HTTPException(status_code=500, detail="Agent failed to generate response")
            
        return final
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "GavaNav Agent"}