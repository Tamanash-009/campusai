from fastapi import APIRouter
from datetime import datetime
from supabase import create_client, Client
from config import settings

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


@router.get("/analytics")
async def get_analytics():
    try:
        docs = supabase.table("documents").select("*").execute()
        return {
            "total_documents": len(docs.data),
            "documents": docs.data,
            "date": datetime.now().isoformat()
        }
    except:
        return {"total_documents": 0, "documents": [], "date": datetime.now().isoformat()}


@router.get("/usage")
async def get_usage_stats():
    return {
        "total_chats_today": 0,
        "total_users": 0,
        "feature_usage": {
            "chat": 0,
            "assignment": 0,
            "study_plan": 0,
            "resume": 0,
            "career": 0
        }
    }
