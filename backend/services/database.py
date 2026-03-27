from supabase._sync.client import create_client, Client
from config import settings

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

VECTOR_DIM = 768


def store_document_chunks(document_id: str, chunks: list):
    for chunk in chunks:
        supabase.table("document_chunks").insert({
            "document_id": document_id,
            "content": chunk["content"],
            "metadata": chunk["metadata"]
        }).execute()


def search_similar_chunks(query_embedding: list, top_k: int = 5) -> list[str]:
    try:
        result = supabase.rpc("match_documents", {
            "query_embedding": query_embedding,
            "match_threshold": 0.7,
            "match_count": top_k
        }).execute()
        
        return [item["content"] for item in result.data]
    except:
        return []


def get_all_documents():
    try:
        return supabase.table("documents").select("*").execute().data
    except:
        return []


def delete_document(doc_id: str):
    supabase.table("document_chunks").delete().eq("document_id", doc_id).execute()
    supabase.table("documents").delete().eq("id", doc_id).execute()
