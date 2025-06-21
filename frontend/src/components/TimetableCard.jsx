import React from 'react';

const TimetableCard = ({ timetable, onViewFullSchedule, onRegenerate, isLoading = false, isPreview = false }) => {
  if (!timetable || (timetable.error && !timetable.schedule_text)) {
    return (
      <div className="no-timetable">
        <div className="empty-state">
          <h3>📅 No Timetable Yet</h3>
          <p>Generate your personalized daily schedule based on your goals and preferences.</p>
          <button className="generate-btn" onClick={onRegenerate} disabled={isLoading}>
            {isLoading ? '⏳ Generating...' : '🎯 Generate My Timetable'}
          </button>
        </div>
      </div>
    );
  }

  if (isPreview) {
    return (
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
    );
  }

  return (
    <div className="timetable-view">
      <div className="timetable-header">
        <h2>📅 Your Daily Timetable</h2>
        <button className="regenerate-btn" onClick={onRegenerate} disabled={isLoading}>
          🔄 Regenerate
        </button>
      </div>
      
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
    </div>
  );
};

export default TimetableCard;