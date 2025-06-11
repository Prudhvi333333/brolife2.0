import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({ user_id: 'default_user', bro_name: 'Bro', goals: [], preferences: '' });
  const [timetable, setTimetable] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [goals, setGoals] = useState('');
  const [preferences, setPreferences] = useState('');
  const [broName, setBroName] = useState('Bro');
  const messagesEndRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    loadUser();
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUser = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/default_user`);
      const userData = await response.json();
      setUser(userData);
      setBroName(userData.bro_name || 'Bro');
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage, timestamp: new Date() }]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          user_id: user.user_id
        })
      });

      const data = await response.json();
      
      // Add bot response to chat
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.response, 
        timestamp: new Date(),
        bro_name: data.bro_name 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Hey, I'm having some technical issues right now. Let me try again in a bit!", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimetable = async () => {
    if (!user.goals || user.goals.length === 0) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Hey! Set up your goals first so I can create a personalized timetable for you. Click the setup button! 🎯", 
        timestamp: new Date() 
      }]);
      return;
    }

    setIsLoading(true);
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: "Generate my daily timetable", 
      timestamp: new Date() 
    }]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goals: user.goals,
          preferences: user.preferences,
          user_id: user.user_id
        })
      });

      const data = await response.json();
      setTimetable(data.timetable);
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.timetable.schedule_text || "Here's your personalized timetable! 🎯", 
        timestamp: new Date(),
        timetable: data.timetable
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Couldn't generate your timetable right now, bro. Let me try again in a bit!", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserSetup = async () => {
    const goalsList = goals.split('\n').filter(g => g.trim()).map(g => g.trim());
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'default_user',
          bro_name: broName,
          goals: goalsList,
          preferences: preferences
        })
      });

      const data = await response.json();
      
      setUser(prev => ({
        ...prev,
        bro_name: broName,
        goals: goalsList,
        preferences: preferences
      }));
      
      setShowSetup(false);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.message, 
        timestamp: new Date() 
      }]);
    } catch (error) {
      console.error('Error saving setup:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="app-title">
              <h1>💪 Brolife</h1>
              <span className="subtitle">Your AI productivity bro</span>
            </div>
            <div className="header-actions">
              <button className="setup-btn" onClick={() => setShowSetup(true)}>
                ⚙️ Setup
              </button>
              <button className="timetable-btn" onClick={generateTimetable} disabled={isLoading}>
                📅 Generate Timetable
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-content">
                <h2>Hey! I'm {user.bro_name} 👋</h2>
                <p>I'm your AI productivity companion. I'll help you:</p>
                <ul>
                  <li>🎯 Create personalized daily timetables</li>
                  <li>💪 Stay motivated and on track</li>
                  <li>🚀 Achieve your goals consistently</li>
                  <li>⚡ Balance side hustles with health</li>
                </ul>
                <p>Start by setting up your goals, then ask me to generate your daily timetable!</p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-header">
                  <span className="sender">
                    {message.type === 'user' ? '👤 You' : `🤖 ${message.bro_name || user.bro_name}`}
                  </span>
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="message-text">
                  {message.content}
                </div>
                {message.timetable && (
                  <div className="timetable-info">
                    <div className="timetable-header">
                      📅 {message.timetable.day} - {message.timetable.date}
                    </div>
                    <div className="night-focus">
                      🌙 Tonight's Focus: {message.timetable.night_focus}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="message-header">
                  <span className="sender">🤖 {user.bro_name}</span>
                </div>
                <div className="message-text loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${user.bro_name} anything about productivity...`}
              className="message-input"
              rows="1"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              className="send-btn"
              disabled={isLoading || !inputMessage.trim()}
            >
              🚀
            </button>
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <div className="modal-overlay" onClick={() => setShowSetup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛠️ Setup Your Brolife</h2>
              <button className="close-btn" onClick={() => setShowSetup(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>What should I call you as your bro? 🤝</label>
                <input
                  type="text"
                  value={broName}
                  onChange={(e) => setBroName(e.target.value)}
                  placeholder="Bro, Buddy, Coach, etc."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>What are your main goals? 🎯 (one per line)</label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="Learn machine learning&#10;Build my side project&#10;Get fit and healthy&#10;Read 2 books per month"
                  className="form-textarea"
                  rows="6"
                />
              </div>

              <div className="form-group">
                <label>Any preferences or constraints? ⚙️</label>
                <textarea
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="I work best in the morning, prefer shorter breaks, have gym at 6 PM..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <button className="save-btn" onClick={saveUserSetup}>
                💾 Save & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;