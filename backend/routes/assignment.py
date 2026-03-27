from fastapi import APIRouter
from models.schemas import AssignmentRequest, AssignmentResponse
from services.assignment import process_assignment

router = APIRouter()


@router.post("/assignment", response_model=AssignmentResponse)
async def get_assignment_help(request: AssignmentRequest):
    return await process_assignment(request)
