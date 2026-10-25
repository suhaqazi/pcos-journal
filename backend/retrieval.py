import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import errors as genai_errors
from google.genai import types
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from supabase_client import supabase

load_dotenv()

embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

GENERATION_MODEL = "gemini-3.6-flash"


class ModelUnavailableError(Exception):
    """Gemini couldn't be reached: out of credits, rate-limited, or down."""


NOT_FOUND_ANSWER = {
    "summary": "That's a really valid question.",
    "points": [
        {
            "heading": "Not enough information",
            "body": "I wasn't able to find specific information about this in the guidelines I have access to right now. It's always a good idea to bring questions like this to your healthcare provider."
        }
    ],
    "closing": "Your provider can give you the most accurate, personalized answer."
}


def embed_question(question: str) -> list[float]:
    """Turns a question into a vector. Raises ModelUnavailableError on failure."""
    try:
        return embeddings_model.embed_query(question)
    except Exception as e:
        # LangChain wraps every Gemini error in its own type, so catch broadly
        # here, but only around this one call
        raise ModelUnavailableError("Embedding failed") from e


def generate_answer(question: str, question_embedding: list[float]) -> dict:
    """
    Finds relevant guideline chunks for an already-embedded question and
    asks Gemini to answer. Returns {answer, sources, cacheable}.
    cacheable is False for answers that shouldn't be reused (nothing found,
    or Gemini returned broken JSON).
    Raises ModelUnavailableError if Gemini can't be reached.
    """

    # Step 2: Search Supabase for the most similar chunks
    response = supabase.rpc(
        "match_documents",
        {
            "query_embedding": question_embedding,
            "match_threshold": 0.65,
            "match_count": 8
        }
    ).execute()

    chunks = response.data

    # Step 3: If nothing relevant found, refuse to answer (no Gemini cost)
    if not chunks:
        return {"answer": json.dumps(NOT_FOUND_ANSWER), "sources": [], "cacheable": False}

    # Step 4: Build context from retrieved chunks
    context = ""
    sources = []

    for chunk in chunks:
        context += f"\n\nSOURCE: {chunk['source']}\nCONTENT: {chunk['content']}"
        if chunk['source'] not in sources:
            sources.append(chunk['source'])

    # Step 5: Prompt
    prompt = f"""You are Orchid, a warm and knowledgeable health companion for people with PCOS. You speak like a trusted friend who knows a lot about PCOS — calm, clear, never clinical or scary.

Answer the question below using ONLY the provided guideline excerpts.

Return your answer as a JSON object with exactly this structure:
{{
  "summary": "One warm sentence that directly answers the core of what was asked. Start with a validating phrase like 'You are not alone in wondering this' or 'This is such a common question'.",
  "points": [
    {{
      "heading": "Short 2-5 word heading for this point",
      "body": "2-3 warm, plain sentences expanding on this point. Use 'you' and 'your body'. No markdown, no asterisks, no bullet symbols."
    }}
  ],
  "closing": "One gentle sentence reminding them to talk to their healthcare provider for their specific situation."
}}

RULES:
- Use plain English. No markdown. No asterisks. No bold. No bullet points.
- Between 2 and 5 points depending on how much information is available.
- Never use the words 'excerpts', 'guidelines', 'clinical', or 'source' in any field.
- Do not include any source citation inside the JSON.
- If the question asks for personal medical advice, give the general information warmly but note that a provider knows their full picture best.

GUIDELINE EXCERPTS:
{context}

QUESTION: {question}"""

    # Step 6: Generate the answer. JSON mode makes Gemini return raw JSON
    # (no ```json fences, no extra text), so parsing almost never fails.
    try:
        result = client.models.generate_content(
            model=GENERATION_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
    except genai_errors.APIError as e:
        raise ModelUnavailableError("Generation failed") from e

    # Step 7: Parse, with a safe fallback just in case
    raw = (result.text or "").strip()
    try:
        return {"answer": json.dumps(json.loads(raw)), "sources": sources, "cacheable": True}
    except json.JSONDecodeError:
        fallback = json.dumps({
            "summary": "Here is what I found about your question.",
            "points": [{"heading": "From the guidelines", "body": raw}],
            "closing": "Please consult your healthcare provider for personalized guidance."
        })
        return {"answer": fallback, "sources": sources, "cacheable": False}


# Test it
if __name__ == "__main__":
    test_question = "What are the Rotterdam criteria for diagnosing PCOS?"
    print(f"Question: {test_question}\n")
    result = generate_answer(test_question, embed_question(test_question))
    print(f"Answer: {result['answer']}\n")
    print(f"Sources: {result['sources']}")