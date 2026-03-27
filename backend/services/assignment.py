import google.generativeai as genai
from models.schemas import AssignmentRequest, AssignmentResponse
from config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

ASSIGNMENT_PROMPT = """You are an Assignment Helper AI for university students. Your goal is to guide students through assignments WITHOUT giving direct answers - you help them LEARN.

For the assignment below, provide:
1. A brief explanation of the key concepts involved
2. Step-by-step approach/strategy to tackle it
3. Helpful tips and common pitfalls to avoid
4. Suggested resources for further learning

Remember: Guide them to the solution, don't give it to them directly.

ASSIGNMENT:
Subject: {subject}
Topic: {topic}
Question: {question}
"""


async def process_assignment(request: AssignmentRequest) -> AssignmentResponse:
    prompt = ASSIGNMENT_PROMPT.format(
        subject=request.subject or "General",
        topic=request.topic or "Not specified",
        question=request.question
    )
    
    response = model.generate_content(prompt)
    
    text = response.text
    steps = []
    tips = []
    
    if "Step-by-step" in text or "Here's" in text.lower():
        lines = text.split("\n")
        for line in lines:
            if line.strip().startswith(("1.", "2.", "3.", "4.", "5.", "Step")):
                steps.append(line.strip())
    
    if "tip" in text.lower() or "avoid" in text.lower():
        lines = text.split("\n")
        for line in lines:
            if "tip" in line.lower() or "avoid" in line.lower() or "•" in line:
                tips.append(line.strip())
    
    if not steps:
        steps = ["Break down the problem into smaller parts", "Research the key concepts", "Create an outline", "Draft your solution", "Review and refine"]
    
    if not tips:
        tips = ["Start early to allow time for revisions", "Understand concepts before memorizing", "Practice with similar problems", "Don't hesitate to ask questions"]
    
    return AssignmentResponse(
        guidance=text,
        steps=steps[:5],
        tips=tips[:5]
    )
