import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from supabase import create_client, Client
from config import settings
from services.rag import process_document
import uuid

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    file_id = str(uuid.uuid4())
    file_path = f"/tmp/{file_id}_{file.filename}"
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    try:
        chunks = process_document(file_path, {
            "source": file.filename,
            "doc_type": "syllabus"
        })
        
        doc_data = {
            "id": file_id,
            "name": file.filename,
            "doc_type": "syllabus",
            "chunks_count": len(chunks)
        }
        
        try:
            supabase.table("documents").insert(doc_data).execute()
        except Exception as doc_err:
            print(f"Document insert error (non-critical): {doc_err}")
        
        try:
            for chunk in chunks:
                supabase.table("document_chunks").insert({
                    "document_id": file_id,
                    "content": chunk["content"],
                    "metadata": chunk["metadata"]
                }).execute()
        except Exception as chunk_err:
            print(f"Chunk insert error (non-critical): {chunk_err}")
        
        os.remove(file_path)
        
        return {"message": "Document uploaded successfully", "doc_id": file_id, "chunks": len(chunks)}
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents")
async def list_documents():
    try:
        docs = supabase.table("documents").select("*").order("uploaded_at", desc=True).execute()
        return docs.data
    except Exception as e:
        print(f"List documents error: {e}")
        return []


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    try:
        supabase.table("document_chunks").delete().eq("document_id", doc_id).execute()
    except:
        pass
    try:
        supabase.table("documents").delete().eq("id", doc_id).execute()
    except:
        pass
    return {"message": "Document deleted"}
