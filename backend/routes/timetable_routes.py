from fastapi import APIRouter, HTTPException
from models import TimetableRequest, Timetable, TimetableResponse
from services import DatabaseService, LLMService
from utils import get_response_message
from datetime import datetime

router = APIRouter(prefix="/api", tags=["timetables"])
db_service = DatabaseService()
llm_service = LLMService()

@router.post("/generate-timetable", response_model=TimetableResponse)
async def create_timetable(timetable_req: TimetableRequest):
    """Generate personalized daily timetable"""
    try:
        # Get user info
        user = await db_service.get_user(timetable_req.user_id)
        bro_name = user.get("bro_name", "Bro") if user else "Bro"
        
        # Generate timetable
        schedule = await llm_service.generate_timetable(
            timetable_req.goals, 
            timetable_req.preferences, 
            timetable_req.user_id,
            bro_name
        )
        
        # Save timetable
        timetable = Timetable(
            user_id=timetable_req.user_id,
            date=schedule.get("date", datetime.now().strftime("%Y-%m-%d")),
            schedule=schedule
        )
        await db_service.save_timetable(timetable.dict())
        
        message = get_response_message("timetable_ready", bro_name)
        return TimetableResponse(timetable=schedule, message=message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timetable generation error: {str(e)}")

@router.get("/timetables/{user_id}")
async def get_user_timetables(user_id: str, limit: int = 10):
    """Get user's timetable history"""
    try:
        timetables = await db_service.get_user_timetables(user_id, limit)
        return {"timetables": timetables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timetable fetch error: {str(e)}")