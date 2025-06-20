import React from 'react';
import TrackerCard from '../components/TrackerCard';

const HomePage = ({ 
  user, 
  timetable, 
  trackerData, 
  expandedTracker, 
  setExpandedTracker,
  onGenerateTimetable,
  onViewFullSchedule,
  isLoading,
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage,
  handleKeyPress
}) => {
  return (
    <div className="home-content">
      {/* Quick Chat Section */}
      <div className="quick-chat-section">
        <div className="chat-header">
          <h2>💬 Chat with {user.bro_name}</h2>
          <button className="generate-timetable-btn" onClick={onGenerateTimetable} disabled={isLoading}>
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
              onClick={onSendMessage} 
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
            onClick={onViewFullSchedule}
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
            isExpanded={expandedTracker === 'health'}
            onToggle={() => setExpandedTracker(expandedTracker === 'health' ? null : 'health')}
          />
          <TrackerCard 
            title="Food" 
            icon="🍎" 
            data={trackerData.food} 
            category="food"
            isExpanded={expandedTracker === 'food'}
            onToggle={() => setExpandedTracker(expandedTracker === 'food' ? null : 'food')}
          />
          <TrackerCard 
            title="Learning" 
            icon="🧠" 
            data={trackerData.learning} 
            category="learning"
            isExpanded={expandedTracker === 'learning'}
            onToggle={() => setExpandedTracker(expandedTracker === 'learning' ? null : 'learning')}
          />
          <TrackerCard 
            title="Goals" 
            icon="🎯" 
            data={trackerData.goals} 
            category="goals"
            isExpanded={expandedTracker === 'goals'}
            onToggle={() => setExpandedTracker(expandedTracker === 'goals' ? null : 'goals')}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;