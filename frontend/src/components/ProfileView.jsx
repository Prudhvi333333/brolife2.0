import React from 'react';

const ProfileView = ({ user, onEditClick }) => {
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
            <button className="edit-btn" onClick={onEditClick}>
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
};

export default ProfileView;