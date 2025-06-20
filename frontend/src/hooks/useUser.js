import { useState, useEffect } from 'react';
import { userAPI } from '../api';

export const useUser = () => {
  const [user, setUser] = useState({ 
    user_id: 'default_user', 
    bro_name: 'Bro', 
    goals: [], 
    preferences: '' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await userAPI.getUser('default_user');
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await userAPI.setupUser(userData);
      setUser(prev => ({
        ...prev,
        bro_name: userData.bro_name,
        goals: userData.goals,
        preferences: userData.preferences
      }));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    error,
    loadUser,
    updateUser
  };
};