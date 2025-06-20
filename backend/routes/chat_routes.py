from fastapi import APIRouter, HTTPException
from models import ChatMessage, ChatHistory, ChatResponse
from services import DatabaseService, LLMService

router = APIRouter(prefix="/api", tags=["chat"])
db_service = DatabaseService()
llm_service = LLMService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bro(chat_msg: ChatMessage):
    """Send message to AI bro and get response"""
    try:
        # Get user info to personalize response
        user = await db_service.get_user(chat_msg.user_id)
        bro_name = user.get("bro_name", "Bro") if user else "Bro"
        
        # Get LLM response
        response = await llm_service.get_llm_response(chat_msg.message, chat_msg.user_id, bro_name)
        
        # Save chat history
        chat_history = ChatHistory(
            user_id=chat_msg.user_id,
            message=chat_msg.message,
            response=response
        )
        await db_service.save_chat_history(chat_history.dict())
        
        return ChatResponse(response=response, bro_name=bro_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@router.get("/chat-history/{user_id}")
async def get_chat_history(user_id: str, limit: int = 20):
    """Get chat history for user"""
    try:
        history = await db_service.get_chat_history(user_id, limit)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat history error: {str(e)}")