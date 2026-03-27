from fastapi import APIRouter
from models.schemas import CareerRequest, CareerResponse
from services.career import get_career_guidance

router = APIRouter()


@router.post("/career", response_model=CareerResponse)
async def get_career_advice(request: CareerRequest):
    return await get_career_guidance(request)
