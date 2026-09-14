import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from retrieval import retrieve_and_answer

load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="PCOS Journal API",
    description="RAG-powered PCOS health information API",
    version="1.0.0"
)

# Allows frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Defines what a question request looks like
class QuestionRequest(BaseModel):
    question: str

# Defines what our response looks like
class QuestionResponse(BaseModel):
    answer: str
    sources: list[str]

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Main RAG endpoint
@app.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    
    # Validate question is not empty
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty"
        )
    
    # Validate question is not too long
    if len(request.question) > 500:
        raise HTTPException(
            status_code=400,
            detail="Question too long. Please keep it under 500 characters"
        )
    
    # Get answer from RAG system
    result = retrieve_and_answer(request.question)
    
    return QuestionResponse(
        answer=result["answer"],
        sources=result["sources"]
    )