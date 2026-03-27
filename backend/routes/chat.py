from fastapi import APIRouter
from models.schemas import ChatRequest, ChatResponse
from services.gemini import generate_response, generate_streaming_response
import uuid

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    
    response = await generate_response(
        message=request.message,
        session_id=session_id,
        context=request.context
    )
    
    return ChatResponse(response=response, session_id=session_id)


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())
    
    async def stream_generator():
        async for chunk in generate_streaming_response(
            message=request.message,
            session_id=session_id,
            context=request.context
        ):
            yield f"data: {chunk}\n\n"
    
    return stream_generator()
