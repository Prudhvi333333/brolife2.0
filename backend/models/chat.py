from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = "default_user"

class ChatHistory(BaseModel):
    user_id: str
    message: str
    response: str
    timestamp: datetime = datetime.utcnow()
    message_id: str = str(uuid.uuid4())

class ChatResponse(BaseModel):
    response: str
    bro_name: str