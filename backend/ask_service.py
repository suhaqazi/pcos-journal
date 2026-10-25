"""
The journey of one question:

  1. Is it one of our suggested questions? -> saved answer, no Gemini cost
  2. Otherwise                             -> normal RAG answer from Gemini

Nothing users ask is saved here. Signed-in users' questions are only
stored in their own private history (the questions table, saved by the
frontend and protected by row level security).
"""

import logging

import suggested
from retrieval import embed_question, generate_answer

logger = logging.getLogger("pcos-api.ask")


def answer_question(question: str) -> dict:
    saved = suggested.find(question)
    if saved:
        logger.info("Served a saved suggested answer")
        return {"answer": saved["answer"], "sources": saved["sources"]}

    result = generate_answer(question, embed_question(question))
    return {"answer": result["answer"], "sources": result["sources"]}