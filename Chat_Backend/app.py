from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import logging
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from connect_memory_with_llm import process_query
import datetime

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for FastAPI"""
    # Startup
    try:
        logger.info("Initializing Pinecone...")
        # Validate environment variables
        if not os.getenv("PINECONE_API_KEY"):
            logger.error("PINECONE_API_KEY environment variable is not set")
            raise EnvironmentError("PINECONE_API_KEY environment variable is not set")
        
        logger.info("Pinecone initialized successfully!")
    except Exception as e:
        logger.error(f"Error initializing Pinecone: {str(e)}")
        raise
    yield
    # Shutdown
    logger.info("Shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Echo Chat API",
    description="API for Echo Chat - A PDF-based Question Answering System with RAG",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Railway deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Validate environment variables
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    logger.error("OPENROUTER_API_KEY environment variable is not set")
    raise EnvironmentError("OPENROUTER_API_KEY environment variable is not set")

# Request/Response Models
class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    page_numbers: List[int]
    error: Optional[str] = None

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {"status": "healthy", "timestamp": datetime.datetime.now().isoformat()}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "message": "Echo Chat API is running",
        "endpoints": {
            "health": "/health",
            "query": "/api/query",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

@app.post("/api/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """
    Process a query using RAG and return the answer with page numbers
    """
    try:
        # Log incoming request
        logger.info(f"Received query: {request.query}")

        # Validate input
        if not request.query.strip():
            logger.warning("Empty query received")
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        # Process query using RAG
        logger.info("Processing query through RAG system...")
        result = process_query(request.query)
        
        if result["error"]:
            logger.error(f"Error processing query: {result['error']}")
            raise HTTPException(status_code=500, detail=result["error"])

        logger.info("Query processed successfully")
        return QueryResponse(
            answer=result["answer"],
            page_numbers=result["page_numbers"],
            error=None
        )

    except HTTPException as he:
        logger.error(f"HTTP Exception: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return QueryResponse(
            answer="",
            page_numbers=[],
            error=f"An unexpected error occurred: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting Echo Chat API development server...")
    print("\nAPI Documentation available at:")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",  # Changed from 0.0.0.0 to 127.0.0.1 for local development
        port=int(os.environ.get("PORT", 8000)),
        reload=True,  # Enable auto-reload for development
    )