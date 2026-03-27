import google.generativeai as genai
from config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash")
chat_sessions = {}


SYSTEM_PROMPT = """You are CampusAI, the smart virtual assistant for Brainware University students. 
Your role is to help students with:
- University information (timetables, exams, syllabus, fees, events)
- Academic guidance and study tips
- General questions about campus life
- Assignment help (guiding, not giving direct answers)

Always be helpful, friendly, and concise. If you don't know something specific 
about Brainware University, suggest the student contact the relevant department.

Remember: You are here to help students learn, not just give them answers."""


def get_or_create_chat(session_id: str):
    if session_id not in chat_sessions:
        chat_sessions[session_id] = model.start_chat(history=[])
    return chat_sessions[session_id]


async def generate_response(message: str, session_id: str, context: list[str] | None = None) -> str:
    chat = get_or_create_chat(session_id)
    
    prompt = message
    if context:
        context_text = "\n\n".join(context)
        prompt = f"Based on the following university documents:\n{context_text}\n\nPlease answer this question: {message}"
    
    response = await chat.send_message_async(prompt)
    return response.text


async def generate_streaming_response(message: str, session_id: str, context: list[str] | None = None):
    chat = get_or_create_chat(session_id)
    
    prompt = message
    if context:
        context_text = "\n\n".join(context)
        prompt = f"Based on the following university documents:\n{context_text}\n\nPlease answer this question: {message}"
    
    async for chunk in chat.send_message_async(prompt, stream=True):
        yield chunk.text
