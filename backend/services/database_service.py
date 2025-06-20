import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, List, Optional

class DatabaseService:
    def __init__(self):
        self.mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
        self.db_name = os.environ.get("DB_NAME", "brolife_database")
        self.client = AsyncIOMotorClient(self.mongo_url)
        self.db = self.client[self.db_name]

    async def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user by user_id"""
        return await self.db.users.find_one({"user_id": user_id})

    async def create_user(self, user_data: Dict) -> Dict:
        """Create new user"""
        result = await self.db.users.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        return user_data

    async def update_user(self, user_id: str, user_data: Dict) -> bool:
        """Update existing user"""
        result = await self.db.users.update_one(
            {"user_id": user_id},
            {"$set": user_data}
        )
        return result.modified_count > 0

    async def save_chat_history(self, chat_data: Dict) -> Dict:
        """Save chat message to history"""
        result = await self.db.chat_history.insert_one(chat_data)
        chat_data["_id"] = result.inserted_id
        return chat_data

    async def get_chat_history(self, user_id: str, limit: int = 20) -> List[Dict]:
        """Get chat history for user"""
        cursor = self.db.chat_history.find({"user_id": user_id}).sort("timestamp", -1).limit(limit)
        history = []
        async for chat in cursor:
            history.append(chat)
        return history

    async def save_timetable(self, timetable_data: Dict) -> Dict:
        """Save timetable"""
        result = await self.db.timetables.insert_one(timetable_data)
        timetable_data["_id"] = result.inserted_id
        return timetable_data

    async def get_user_timetables(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get timetables for user"""
        cursor = self.db.timetables.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
        timetables = []
        async for timetable in cursor:
            timetables.append(timetable)
        return timetables