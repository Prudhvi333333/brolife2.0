const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const chatAPI = {
  async sendMessage(message) {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },

  async getChatHistory(userId, limit = 20) {
    const response = await fetch(`${BACKEND_URL}/api/chat-history/${userId}?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to get chat history');
    }
    
    return response.json();
  }
};