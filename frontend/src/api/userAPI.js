const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const userAPI = {
  async getUser(userId) {
    const response = await fetch(`${BACKEND_URL}/api/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    
    return response.json();
  },

  async setupUser(userData) {
    const response = await fetch(`${BACKEND_URL}/api/user/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to setup user');
    }
    
    return response.json();
  }
};