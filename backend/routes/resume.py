from fastapi import APIRouter
from models.schemas import ResumeRequest, ResumeResponse
from services.resume_builder import generate_resume

router = APIRouter()


@router.post("/resume", response_model=ResumeResponse)
async def create_resume(request: ResumeRequest):
    return await generate_resume(request)
