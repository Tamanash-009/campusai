from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from routes.chat import router as chat_router
from routes.documents import router as documents_router
from routes.assignment import router as assignment_router
from routes.study_plan import router as study_plan_router
from routes.resume import router as resume_router
from routes.career import router as career_router
from routes.admin import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("CampusAI Backend Started!")
    yield
    print("CampusAI Backend Shutting Down!")


app = FastAPI(
    title="CampusAI API",
    description="AI-powered Smart Campus Assistant for Brainware University",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(documents_router, prefix="/api", tags=["Documents"])
app.include_router(assignment_router, prefix="/api", tags=["Assignment"])
app.include_router(study_plan_router, prefix="/api", tags=["Study Planner"])
app.include_router(resume_router, prefix="/api", tags=["Resume"])
app.include_router(career_router, prefix="/api", tags=["Career"])
app.include_router(admin_router, prefix="/api", tags=["Admin"])


@app.get("/")
async def root():
    return {"message": "CampusAI Backend API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
