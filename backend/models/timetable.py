from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import uuid

class TimetableRequest(BaseModel):
    goals: List[str]
    preferences: Optional[str] = ""
    user_id: Optional[str] = "default_user"

class Timetable(BaseModel):
    user_id: str
    date: str
    schedule: Dict
    created_at: datetime = datetime.utcnow()
    timetable_id: str = str(uuid.uuid4())

class TimetableResponse(BaseModel):
    timetable: Dict
    message: str