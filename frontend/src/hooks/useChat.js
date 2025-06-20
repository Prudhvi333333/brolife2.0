import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message, userId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message immediately
      setMessages(prev => [...prev, { 
        type: 'user', 
        content: message, 
        timestamp: new Date() 
      }]);

      const response = await chatAPI.sendMessage({
        message,
        user_id: userId
      });
      
      // Add bot response
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: response.response, 
        timestamp: new Date(),
        bro_name: response.bro_name 
      }]);

      return response;
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Hey, I'm having some technical issues right now. Let me try again in a bit!", 
        timestamp: new Date() 
      }]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
  };

  const getChatHistory = async (userId, limit = 20) => {
    try {
      const data = await chatAPI.getChatHistory(userId, limit);
      setMessages(data.history.reverse());
      return data.history;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    messages,
    isLoading,
    error,
    messagesEndRef,
    sendMessage,
    addMessage,
    getChatHistory,
    setMessages
  };
};