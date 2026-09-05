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
            "match_threshold": 0.5,
            "match_count": 5
        }
    ).execute()

    chunks = response.data

    # Step 3: If nothing relevant found, refuse to answer
    if not chunks:
        return {
            "answer": "I could not find relevant information in the clinical guidelines to answer this question. Please consult your healthcare provider.",
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
    prompt = f"""You are a knowledgeable health information assistant specializing in PCOS (Polycystic Ovary Syndrome).

Answer the question below using ONLY the provided clinical guideline excerpts.
- Always cite the source
- Never add information not present in the excerpts
- If the question asks for personal medical advice (dosage, diagnosis, treatment decisions), explain the general information but always recommend consulting a healthcare provider
- Be warm, clear and informative

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