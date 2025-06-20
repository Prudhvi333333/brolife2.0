from fastapi import APIRouter, HTTPException
from models import User, UserResponse
from services import DatabaseService
from utils import serialize_user_document, get_response_message

router = APIRouter(prefix="/api", tags=["users"])
db_service = DatabaseService()

@router.post("/user/setup")
async def setup_user(user_data: User):
    """Setup or update user profile"""
    try:
        # Check if user exists
        existing_user = await db_service.get_user(user_data.user_id)
        
        if existing_user:
            # Update existing user
            await db_service.update_user(user_data.user_id, user_data.dict())
            message = get_response_message("update", user_data.bro_name)
        else:
            # Create new user
            await db_service.create_user(user_data.dict())
            message = get_response_message("welcome", user_data.bro_name)
            
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User setup error: {str(e)}")

@router.get("/user/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user profile"""
    try:
        user = await db_service.get_user(user_id)
        return serialize_user_document(user, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get user error: {str(e)}")