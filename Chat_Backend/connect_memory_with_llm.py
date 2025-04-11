import os
from functools import lru_cache
from typing import List, Dict, Any, Optional

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from pinecone_utils import search_documents

# Setup constants
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY environment variable not set")

# RAG prompt template
CUSTOM_PROMPT_TEMPLATE = """You are a helpful and knowledgeable assistant that can handle three types of questions.

IMPORTANT RULES:
1. For greeting questions (like "hello", "hi", "good morning", etc.):
   - Respond with a friendly greeting
   - Keep the response concise and warm
   - You can use your general knowledge for these

2. For general knowledge questions (like algorithms, concepts, definitions, etc.):
   - Use your general knowledge to provide accurate and helpful answers
   - Structure your response clearly and concisely
   - Include relevant examples when appropriate
   - You can use your training data for these types of questions

3. For context-based questions (about specific documents/content):
   - ONLY use information from the provided context to answer
   - DO NOT use any external knowledge or make assumptions
   - DO NOT provide partial answers if the complete answer isn't in the context
   - If the question is not related to the context, respond with "This question is not related to the provided context."

Context: {context}
Query: {query}

Answer:"""

@lru_cache(maxsize=1)
def load_llm():
    """Load the Mistral Small model through OpenRouter"""
    return ChatOpenAI(
        model="mistralai/mistral-small-3.1-24b-instruct:free",
        openai_api_key=OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        temperature=0.5,
        max_tokens=1024
    )

def set_custom_prompt(custom_prompt_template: str) -> PromptTemplate:
    """Create a prompt template for RAG"""
    return PromptTemplate(
        template=custom_prompt_template,
        input_variables=["context", "query"]
    )

def process_query(query: str) -> Dict[str, Any]:
    """
    Process a query using the RAG system
    Returns: Dict containing answer and page numbers
    """
    try:
        # Get relevant documents from Pinecone
        docs = search_documents(query, top_k=3)
        context = "\n\n".join([doc['page_content'] for doc in docs])
        
        # Create prompt
        prompt = set_custom_prompt(CUSTOM_PROMPT_TEMPLATE)
        formatted_prompt = prompt.format(context=context, query=query)
        
        # Get response from LLM
        llm = load_llm()
        response = llm.invoke(formatted_prompt)
        
        # Extract page numbers from metadata
        page_numbers = [doc['metadata'].get('page', 0) for doc in docs]
        
        return {
            'answer': response.content,
            'page_numbers': page_numbers,
            'error': None
        }
    except Exception as e:
        print(f"Error in process_query: {str(e)}")  # Debug logging
        return {
            'answer': '',
            'page_numbers': [],
            'error': str(e)
        }

# Export these for use in app.py
__all__ = [
    'load_llm',
    'set_custom_prompt',
    'process_query',
    'CUSTOM_PROMPT_TEMPLATE'
]



