import os
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables on app startup
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

try:
    from backend.prompts import generate_poem_note
except ImportError:
    from prompts import generate_poem_note


app = FastAPI(
    title="My Special Year Calendar API",
    description="Backend API for personal year calendar with AI poem notes",
    version="0.1.0"
)

class PoemRequest(BaseModel):
    date: str = Field(..., description="ISO Date format YYYY-MM-DD", example="2026-10-14")
    title: str = Field(..., description="Milestone title", example="Mom's 60th Birthday")
    context: Optional[str] = Field(None, description="Optional personal details")

class PoemResponse(BaseModel):
    poemNote: str
    season: str
    status: str = "success"

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "model": "gemini-2.5-flash"
    }

@app.post("/api/generate", response_model=PoemResponse)
def generate_poem(req: PoemRequest):
    if not req.date.strip() or not req.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Date and Title fields cannot be empty."
        )
    
    result = generate_poem_note(req.date, req.title, req.context)
    return PoemResponse(
        poemNote=result["poemNote"],
        season=result["season"],
        status="success"
    )

# Serve frontend static files if directory exists
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def read_root():
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "Frontend index.html not found"}
