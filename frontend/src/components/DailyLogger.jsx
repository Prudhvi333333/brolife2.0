import React, { useState } from 'react';

const DailyLogger = () => {
  const [foodData, setFoodData] = useState({
    mealType: 'Breakfast',
    totalMeals: 1,
    foodType: 'Home'
  });
  const [sleepHours, setSleepHours] = useState(8);
  const [exercise, setExercise] = useState({ type: 'None', duration: 0 });
  const [medsTaken, setMedsTaken] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
          <select 
            value={foodData.mealType} 
            onChange={(e) => setFoodData({...foodData, mealType: e.target.value})}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          <input 
            type="number" 
            min="1" 
            max="3" 
            value={foodData.totalMeals} 
            onChange={(e) => setFoodData({...foodData, totalMeals: +e.target.value})} 
            placeholder="Total meals" 
          />
          <select 
            value={foodData.foodType} 
            onChange={(e) => setFoodData({...foodData, foodType: e.target.value})}
          >
            <option value="Home">Home</option>
            <option value="Outside">Outside</option>
          </select>
        </div>

        <div className="logger-card">
          <h4>😴 Sleep Tracker</h4>
          <input 
            type="number" 
            min="0" 
            max="24" 
            step="0.5" 
            value={sleepHours} 
            onChange={(e) => setSleepHours(+e.target.value)} 
            placeholder="Hours slept" 
          />
        </div>

        <div className="logger-card">
          <h4>🧘 Exercise Tracker</h4>
          <select 
            value={exercise.type} 
            onChange={(e) => setExercise({...exercise, type: e.target.value})}
          >
            <option value="None">None</option>
            <option value="Walk">Walk</option>
            <option value="Gym">Gym</option>
            <option value="Yoga">Yoga</option>
          </select>
          {exercise.type !== 'None' && (
            <input 
              type="number" 
              min="0" 
              value={exercise.duration}
              onChange={(e) => setExercise({...exercise, duration: +e.target.value})}
              placeholder="Duration (mins)" 
            />
          )}
        </div>

        <div className="logger-card">
          <h4>💊 Medication Tracker</h4>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={medsTaken} 
              onChange={(e) => setMedsTaken(e.target.checked)} 
            />
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

export default DailyLogger;