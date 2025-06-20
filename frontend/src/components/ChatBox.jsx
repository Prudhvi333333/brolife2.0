import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../api/chatAPI';

const ChatBox = ({ user, onTimetableGenerated, className = "" }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    setMessages(prev => [...prev, { type: 'user', content: userMessage, timestamp: new Date() }]);

    try {
      const response = await chatAPI.sendMessage({
        message: userMessage,
        user_id: user.user_id
      });
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.response, 
        timestamp: new Date(),
        bro_name: response.bro_name 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Hey, I'm having some technical issues right now. Let me try again in a bit!", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-box ${className}`}>
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-content">
              <h2>Hey! I'm {user.bro_name} 👋</h2>
              <p>I'm your AI productivity companion. I'll help you:</p>
              <ul>
                <li>🎯 Create personalized daily timetables</li>
                <li>💪 Stay motivated and on track</li>
                <li>🚀 Achieve your goals consistently</li>
                <li>⚡ Balance side hustles with health</li>
              </ul>
              <p>What's on your mind today?</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-header">
                <span className="sender">
                  {message.type === 'user' ? '👤 You' : `🤖 ${message.bro_name || user.bro_name}`}
                </span>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="message-text">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="message-header">
                <span className="sender">🤖 {user.bro_name}</span>
              </div>
              <div className="message-text loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${user.bro_name} anything about productivity...`}
            className="message-input"
            rows="1"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            className="send-btn"
            disabled={isLoading || !inputMessage.trim()}
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;