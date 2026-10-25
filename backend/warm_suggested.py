"""
Generates and saves answers for the Ask page's suggested questions.

Run once (and again after bumping CORPUS_VERSION), with MOCK_LLM off:
    python warm_suggested.py

Costs one Gemini generation per question that isn't saved yet.
Keep this list in sync with SUGGESTED_QUESTIONS in frontend/app/ask/page.tsx.
"""

import suggested
from retrieval import embed_question, generate_answer

SUGGESTED_QUESTIONS = [
    "Why are my cycles so irregular?",
    "What actually counts as a PCOS symptom?",
    "Can PCOS change my hair and skin?",
    "What should I ask my doctor first?",
    "How does insulin resistance connect to PCOS?",
    "Why do I feel so tired all the time?",
    "Can PCOS affect my mood?",
    "What lifestyle changes actually help with PCOS?",
    "Is PCOS the reason I'm gaining weight?",
    "What are the Rotterdam criteria?",
]

if __name__ == "__main__":
    for q in SUGGESTED_QUESTIONS:
        if suggested.find(q):
            print(f"✓ already saved: {q}")
            continue

        result = generate_answer(q, embed_question(q))
        if result["cacheable"]:
            suggested.save(q, result["answer"], result["sources"])
            print(f"+ saved: {q}")
        else:
            print(f"! skipped (no good answer found, check this one): {q}")

    print("Done.")