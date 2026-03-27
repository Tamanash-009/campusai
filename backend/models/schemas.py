from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[list[str]] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


class AssignmentRequest(BaseModel):
    question: str
    subject: Optional[str] = None
    topic: Optional[str] = None


class AssignmentResponse(BaseModel):
    guidance: str
    steps: list[str]
    tips: list[str]


class StudyPlanRequest(BaseModel):
    exams: list[dict]
    subjects: list[str]


class StudyPlanResponse(BaseModel):
    schedule: list[dict]
    total_days: int
    summary: str


class ResumeRequest(BaseModel):
    name: str
    email: str
    phone: str
    education: list[dict]
    experience: list[dict]
    skills: list[str]
    projects: list[dict]
    certifications: list[str] = []


class ResumeResponse(BaseModel):
    resume_text: str
    ats_optimized: str


class CareerRequest(BaseModel):
    skills: list[str]
    interests: list[str]
    education_level: str
    current_role: Optional[str] = None


class CareerResponse(BaseModel):
    career_paths: list[dict]
    certifications: list[dict]
    roadmap: list[dict]
