from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from tqdm import tqdm
from pinecone_utils import upsert_documents

# Step 1 : Load RAW PDF
DATA_PATH = "./data"

def load_pdf_files(data):
    print("Loading PDF files...")
    loader = DirectoryLoader(data,
                           glob='*.pdf',
                           loader_cls=PyPDFLoader)
    
    documents = loader.load()
    return documents

def create_chunks(extracted_data):
    print("Creating text chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    text_chunks = text_splitter.split_documents(extracted_data)
    print(f"Created {len(text_chunks)} chunks of text")
    return text_chunks

if __name__ == "__main__":
    try:
        # Load and process documents
        documents = load_pdf_files(data=DATA_PATH)
        print(f"Loaded {len(documents)} PDF pages")

        # Create text chunks
        text_chunks = create_chunks(extracted_data=documents)
        print(f"Created {len(text_chunks)} text chunks")

        # Upsert to Pinecone
        print("Upserting documents to Pinecone...")
        upsert_documents(text_chunks)
        print("Process completed successfully!")
        
    except KeyboardInterrupt:
        print("\nProcess interrupted by user. Progress up to this point may be lost.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")