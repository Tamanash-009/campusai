import google.generativeai as genai
from models.schemas import CareerRequest, CareerResponse
from config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

CAREER_PROMPT = """Provide career guidance for a university student based on their skills and interests.

SKILLS: {skills}
INTERESTS: {interests}
EDUCATION LEVEL: {education_level}
CURRENT ROLE: {current_role}

Provide:
1. CAREER PATHS - 5 potential career paths with job roles
2. CERTIFICATIONS - Relevant certifications to pursue
3. ROADMAP - Step-by-step roadmap to achieve the top career goal

Format as JSON with:
- career_paths: array of {{title, description, roles: [], salary_range}}
- certifications: array of {{name, provider, priority}}
- roadmap: array of {{step, duration, action}}
"""


async def get_career_guidance(request: CareerRequest) -> CareerResponse:
    prompt = CAREER_PROMPT.format(
        skills=", ".join(request.skills),
        interests=", ".join(request.interests),
        education_level=request.education_level,
        current_role=request.current_role or "Student"
    )
    
    response = model.generate_content(prompt)
    
    import json
    import re
    
    try:
        json_match = re.search(r'\{[\s\S]*\}', response.text)
        if json_match:
            data = json.loads(json_match.group())
            return CareerResponse(
                career_paths=data.get("career_paths", []),
                certifications=data.get("certifications", []),
                roadmap=data.get("roadmap", [])
            )
    except:
        pass
    
    return CareerResponse(
        career_paths=[
            {"title": "Software Developer", "description": "Build applications and systems", "roles": ["Frontend Dev", "Backend Dev", "Full Stack"], "salary_range": "$60k-$120k"},
            {"title": "Data Analyst", "description": "Analyze data for insights", "roles": ["Data Analyst", "BI Analyst", "Analytics Engineer"], "salary_range": "$55k-$100k"},
            {"title": "Product Manager", "description": "Lead product development", "roles": ["Associate PM", "Product Manager", "Senior PM"], "salary_range": "$70k-$150k"}
        ],
        certifications=[
            {"name": "AWS Cloud Practitioner", "provider": "Amazon", "priority": "High"},
            {"name": "Google Data Analytics", "provider": "Google", "priority": "Medium"}
        ],
        roadmap=[
            {"step": 1, "duration": "3-6 months", "action": "Build foundational skills"},
            {"step": 2, "duration": "6-12 months", "action": "Gain practical experience"},
            {"step": 3, "duration": "12-18 months", "action": "Earn certifications"},
            {"step": 4, "duration": "18+ months", "action": "Advance to senior roles"}
        ]
    )
