import React from 'react';

const DailyLogger = () => {
  const [foodData, setFoodData] = React.useState({
    mealType: 'Breakfast',
    totalMeals: 1,
    foodType: 'Home'
  });
  const [sleepHours, setSleepHours] = React.useState(8);
  const [exercise, setExercise] = React.useState({ type: 'None', duration: 0 });
  const [medsTaken, setMedsTaken] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const saveDailyInputs = () => {
    const dailyData = {
      date: new Date().toISOString().split('T')[0],
      food: { ...foodData, quality: foodData.foodType === 'Home' ? 90 : 60 },
      sleep: sleepHours,
      exercise,
      medications: medsTaken,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('dailyLog', JSON.stringify(dailyData));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="daily-logger">
      <h3>📘 Log Your Day</h3>
      
      {showSuccess && (
        <div className="success-banner">
          ✅ Daily inputs saved successfully!
        </div>
      )}

      <div className="logger-sections">
        <div className="logger-card">
          <h4>🍽️ Food Tracker</h4>
          <select value={foodData.mealType} onChange={(e) => setFoodData({...foodData, mealType: e.target.value})}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          <input type="number" min="1" max="3" value={foodData.totalMeals} 
                 onChange={(e) => setFoodData({...foodData, totalMeals: +e.target.value})} 
                 placeholder="Total meals" />
          <select value={foodData.foodType} onChange={(e) => setFoodData({...foodData, foodType: e.target.value})}>
            <option value="Home">Home</option>
            <option value="Outside">Outside</option>
          </select>
        </div>

        <div className="logger-card">
          <h4>😴 Sleep Tracker</h4>
          <input type="number" min="0" max="24" step="0.5" value={sleepHours} 
                 onChange={(e) => setSleepHours(+e.target.value)} 
                 placeholder="Hours slept" />
        </div>

        <div className="logger-card">
          <h4>🧘 Exercise Tracker</h4>
          <select value={exercise.type} onChange={(e) => setExercise({...exercise, type: e.target.value})}>
            <option value="None">None</option>
            <option value="Walk">Walk</option>
            <option value="Gym">Gym</option>
            <option value="Yoga">Yoga</option>
          </select>
          {exercise.type !== 'None' && (
            <input type="number" min="0" value={exercise.duration}
                   onChange={(e) => setExercise({...exercise, duration: +e.target.value})}
                   placeholder="Duration (mins)" />
          )}
        </div>

        <div className="logger-card">
          <h4>💊 Medication Tracker</h4>
          <label className="toggle-switch">
            <input type="checkbox" checked={medsTaken} onChange={(e) => setMedsTaken(e.target.checked)} />
            <span className="toggle-slider"></span>
            Did you take your meds?
          </label>
        </div>
      </div>

      <button className="save-daily-btn" onClick={saveDailyInputs}>
        💾 Save Daily Inputs
      </button>
    </div>
  );
};

const TimetableCard = ({ timetable, onViewFullSchedule, onRegenerate, isLoading = false, isPreview = false }) => {
  console.log('TimetableCard render:', { timetable, isPreview, isLoading });
  
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

      <DailyLogger />
    </div>
  );
};

export default TimetableCard;