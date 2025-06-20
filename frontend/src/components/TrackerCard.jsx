import React from 'react';

const TrackerCard = ({ title, icon, data, category, isExpanded, onToggle }) => {
  const getProgressColor = (value, target) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return '#4ade80'; // green
    if (percentage >= 70) return '#fbbf24'; // yellow
    return '#f87171'; // red
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

  return (
    <div 
      className={`tracker-card ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggle}
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

export default TrackerCard;