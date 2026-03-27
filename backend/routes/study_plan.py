from fastapi import APIRouter
from models.schemas import StudyPlanRequest, StudyPlanResponse
from services.study_planner import generate_study_plan, export_as_calendar_link

router = APIRouter()


@router.post("/study-plan", response_model=StudyPlanResponse)
async def create_study_plan(request: StudyPlanRequest):
    return await generate_study_plan(request)


@router.post("/study-plan/export")
async def export_study_plan(schedule: list):
    return {"calendar_link": export_as_calendar_link(schedule)}
