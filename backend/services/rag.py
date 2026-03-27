import os
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from config import settings

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

def extract_text_from_pdf(pdf_path: str) -> str:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def chunk_text(text: str) -> list[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " "]
    )
    return splitter.split_text(text)

def process_document(file_path: str, metadata: dict | None = None) -> list[dict]:
    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)
    
    documents = []
    for i, chunk in enumerate(chunks):
        documents.append({
            "content": chunk,
            "metadata": {
                "source": metadata.get("source", "unknown") if metadata else "unknown",
                "doc_type": metadata.get("doc_type", "general") if metadata else "general",
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
        })
    
    return documents
