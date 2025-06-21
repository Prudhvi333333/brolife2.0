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
  const [activeHomeTab, setActiveHomeTab] = useState('today');

  const renderTodaySection = () => (
    <div className="compact-section">
      <div className="section-header">
        <span className="section-title">📅 Today's Focus</span>
        <button className="expand-btn" onClick={onViewFullSchedule}>See Full</button>
      </div>
      {timetable ? (
        <div className="today-summary">
          <div className="focus-badge">
            🌙 Tonight: {timetable.night_focus}
          </div>
          <div className="next-activity">
            🕘 Next: Morning deep work at 7:30 AM
          </div>
        </div>
      ) : (
        <button className="generate-timetable-btn" onClick={onGenerateTimetable}>
          🎯 Generate Today's Schedule
        </button>
      )}
    </div>
  );

  const renderTrackersSection = () => (
    <div className="compact-section">
      <div className="section-header">
        <span className="section-title">📊 Quick Stats</span>
        <button className="expand-btn">See All</button>
      </div>
      <div className="tracker-grid-compact">
        <div className="stat-item">
          <span className="stat-icon">💪</span>
          <span className="stat-value">{trackerData.health.sleep.value}h</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🍎</span>
          <span className="stat-value">{trackerData.food.meals.value}/3</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🧠</span>
          <span className="stat-value">{trackerData.learning.progress.value}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{trackerData.goals.shortTerm.value}/5</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-content">
      <div className="home-tabs">
        <button 
          className={`home-tab ${activeHomeTab === 'today' ? 'active' : ''}`}
          onClick={() => setActiveHomeTab('today')}
        >
          Today
        </button>
        <button 
          className={`home-tab ${activeHomeTab === 'trackers' ? 'active' : ''}`}
          onClick={() => setActiveHomeTab('trackers')}
        >
          Stats
        </button>
        <button 
          className={`home-tab ${activeHomeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveHomeTab('chat')}
        >
          Chat
        </button>
      </div>

      {activeHomeTab === 'today' && renderTodaySection()}
      {activeHomeTab === 'trackers' && renderTrackersSection()}
      
      {activeHomeTab === 'chat' && (
        <div className="compact-section">
          <div className="section-header">
            <span className="section-title">💬 Quick Chat</span>
          </div>
          <div className="mini-chat">
            {messages.slice(-1).map((message, index) => (
              <div key={index} className="mini-message">
                <strong>{message.type === 'user' ? 'You' : user.bro_name}:</strong>
                <span>{message.content.substring(0, 80)}...</span>
              </div>
            ))}
            {messages.length === 0 && (
              <p>👋 Hey! I'm {user.bro_name}, ready to help!</p>
            )}
          </div>
          <div className="quick-input">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${user.bro_name}...`}
              className="mini-input"
            />
            <button onClick={onSendMessage} className="mini-send-btn">🚀</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;