import React from 'react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'timetable', icon: '📅', label: 'Schedule' },
    { id: 'trackers', icon: '📊', label: 'Trackers' }
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button 
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;