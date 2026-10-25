import logging
import os
import time

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

import allowance
from mock import MOCK_RESULT
from retrieval import ModelUnavailableError, retrieve_and_answer

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pcos-api")

# Settings (all from environment variables) 

# true = return the saved sample answer instead of calling Gemini
MOCK_LLM = os.getenv("MOCK_LLM", "false").lower() == "true"

# Short-term anti-spam limit per IP address. Daily allowances
# (guests vs signed-in users) are handled separately in allowance.py.
ASK_RATE_LIMIT = os.getenv("ASK_RATE_LIMIT", "5/minute")

# Which websites may call this API (comma-separated)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

if MOCK_LLM:
    logger.warning("MOCK_LLM is on: /ask returns a sample answer, Gemini is not called")

# App setup 

app = FastAPI(
    title="PCOS Journal API",
    description="RAG-powered PCOS health information API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # we don't use cookies
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# Rate limiting: counts requests per IP address
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "You're asking quickly. Please wait a moment and try again."},
    )


# Request / response shapes 
class QuestionRequest(BaseModel):
    question: str


class QuestionResponse(BaseModel):
    answer: str  # a JSON string: {summary, points, closing}
    sources: list[str]
    remaining: int | None = None  # questions left today (None if unknown)

# Endpoints 

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/ask", response_model=QuestionResponse)
@limiter.limit(ASK_RATE_LIMIT)
def ask_question(request: Request, body: QuestionRequest):
    # `request` is needed by the rate limiter; the JSON body is `body`
    question = body.question.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if len(question) > 500:
        raise HTTPException(
            status_code=400,
            detail="Question too long. Please keep it under 500 characters",
        )

    # Daily allowance: who's asking, and do they have questions left?
    asker = allowance.identify(request)
    allowed, remaining = allowance.use(asker)
    if not allowed:
        raise HTTPException(status_code=429, detail=allowance.limit_message(asker))

    if MOCK_LLM:
        time.sleep(0.8)  # pretend to think, so loading states are visible
        return QuestionResponse(**MOCK_RESULT, remaining=remaining)

    try:
        result = retrieve_and_answer(question)
    except ModelUnavailableError:
        # Gemini is down, out of credits, or rate-limiting us.
        # Not the user's fault, so give their question back.
        logger.exception("Gemini unavailable")
        allowance.refund(asker)
        raise HTTPException(
            status_code=503,
            detail="Orchid is resting right now. Please try again a little later.",
        )
    except Exception:
        # Anything unexpected: log the details, show the user something calm
        logger.exception("Unexpected error in /ask")
        allowance.refund(asker)
        raise HTTPException(
            status_code=500,
            detail="Something went wrong on our side. Please try again.",
        )

    return QuestionResponse(
        answer=result["answer"], sources=result["sources"], remaining=remaining
    )