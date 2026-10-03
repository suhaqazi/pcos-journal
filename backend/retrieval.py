import os
import json
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from supabase import create_client
from google import genai

load_dotenv()

# Initialize connections
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def retrieve_and_answer(question: str) -> dict:
    """
    Takes a question, finds relevant chunks from Supabase,
    sends them to Gemini, returns a structured answer.
    """

    # Step 1: Embed the question
    question_embedding = embeddings_model.embed_query(question)

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

    # Step 3: If nothing relevant found, refuse to answer
    if not chunks:
        return {
            "answer": json.dumps({
                "summary": "That's a really valid question.",
                "points": [
                    {
                        "heading": "Not enough information",
                        "body": "I wasn't able to find specific information about this in the guidelines I have access to right now. It's always a good idea to bring questions like this to your healthcare provider."
                    }
                ],
                "closing": "Your provider can give you the most accurate, personalized answer."
            }),
            "sources": []
        }

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
- Return ONLY the JSON object. No extra text before or after it.
- Use plain English. No markdown. No asterisks. No bold. No bullet points.
- Between 2 and 5 points depending on how much information is available.
- Never use the words 'excerpts', 'guidelines', 'clinical', or 'source' in any field.
- Do not include any source citation inside the JSON.
- If the question asks for personal medical advice, give the general information warmly but note that a provider knows their full picture best.

GUIDELINE EXCERPTS:
{context}

QUESTION: {question}

JSON ANSWER:"""

    # Step 6: Generate answer using Gemini
    result = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    # Step 7: Parse JSON — clean up any markdown fences if present
    raw = result.text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        parsed = json.loads(raw)
        answer_str = json.dumps(parsed)
    except json.JSONDecodeError:
        # Fallback if Gemini doesn't return valid JSON
        answer_str = json.dumps({
            "summary": "Here is what I found about your question.",
            "points": [
                {
                    "heading": "From the guidelines",
                    "body": raw
                }
            ],
            "closing": "Please consult your healthcare provider for personalized guidance."
        })

    return {
        "answer": answer_str,
        "sources": sources
    }


# Test it
if __name__ == "__main__":
    test_question = "What are the Rotterdam criteria for diagnosing PCOS?"
    print(f"Question: {test_question}\n")
    result = retrieve_and_answer(test_question)
    print(f"Answer: {result['answer']}\n")
    print(f"Sources: {result['sources']}")