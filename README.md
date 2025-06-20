# 💪 Brolife 2.0

Your AI productivity companion that acts like a supportive friend, not just another assistant.

## ✨ Features

- 🤖 **AI Chat Assistant** - Groq-powered LLM with "bro" personality
- 📅 **Smart Timetable Generator** - Personalized daily schedules (7:30AM-12:30AM)
- 📊 **Progress Trackers** - Health, Food, Learning, Goals with AI suggestions
- 🎯 **Goal Management** - Set goals and track progress with visual feedback
- 👤 **Profile Customization** - Customize your AI bro's name and preferences
- 🌙 **Alternating Night Focus** - Side Hustle (M/W/F/S) vs Health (T/Th/Sa)

## 🛠️ Tech Stack

**Frontend:** React 19, TailwindCSS, Custom Hooks, Modular Components  
**Backend:** FastAPI, MongoDB, Groq LLM (Llama-3.3-70b)  
**Architecture:** RESTful API, Async/Await, Pydantic Models

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your Groq API key to .env
python main.py
```

### Frontend Setup
```bash
cd frontend
yarn install
yarn start
```

### Environment Setup
Create `/backend/.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="brolife_database"
LLM_PROVIDER="groq"
LLM_MODEL="llama-3.3-70b-versatile"
LLM_API_KEY="your_groq_api_key_here"
```

Get Groq API key: https://console.groq.com/keys

## 📁 Structure

```
├── frontend/src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── api/            # API layer
│   ├── hooks/          # Custom React hooks
│   └── App.js          # Main application
├── backend/
│   ├── routes/         # API endpoints
│   ├── models/         # Pydantic models
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── main.py         # FastAPI application
```

## 🎯 Usage

1. **Setup Profile** - Click profile icon, set your bro name and goals
2. **Generate Timetable** - Hit "Generate Timetable" for personalized schedule
3. **Track Progress** - Expand tracker cards to see progress and AI suggestions
4. **Chat** - Talk to your AI bro about productivity and goals

---

Built with ❤️ as a productivity companion that actually understands you.