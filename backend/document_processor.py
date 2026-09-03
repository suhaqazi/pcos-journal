import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from supabase import create_client

# Load environment variables from .env file
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

# Text splitter - breaks documents into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
    separators=["\n\n", "\n", ".", "?", "!", " "]
)

def process_document(pdf_path, source, source_type, topics, year):
    """
    Takes a PDF file and stores its chunks and embeddings in Supabase.
    
    pdf_path: path to the PDF file
    source: human readable name e.g. "ESHRE 2023 Guideline"
    source_type: category e.g. "clinical_guideline"
    topics: list of topics e.g. ["diagnosis", "mental_health"]
    year: publication year e.g. 2023
    """
    
    print(f"Loading {source}...")
    
    # Step 1: Load the PDF
    loader = PyPDFLoader(pdf_path)
    pages = loader.load()
    print(f"Loaded {len(pages)} pages")
    
    # Step 2: Split into chunks
    chunks = text_splitter.split_documents(pages)
    print(f"Split into {len(chunks)} chunks")
    
    # Step 3: Process each chunk
    for index, chunk in enumerate(chunks):
        
        # Step 4: Generate embedding for this chunk
        embedding = embeddings_model.embed_query(chunk.page_content)
        
        # Step 5: Store in Supabase
        supabase.table("documents").insert({
            "content": chunk.page_content,
            "embedding": embedding,
            "source": source,
            "source_type": source_type,
            "topic": topics,
            "year": year,
            "chunk_index": index
        }).execute()
        
        print(f"Stored chunk {index + 1} of {len(chunks)}")
    
    print(f"Done processing {source}")


# Run this when we have documents ready
if __name__ == "__main__":
    process_document(
        pdf_path="../corpus/guidelines/eshre-pcos-2023.pdf",
        source="ESHRE 2023 International Evidence-Based Guideline for PCOS",
        source_type="clinical_guideline",
        topics=["diagnosis", "treatment", "mental_health", "fertility", "lifestyle"],
        year=2023
    )