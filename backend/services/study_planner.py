import google.generativeai as genai
from models.schemas import StudyPlanRequest, StudyPlanResponse
from config import settings
from datetime import datetime, timedelta

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

STUDY_PLAN_PROMPT = """Create a personalized study schedule for a university student.

EXAM DATES: {exams}
SUBJECTS: {subjects}

Requirements:
1. Day-by-day schedule from today until the last exam
2. Distribute study time based on exam proximity (closer exams = more time)
3. Include breaks and revision days
4. Prioritize difficult topics
5. Format as a structured JSON schedule

Return JSON with:
- schedule: array of {{date, subject, duration, topics, status}}
- total_days: number of study days
- summary: brief overview
"""


async def generate_study_plan(request: StudyPlanRequest) -> StudyPlanResponse:
    prompt = STUDY_PLAN_PROMPT.format(
        exams="\n".join([f"- {e.get('name', 'Exam')}: {e.get('date', 'TBD')}" for e in request.exams]),
        subjects=", ".join(request.subjects)
    )
    
    response = model.generate_content(prompt)
    
    try:
        import json
        import re
        
        json_match = re.search(r'\{[\s\S]*\}', response.text)
        if json_match:
            data = json.loads(json_match.group())
        else:
            data = {"schedule": [], "total_days": 0, "summary": response.text}
        
        return StudyPlanResponse(
            schedule=data.get("schedule", []),
            total_days=data.get("total_days", 0),
            summary=data.get("summary", response.text[:500])
        )
    except:
        return StudyPlanResponse(
            schedule=[],
            total_days=0,
            summary="Unable to generate detailed schedule. Please try again."
        )


def export_as_calendar_link(schedule: list[dict]) -> str:
    base_url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
    events = []
    
    for item in schedule[:10]:
        title = f"Study: {item.get('subject', 'Study')}"
        events.append(f"{item.get('subject', 'Study')} - {item.get('topics', 'Review')}")
    
    return f"{base_url}&text=CampusAI+Study+Plan&details=Study+Schedule+from+CampusAI"
