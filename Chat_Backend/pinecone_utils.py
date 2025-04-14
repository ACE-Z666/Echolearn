import os
from typing import List, Dict, Any
import pinecone
from langchain.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Setup constants
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY environment variable not set")

INDEX_NAME = "echo-chat-index"
NAMESPACE = "pdf-namespace"

def init_pinecone():
    """Initialize Pinecone client and create index if it doesn't exist"""
    pinecone.init(api_key=PINECONE_API_KEY)

    # Create index if it doesn't exist
    if INDEX_NAME not in pinecone.list_indexes():
        pinecone.create_index(
            name=INDEX_NAME,
            dimension=384,  # assuming embedding size from MiniLM
            metric="cosine"
        )

    return pinecone.Index(INDEX_NAME)

def get_embedding_model():
    """Get the embedding model"""
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        cache_folder="./model_cache"
    )

def upsert_documents(documents: List[Dict[str, Any]]):
    """Upsert documents to Pinecone"""
    index = init_pinecone()

    records = []
    for i, doc in enumerate(documents):
        record = {
            "id": f"doc_{i}",
            "values": get_embedding_model().embed_query(doc.page_content),
            "metadata": doc.metadata
        }
        records.append(record)

    # Upsert in batches
    batch_size = 100
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        index.upsert(vectors=batch, namespace=NAMESPACE)

def search_documents(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """Search for similar documents in Pinecone"""
    index = init_pinecone()

    query_vector = get_embedding_model().embed_query(query)

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        namespace=NAMESPACE,
        include_metadata=True
    )

    documents = []
    for match in results["matches"]:
        doc = {
            "page_content": match["metadata"].get("chunk_text", ""),
            "metadata": match["metadata"]
        }
        documents.append(doc)

    return documents
