from .user_routes import router as user_router
from .chat_routes import router as chat_router
from .timetable_routes import router as timetable_router

__all__ = ["user_router", "chat_router", "timetable_router"]