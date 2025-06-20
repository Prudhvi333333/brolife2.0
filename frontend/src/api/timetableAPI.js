const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const timetableAPI = {
  async generateTimetable(data) {
    const response = await fetch(`${BACKEND_URL}/api/generate-timetable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate timetable');
    }
    
    return response.json();
  },

  async getUserTimetables(userId, limit = 10) {
    const response = await fetch(`${BACKEND_URL}/api/timetables/${userId}?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to get timetables');
    }
    
    return response.json();
  }
};