import os
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
    sends them to Gemini, returns a cited answer.
    """

    # Step 1: Convert the question into an embedding
    question_embedding = embeddings_model.embed_query(question)

    # Step 2: Search Supabase for the most similar chunks
    response = supabase.rpc(
        "match_documents",
        {
            "query_embedding": question_embedding,
            "match_threshold": 0.7,
            "match_count": 5
        }
    ).execute()

    chunks = response.data

    # Step 3: If nothing relevant found, refuse to answer
    if not chunks:
        return {
            "answer": "That's a really valid question. I wasn't able to find specific information about this in the clinical guidelines I have access to right now. It's always a good idea to bring questions like this to your healthcare provider — they can give you the most accurate, personalized answer.",
            "sources": []
        }

    # Step 4: Build context from retrieved chunks
    context = ""
    sources = []

    for chunk in chunks:
        context += f"\n\nSOURCE: {chunk['source']}\nCONTENT: {chunk['content']}"
        if chunk['source'] not in sources:
            sources.append(chunk['source'])

    # Step 5: Build the prompt
    prompt = f"""You are Orchid, a warm and knowledgeable health companion for people with PCOS. You speak like a trusted friend who happens to know a lot about PCOS — calm, clear, and never clinical or scary.

Your job is to answer the question below using ONLY the provided clinical guideline excerpts. 

TONE AND FORMAT RULES — follow these exactly:
- Write in plain, conversational English. No markdown. No asterisks. No bold. No bullet points with dashes or stars.
- Use short paragraphs — 2 to 4 sentences each. Leave a blank line between paragraphs.
- If there are multiple points to cover, write each as its own short paragraph with a clear opening sentence.
- Start with a warm, validating sentence that acknowledges the question — something like "This is such a common concern" or "You're not alone in wondering about this."
- Use words like "you" and "your body" to make it feel personal and safe.
- End with one gentle sentence reminding them to talk to their healthcare provider for their specific situation.
- Never use the words "excerpts", "guidelines", "clinical", or "source" in the answer itself.
- If the question asks for personal medical advice like dosage, diagnosis, or treatment decisions, explain the general information warmly but remind them that a provider who knows their full picture is the best person to help with the specifics.
- Do not include any source citation in your answer. Sources are handled separately.

CLINICAL GUIDELINE EXCERPTS:
{context}

QUESTION: {question}

ANSWER:"""

    # Step 6: Generate answer using Gemini
    result = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return {
        "answer": result.text,
        "sources": sources
    }


# Test it
if __name__ == "__main__":
    test_question = "What are the Rotterdam criteria for diagnosing PCOS?"
    print(f"Question: {test_question}\n")
    result = retrieve_and_answer(test_question)
    print(f"Answer: {result['answer']}\n")
    print(f"Sources: {result['sources']}")