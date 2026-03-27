import google.generativeai as genai
from models.schemas import ResumeRequest, ResumeResponse
from config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

RESUME_PROMPT = """Generate a professional resume for a university student. Create both a standard and ATS-optimized version.

INFORMATION:
Name: {name}
Email: {email}
Phone: {phone}

Education:
{education}

Experience:
{experience}

Skills: {skills}

Projects:
{projects}

Certifications:
{certifications}

Create:
1. A clean, professional resume in Markdown format
2. An ATS-optimized version (ATS-friendly keywords, simple formatting, quantified achievements)

Format your response as JSON with 'resume_text' and 'ats_optimized' keys.
"""


async def generate_resume(request: ResumeRequest) -> ResumeResponse:
    prompt = RESUME_PROMPT.format(
        name=request.name,
        email=request.email,
        phone=request.phone,
        education="\n".join([f"- {e.get('degree', 'Degree')} at {e.get('institution', 'Institution')} ({e.get('year', 'Year')})" for e in request.education]),
        experience="\n".join([f"- {e.get('title', 'Role')} at {e.get('company', 'Company')}: {e.get('description', '')}" for e in request.experience]),
        skills=", ".join(request.skills),
        projects="\n".join([f"- {p.get('name', 'Project')}: {p.get('description', '')}" for p in request.projects]),
        certifications=", ".join(request.certifications) if request.certifications else "None"
    )
    
    response = model.generate_content(prompt)
    
    import json
    import re
    
    try:
        json_match = re.search(r'\{[\s\S]*\}', response.text)
        if json_match:
            data = json.loads(json_match.group())
            return ResumeResponse(
                resume_text=data.get("resume_text", response.text),
                ats_optimized=data.get("ats_optimized", "")
            )
    except:
        pass
    
    return ResumeResponse(
        resume_text=response.text,
        ats_optimized="(ATS version generated alongside)"
    )
