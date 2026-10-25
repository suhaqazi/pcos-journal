"""
Saved answers for the Ask page's suggested questions.

Lookups are "best effort": if Supabase fails, we log it and the question
is simply answered by Gemini as normal. Saving answers to the table is
done by warm_suggested.py, never during normal requests.
"""

import logging
import os
import re

from supabase_client import supabase

logger = logging.getLogger("pcos-api.suggested")

# Bump this (in .env) when the guideline corpus changes, then re-run
# warm_suggested.py so the saved answers include the new knowledge.
CORPUS_VERSION = int(os.getenv("CORPUS_VERSION", "1"))


def normalize(question: str) -> str:
    """'  Why are my cycles SO irregular?? ' -> 'why are my cycles so irregular'"""
    text = re.sub(r"[^\w\s]", "", question.lower())
    return " ".join(text.split())


def find(question: str) -> dict | None:
    try:
        rows = (
            supabase.table("suggested_answers")
            .select("answer, sources")
            .eq("normalized_question", normalize(question))
            .eq("corpus_version", CORPUS_VERSION)
            .limit(1)
            .execute()
            .data
        )
        return rows[0] if rows else None
    except Exception:
        logger.exception("Suggested answer lookup failed")
        return None


def save(question: str, answer: str, sources: list[str]) -> None:
    supabase.table("suggested_answers").upsert(
        {
            "question": question,
            "normalized_question": normalize(question),
            "answer": answer,
            "sources": sources,
            "corpus_version": CORPUS_VERSION,
        },
        on_conflict="normalized_question,corpus_version",
    ).execute()