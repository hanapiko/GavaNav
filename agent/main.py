from fastapi import FastAPI
from pydantic import BaseModel
from graph.workflow import build_workflow

app = FastAPI()
agent = build_workflow()


class ChatRequest(BaseModel):
    user_id: str
    message: str


@app.post("/chat")
async def chat(req: ChatRequest):
    initial_state = {
        "user_message": req.message,
        "detected_intent": "",
        "detected_service": "",
        "detected_location": None,
        "service_rules": {},
        "steps": [],
        "explanation": "",
        "confidence_score": 0.0,
        "metadata": {},
    }

    result = agent.invoke(initial_state)

    return {
        "intent": result["detected_intent"],
        "service_name": result["detected_service"],
        "steps": result["steps"],
        "explanation": result["explanation"],
        "confidence_score": result["confidence_score"],
        "metadata": result["metadata"],
    }
