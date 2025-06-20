import os
from emergentintegrations.llm.chat import LlmChat, UserMessage
from datetime import datetime
from typing import Dict, List

class LLMService:
    def __init__(self):
        self.provider = os.environ.get("LLM_PROVIDER", "groq")
        self.model = os.environ.get("LLM_MODEL", "llama-3.3-70b-versatile")
        self.api_key = os.environ.get("LLM_API_KEY")

    def get_bro_system_prompt(self, bro_name: str = "Bro") -> str:
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

    async def get_llm_response(self, message: str, user_id: str, bro_name: str = "Bro") -> str:
        try:
            session_id = f"brolife_{user_id}"
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=self.get_bro_system_prompt(bro_name)
            ).with_model(self.provider, self.model)
            
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            return response
        except Exception as e:
            return f"Hey, I'm having some technical issues right now. Let me try again in a bit! Error: {str(e)}"

    async def generate_timetable(self, goals: List[str], preferences: str, user_id: str, bro_name: str = "Bro") -> Dict:
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
                api_key=self.api_key,
                session_id=session_id,
                system_message=self.get_bro_system_prompt(bro_name)
            ).with_model(self.provider, self.model)
            
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