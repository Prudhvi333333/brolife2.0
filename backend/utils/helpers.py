from datetime import datetime
from typing import Dict, Any

def serialize_datetime(obj: Any) -> Any:
    """Convert datetime objects to ISO format strings for JSON serialization"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def serialize_user_document(user_doc: Dict, user_id: str) -> Dict:
    """Convert MongoDB user document to JSON-serializable dict"""
    if not user_doc:
        return {
            "user_id": user_id, 
            "bro_name": "Bro", 
            "goals": [], 
            "preferences": ""
        }
    
    return {
        "user_id": user_doc.get("user_id", user_id),
        "bro_name": user_doc.get("bro_name", "Bro"),
        "goals": user_doc.get("goals", []),
        "preferences": user_doc.get("preferences", ""),
        "created_at": serialize_datetime(user_doc.get("created_at"))
    }

def get_response_message(action: str, bro_name: str) -> str:
    """Get appropriate response message for user actions"""
    messages = {
        "welcome": f"Welcome to Brolife, {bro_name}! Let's get productive! 🚀",
        "update": f"Updated your profile, {bro_name}! 💪",
        "timetable_ready": "Your personalized timetable is ready! 🎯",
        "goals_needed": "Hey! Set up your goals first so I can create a personalized timetable for you. 🎯"
    }
    return messages.get(action, "Great! Let's keep going! 💪")