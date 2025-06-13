import os
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "brolife_database")
LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "groq")
LLM_MODEL = os.environ.get("LLM_MODEL", "llama3-70b-4096")
LLM_API_KEY = os.environ.get("LLM_API_KEY")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = "default_user"

class TimetableRequest(BaseModel):
    goals: List[str]
    preferences: Optional[str] = ""
    user_id: Optional[str] = "default_user"

class User(BaseModel):
    user_id: str
    bro_name: Optional[str] = "Bro"
    goals: List[str] = []
    preferences: Optional[str] = ""
    created_at: datetime = datetime.utcnow()

class ChatHistory(BaseModel):
    user_id: str
    message: str
    response: str
    timestamp: datetime = datetime.utcnow()
    message_id: str = str(uuid.uuid4())

class Timetable(BaseModel):
    user_id: str
    date: str
    schedule: Dict
    created_at: datetime = datetime.utcnow()
    timetable_id: str = str(uuid.uuid4())

# System prompt for the Bro assistant
def get_bro_system_prompt(bro_name: str = "Bro") -> str:
    return f"""You are {bro_name}, a friendly and supportive productivity companion. You speak like a close friend - casual, encouraging, and genuinely caring about the user's success.

Your personality:
- Use casual language like "Hey", "What's up", "Let's do this", "You got this"
- Be encouraging and supportive, not preachy
- Speak like a good friend who wants to see them succeed
- Use occasional bro-friendly expressions but don't overdo it
- Be practical and helpful with genuine advice

Your main job is to help with productivity by:
1. Creating personalized daily timetables (7:30AM to 12:30AM)
2. Understanding their goals and breaking them down
3. Giving adaptive suggestions based on what they accomplish
4. Being their accountability partner

For timetables, use this structure:
- Morning (7:30-12:00): Productive focused work
- Afternoon (12:00-17:00): Mixed tasks and activities  
- Evening (17:00-21:00): Personal time, workouts, meals
- Night (21:00-00:30): Alternating schedule:
  * Monday/Wednesday/Friday/Sunday: Side hustle projects
  * Tuesday/Thursday/Saturday: Health & wellness focus

Always be encouraging and make them feel like they can achieve their goals."""

# LLM Chat helper
async def get_llm_response(message: str, user_id: str, bro_name: str = "Bro") -> str:
    try:
        session_id = f"brolife_{user_id}"
        chat = LlmChat(
            api_key=LLM_API_KEY,
            session_id=session_id,
            system_message=get_bro_system_prompt(bro_name)
        ).with_model(LLM_PROVIDER, LLM_MODEL)
        
        user_message = UserMessage(text=message)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        return f"Hey, I'm having some technical issues right now. Let me try again in a bit! Error: {str(e)}"

# Timetable generation helper
async def generate_timetable(goals: List[str], preferences: str, user_id: str, bro_name: str = "Bro") -> Dict:
    try:
        today = datetime.now()
        day_name = today.strftime("%A")
        
        # Determine night focus based on alternating schedule
        night_focus = "Side Hustle" if day_name in ["Monday", "Wednesday", "Friday", "Sunday"] else "Health & Wellness"
        
        timetable_prompt = f"""Create a detailed daily timetable for today ({day_name}) from 7:30 AM to 12:30 AM.

User's goals: {', '.join(goals)}
Additional preferences: {preferences}

Night focus for today: {night_focus}

Structure it like this and be specific with activities:
- 7:30-12:00 (Morning): Focused work blocks aligned with their goals
- 12:00-17:00 (Afternoon): Mixed productive tasks  
- 17:00-21:00 (Evening): Personal activities, meals, exercise
- 21:00-00:30 (Night): {night_focus} activities

Make it practical and achievable. Include breaks and be specific about what they should work on during each time slot. Respond in a friendly, encouraging way as their bro."""

        session_id = f"timetable_{user_id}"
        chat = LlmChat(
            api_key=LLM_API_KEY,
            session_id=session_id,
            system_message=get_bro_system_prompt(bro_name)
        ).with_model(LLM_PROVIDER, LLM_MODEL)
        
        user_message = UserMessage(text=timetable_prompt)
        response = await chat.send_message(user_message)
        
        return {
            "date": today.strftime("%Y-%m-%d"),
            "day": day_name,
            "night_focus": night_focus,
            "schedule_text": response,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "error": f"Couldn't generate your timetable right now, bro. Technical issue: {str(e)}"
        }

@app.get("/")
async def root():
    return {"message": "Brolife API is running! 🎯"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/chat")
async def chat_with_bro(chat_msg: ChatMessage):
    try:
        # Get user info to personalize response
        user = await db.users.find_one({"user_id": chat_msg.user_id})
        bro_name = user.get("bro_name", "Bro") if user else "Bro"
        
        # Get LLM response
        response = await get_llm_response(chat_msg.message, chat_msg.user_id, bro_name)
        
        # Save chat history
        chat_history = ChatHistory(
            user_id=chat_msg.user_id,
            message=chat_msg.message,
            response=response
        )
        await db.chat_history.insert_one(chat_history.dict())
        
        return {"response": response, "bro_name": bro_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/api/generate-timetable")
async def create_timetable(timetable_req: TimetableRequest):
    try:
        # Get user info
        user = await db.users.find_one({"user_id": timetable_req.user_id})
        bro_name = user.get("bro_name", "Bro") if user else "Bro"
        
        # Generate timetable
        schedule = await generate_timetable(
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
        await db.timetables.insert_one(timetable.dict())
        
        return {"timetable": schedule, "message": "Your personalized timetable is ready! 🎯"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timetable generation error: {str(e)}")

@app.post("/api/user/setup")
async def setup_user(user_data: User):
    try:
        # Check if user exists
        existing_user = await db.users.find_one({"user_id": user_data.user_id})
        
        if existing_user:
            # Update existing user
            await db.users.update_one(
                {"user_id": user_data.user_id},
                {"$set": user_data.dict()}
            )
            return {"message": f"Updated your profile, {user_data.bro_name}! 💪"}
        else:
            # Create new user
            await db.users.insert_one(user_data.dict())
            return {"message": f"Welcome to Brolife, {user_data.bro_name}! Let's get productive! 🚀"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User setup error: {str(e)}")

@app.get("/api/user/{user_id}")
async def get_user(user_id: str):
    try:
        user = await db.users.find_one({"user_id": user_id})
        if not user:
            return {"user_id": user_id, "bro_name": "Bro", "goals": [], "preferences": ""}
        
        # Convert MongoDB document to JSON-serializable dict
        user_dict = {
            "user_id": user.get("user_id", user_id),
            "bro_name": user.get("bro_name", "Bro"),
            "goals": user.get("goals", []),
            "preferences": user.get("preferences", ""),
            "created_at": user.get("created_at").isoformat() if user.get("created_at") else None
        }
        return user_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get user error: {str(e)}")

@app.get("/api/timetables/{user_id}")
async def get_user_timetables(user_id: str, limit: int = 10):
    try:
        timetables = []
        cursor = db.timetables.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
        async for timetable in cursor:
            timetables.append(timetable)
        return {"timetables": timetables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timetable fetch error: {str(e)}")

@app.get("/api/chat-history/{user_id}")
async def get_chat_history(user_id: str, limit: int = 20):
    try:
        history = []
        cursor = db.chat_history.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
        async for chat in cursor:
            history.append(chat)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat history error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)