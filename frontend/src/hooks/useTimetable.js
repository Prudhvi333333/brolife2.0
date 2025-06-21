import { useState } from 'react';
import { timetableAPI } from '../api';

export const useTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTimetable = async (goals, preferences, userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await timetableAPI.generateTimetable({
        goals,
        preferences,
        user_id: userId
      });
      
      setTimetable(data.timetable);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTimetables = async (userId, limit = 10) => {
    try {
      setLoading(true);
      const data = await timetableAPI.getUserTimetables(userId, limit);
      return data.timetables;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    timetable,
    loading,
    error,
    generateTimetable,
    getTimetables,
    setTimetable: (data) => setTimetable(data)
  };
};