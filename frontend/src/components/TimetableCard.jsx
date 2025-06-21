import React from 'react';
import DailyLogger from './DailyLogger';

const TimetableCard = ({ timetable, onViewFullSchedule, onRegenerate, isLoading = false, isPreview = false }) => {
  console.log('TimetableCard render:', { timetable, isPreview, isLoading });
  
  if (!timetable) {
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
          <div className="schedule-blocks">
            <div className="time-block morning-block">
              <div className="time-header">
                <span className="time-range">🌅 7:30-12:00</span>
                <span className="block-type">Morning Focus</span>
              </div>
              <div className="activities">
                <div className="activity-item">
                  <span className="activity-time">7:30-8:30</span>
                  <span className="activity-name">Deep Work Session</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">8:30-9:30</span>
                  <span className="activity-name">Goal: {timetable.user_goals?.[0] || 'Primary Goal'}</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">9:30-10:30</span>
                  <span className="activity-name">Focused Learning</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">10:30-12:00</span>
                  <span className="activity-name">Project Work</span>
                </div>
              </div>
            </div>

            <div className="time-block afternoon-block">
              <div className="time-header">
                <span className="time-range">☀️ 12:00-17:00</span>
                <span className="block-type">Afternoon Tasks</span>
              </div>
              <div className="activities">
                <div className="activity-item">
                  <span className="activity-time">12:00-13:30</span>
                  <span className="activity-name">Lunch & Break</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">13:30-15:30</span>
                  <span className="activity-name">Admin & Planning</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">15:30-17:00</span>
                  <span className="activity-name">Secondary Tasks</span>
                </div>
              </div>
            </div>

            <div className="time-block evening-block">
              <div className="time-header">
                <span className="time-range">🌆 17:00-21:00</span>
                <span className="block-type">Personal Time</span>
              </div>
              <div className="activities">
                <div className="activity-item">
                  <span className="activity-time">17:00-18:30</span>
                  <span className="activity-name">Exercise & Health</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">18:30-20:00</span>
                  <span className="activity-name">Dinner & Family</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">20:00-21:00</span>
                  <span className="activity-name">Relaxation</span>
                </div>
              </div>
            </div>

            <div className="time-block night-block">
              <div className="time-header">
                <span className="time-range">🌙 21:00-00:30</span>
                <span className="block-type">{timetable.night_focus}</span>
              </div>
              <div className="activities">
                <div className="activity-item">
                  <span className="activity-time">21:00-22:30</span>
                  <span className="activity-name">{timetable.night_focus === "Side Hustle" ? "Personal Projects" : "Wellness & Health"}</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">22:30-00:30</span>
                  <span className="activity-name">Wind Down & Sleep Prep</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ai-schedule-note">
            <div className="ai-note-header">🤖 Your bro says:</div>
            <div className="ai-note-text">
              {timetable.schedule_text ? timetable.schedule_text.substring(0, 200) + "..." : "This schedule is optimized for your goals and preferences. Stay flexible and adjust as needed!"}
            </div>
          </div>
        </div>
      </div>

      <DailyLogger />
    </div>
  );
};

export default TimetableCard;