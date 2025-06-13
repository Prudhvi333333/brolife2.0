import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({ user_id: 'default_user', bro_name: 'Bro', goals: [], preferences: '' });
  const [timetable, setTimetable] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [expandedTracker, setExpandedTracker] = useState(null);
  const [goals, setGoals] = useState('');
  const [preferences, setPreferences] = useState('');
  const [broName, setBroName] = useState('Bro');
  const messagesEndRef = useRef(null);

  // Sample tracker data (in real app, this would come from API)
  const [trackerData, setTrackerData] = useState({
    health: {
      sleep: { value: 7.5, target: 8, unit: 'hours' },
      hydration: { value: 6, target: 8, unit: 'glasses' },
      energy: { value: 75, target: 100, unit: '%' }
    },
    food: {
      meals: { value: 2, target: 3, unit: 'meals' },
      outsideFood: { value: 1, target: 0, unit: 'times' },
      quality: { value: 80, target: 90, unit: '%' }
    },
    learning: {
      studyTime: { value: 2.5, target: 3, unit: 'hours' },
      streak: { value: 12, target: 30, unit: 'days' },
      progress: { value: 65, target: 100, unit: '%' }
    },
    goals: {
      shortTerm: { value: 3, target: 5, unit: 'tasks' },
      longTerm: { value: 40, target: 100, unit: '%' },
      weekly: { value: 5, target: 7, unit: 'days' }
    }
  });

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
        content: "Hey! Set up your goals first so I can create a personalized timetable for you. Click the profile tab! 🎯", 
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
        content: "Your personalized timetable is ready! Check it out in the Timetable tab 📅", 
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

  const getProgressColor = (value, target) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return '#4ade80'; // green
    if (percentage >= 70) return '#fbbf24'; // yellow
    return '#f87171'; // red
  };

  const TrackerCard = ({ title, icon, data, category }) => {
    const isExpanded = expandedTracker === category;
    
    return (
      <div 
        className={`tracker-card ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setExpandedTracker(isExpanded ? null : category)}
      >
        <div className="tracker-header">
          <div className="tracker-icon">{icon}</div>
          <div className="tracker-info">
            <h3>{title}</h3>
            <div className="tracker-stats">
              {Object.entries(data).map(([key, item]) => (
                <div key={key} className="stat-item">
                  <span className="stat-label">{key}:</span>
                  <span className="stat-value" style={{ color: getProgressColor(item.value, item.target) }}>
                    {item.value}/{item.target} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="expand-icon">{isExpanded ? '▼' : '▶'}</div>
        </div>
        
        {isExpanded && (
          <div className="tracker-expanded">
            <div className="progress-bars">
              {Object.entries(data).map(([key, item]) => (
                <div key={key} className="progress-item">
                  <div className="progress-label">
                    <span>{key}</span>
                    <span>{item.value}/{item.target} {item.unit}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min((item.value / item.target) * 100, 100)}%`,
                        backgroundColor: getProgressColor(item.value, item.target)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="ai-suggestion">
              <span className="ai-icon">🤖</span>
              <p>{getAISuggestion(category, data)}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getAISuggestion = (category, data) => {
    const suggestions = {
      health: "Looking good! Try to get that extra 30 mins of sleep tonight, and you're crushing your hydration game! 💪",
      food: "Nice work on the meals! Maybe try meal prepping this weekend to avoid outside food tomorrow?",
      learning: "You're so close to that 3-hour target! Just 30 more minutes and you'll smash today's goal 🧠",
      goals: "2 more short-term tasks to go! You got this, let's finish strong today 🎯"
    };
    return suggestions[category] || "Keep pushing, you're doing great!";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="home-content">
            {/* Quick Chat Section */}
            <div className="quick-chat-section">
              <div className="chat-header">
                <h2>💬 Chat with {user.bro_name}</h2>
                <button className="generate-timetable-btn" onClick={generateTimetable} disabled={isLoading}>
                  📅 Generate Timetable
                </button>
              </div>
              
              <div className="mini-chat">
                {messages.slice(-2).map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-content">
                      <span className="sender">
                        {message.type === 'user' ? '👤' : '🤖'} {message.type === 'user' ? 'You' : user.bro_name}
                      </span>
                      <p>{message.content.length > 100 ? message.content.substring(0, 100) + '...' : message.content}</p>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="welcome-mini">
                    <p>👋 Hey! I'm {user.bro_name}, your productivity bro. What's on your mind today?</p>
                  </div>
                )}
              </div>

              <div className="input-area">
                <div className="input-container">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask ${user.bro_name} anything...`}
                    className="message-input"
                    rows="1"
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleSendMessage} 
                    className="send-btn"
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    {isLoading ? '⏳' : '🚀'}
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Timetable Card */}
            {timetable && (
              <div className="timetable-card">
                <div className="timetable-header">
                  <h3>📅 Today's Schedule</h3>
                  <span className="date">{timetable.day}, {timetable.date}</span>
                </div>
                <div className="night-focus">
                  🌙 Tonight's Focus: <span className="focus-type">{timetable.night_focus}</span>
                </div>
                <div className="schedule-preview">
                  <div className="time-blocks">
                    <div className="time-block morning">
                      <span className="time">7:30-12:00</span>
                      <span className="activity">🌅 Morning Focus</span>
                    </div>
                    <div className="time-block afternoon">
                      <span className="time">12:00-17:00</span>
                      <span className="activity">☀️ Mixed Tasks</span>
                    </div>
                    <div className="time-block evening">
                      <span className="time">17:00-21:00</span>
                      <span className="activity">🌆 Personal Time</span>
                    </div>
                    <div className="time-block night">
                      <span className="time">21:00-00:30</span>
                      <span className="activity">🌙 {timetable.night_focus}</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="view-full-btn"
                  onClick={() => setActiveTab('timetable')}
                >
                  View Full Schedule
                </button>
              </div>
            )}

            {/* Tracker Dashboard */}
            <div className="tracker-dashboard">
              <h3>📊 Today's Progress</h3>
              <div className="tracker-grid">
                <TrackerCard 
                  title="Health" 
                  icon="💪" 
                  data={trackerData.health} 
                  category="health"
                />
                <TrackerCard 
                  title="Food" 
                  icon="🍎" 
                  data={trackerData.food} 
                  category="food"
                />
                <TrackerCard 
                  title="Learning" 
                  icon="🧠" 
                  data={trackerData.learning} 
                  category="learning"
                />
                <TrackerCard 
                  title="Goals" 
                  icon="🎯" 
                  data={trackerData.goals} 
                  category="goals"
                />
              </div>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="full-chat">
            <div className="chat-header">
              <h2>💬 Chat with {user.bro_name}</h2>
            </div>
            
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
                    <p>What's on your mind today?</p>
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
                    <div className="message-text">{message.content}</div>
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
        );

      case 'timetable':
        return (
          <div className="timetable-view">
            <div className="timetable-header">
              <h2>📅 Your Daily Timetable</h2>
              <button className="regenerate-btn" onClick={generateTimetable} disabled={isLoading}>
                🔄 Regenerate
              </button>
            </div>
            
            {timetable ? (
              <div className="timetable-full">
                <div className="timetable-info">
                  <div className="date-info">
                    <h3>{timetable.day}, {timetable.date}</h3>
                    <div className="night-focus">
                      🌙 Tonight's Focus: <span className="focus-type">{timetable.night_focus}</span>
                    </div>
                  </div>
                </div>
                
                <div className="schedule-details">
                  <div className="schedule-text">
                    {timetable.schedule_text}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-timetable">
                <div className="empty-state">
                  <h3>📅 No Timetable Yet</h3>
                  <p>Generate your personalized daily schedule based on your goals and preferences.</p>
                  <button className="generate-btn" onClick={generateTimetable} disabled={isLoading}>
                    {isLoading ? '⏳ Generating...' : '🎯 Generate My Timetable'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'trackers':
        return (
          <div className="trackers-view">
            <div className="trackers-header">
              <h2>📊 Your Progress Trackers</h2>
              <span className="date">Today</span>
            </div>
            
            <div className="trackers-full">
              <TrackerCard 
                title="Health Tracker" 
                icon="💪" 
                data={trackerData.health} 
                category="health"
              />
              <TrackerCard 
                title="Food Tracker" 
                icon="🍎" 
                data={trackerData.food} 
                category="food"
              />
              <TrackerCard 
                title="Learning Tracker" 
                icon="🧠" 
                data={trackerData.learning} 
                category="learning"
              />
              <TrackerCard 
                title="Goals Tracker" 
                icon="🎯" 
                data={trackerData.goals} 
                category="goals"
              />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="profile-view">
            <div className="profile-header">
              <h2>👤 Profile & Settings</h2>
            </div>
            
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-info">
                  <div className="avatar">🤖</div>
                  <div className="user-info">
                    <h3>{user.bro_name}</h3>
                    <p>Your AI Productivity Bro</p>
                  </div>
                  <button className="edit-btn" onClick={() => setShowSetup(true)}>
                    ✏️ Edit
                  </button>
                </div>
              </div>

              <div className="goals-section">
                <h3>🎯 Your Goals</h3>
                <div className="goals-list">
                  {user.goals && user.goals.length > 0 ? (
                    user.goals.map((goal, index) => (
                      <div key={index} className="goal-item">
                        <span className="goal-icon">🎯</span>
                        <span className="goal-text">{goal}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-goals">
                      <p>No goals set yet. Click Edit to add your goals!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="preferences-section">
                <h3>⚙️ Preferences</h3>
                <div className="preferences-text">
                  {user.preferences || "No preferences set yet."}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="mobile-container">
        {/* Top Header */}
        <div className="app-header">
          <div className="app-title">
            <h1>💪 Brolife</h1>
            <span className="subtitle">Your AI productivity bro</span>
          </div>
          <div className="profile-icon" onClick={() => setActiveTab('profile')}>
            <span className="bro-name">{user.bro_name}</span>
            <div className="avatar-small">🤖</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {renderTabContent()}
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-label">Chat</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveTab('timetable')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">Schedule</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'trackers' ? 'active' : ''}`}
            onClick={() => setActiveTab('trackers')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Trackers</span>
          </button>
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