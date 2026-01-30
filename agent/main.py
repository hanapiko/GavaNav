from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title="GavaNav Agent",
    description="Kenyan Government Services AI Agent",
    version="1.0.0"
)

app.include_router(router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)