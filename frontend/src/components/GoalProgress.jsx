import React from 'react';

const GoalProgress = ({ goals, progress, onUpdateProgress }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#4ade80'; // green
    if (percentage >= 50) return '#fbbf24'; // yellow
    return '#f87171'; // red
  };

  const getProgressPercentage = (current, target) => {
    return target > 0 ? (current / target) * 100 : 0;
  };

  return (
    <div className="goal-progress-container">
      <h3>🎯 Goal Progress</h3>
      
      <div className="goals-list">
        {goals.map((goal, index) => {
          const goalProgress = progress[index] || { current: 0, target: 100 };
          const percentage = getProgressPercentage(goalProgress.current, goalProgress.target);
          
          return (
            <div key={index} className="goal-progress-item">
              <div className="goal-header">
                <span className="goal-text">{goal}</span>
                <span className="goal-percentage">
                  {Math.round(percentage)}%
                </span>
              </div>
              
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: getProgressColor(percentage)
                    }}
                  />
                </div>
                <div className="progress-numbers">
                  <span>{goalProgress.current}</span>
                  <span>/</span>
                  <span>{goalProgress.target}</span>
                </div>
              </div>
              
              <div className="progress-actions">
                <button 
                  className="progress-btn decrease"
                  onClick={() => onUpdateProgress(index, goalProgress.current - 1)}
                  disabled={goalProgress.current <= 0}
                >
                  −
                </button>
                <button 
                  className="progress-btn increase"
                  onClick={() => onUpdateProgress(index, goalProgress.current + 1)}
                  disabled={goalProgress.current >= goalProgress.target}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {goals.length === 0 && (
        <div className="no-goals-message">
          <p>No goals set yet. Set up your goals to track progress! 🎯</p>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;