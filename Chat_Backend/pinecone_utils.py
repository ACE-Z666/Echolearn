import os
from typing import List, Dict, Any
from pinecone import Pinecone, ServerlessSpec
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Logging config
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY environment variable not set")

INDEX_NAME = "echo-chat-index"
NAMESPACE = "pdf-namespace"
MODEL_CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".model_cache")

# Initialize Pinecone client once
pc = Pinecone(api_key=PINECONE_API_KEY)

def init_pinecone():
    """Initialize Pinecone index (create if needed) and return index object"""
    if INDEX_NAME not in pc.list_indexes().names():
        logger.info(f"Creating Pinecone index '{INDEX_NAME}'...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,  # Change this to match your embedding model's output size
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-west-2")  # Change region if needed
        )

    return pc.Index(INDEX_NAME)

def get_embedding_model():
    """Get HuggingFace embedding model with caching"""
    try:
        os.makedirs(MODEL_CACHE_DIR, exist_ok=True)
        logger.info(f"Using model cache directory: {MODEL_CACHE_DIR}")
        return HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            cache_folder=MODEL_CACHE_DIR
        )
    except Exception as e:
        logger.error(f"Error loading embedding model: {str(e)}")
        raise RuntimeError(f"Failed to load embedding model: {str(e)}")

def upsert_documents(documents: List[Dict[str, Any]]):
    """Upsert documents into Pinecone vector DB"""
    index = init_pinecone()
    embedder = get_embedding_model()

    records = []
    for i, doc in enumerate(documents):
        vector = embedder.embed_query(doc["page_content"])
        record = {
            "id": f"doc_{i}",
            "values": vector,
            "metadata": doc["metadata"]
        }
        records.append(record)

    batch_size = 100
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        index.upsert(vectors=batch, namespace=NAMESPACE)

def search_documents(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """Search similar documents by embedding vector"""
    index = init_pinecone()
    embedder = get_embedding_model()

    query_vector = embedder.embed_query(query)

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        namespace=NAMESPACE,
        include_metadata=True
    )

    documents = []
    for match in results["matches"]:
        documents.append({
            "page_content": match["metadata"].get("chunk_text", ""),
            "metadata": match["metadata"]
        })

    return documents
