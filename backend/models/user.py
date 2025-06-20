from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

class User(BaseModel):
    user_id: str
    bro_name: Optional[str] = "Bro"
    goals: List[str] = []
    preferences: Optional[str] = ""
    created_at: datetime = datetime.utcnow()

class UserResponse(BaseModel):
    user_id: str
    bro_name: str
    goals: List[str]
    preferences: str
    created_at: Optional[str] = None