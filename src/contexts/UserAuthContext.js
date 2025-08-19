import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error('useUserAuth must be used within UserAuthProvider');
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clearError = () => setError(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/profile')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('userToken');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.user.role !== 'user') {
        setError('Not a user account');
        return { success: false, error: 'Not a user account' };
      }
      localStorage.setItem('userToken', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };
  
const register = async (userData) => {
  try {
    setError(null);
    const response = await axios.post('/api/auth/register', userData);
    return { success: true, message: 'Registration successful! Please login.' };
  } catch (err) {
    const message = err.response?.data?.message || 'Registration failed';
    setError(message);
    return { success: false, error: message };
  }
};

  // Add register, updateProfile, changePassword as needed...

  return (
    <UserAuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
     register,
      isAuthenticated: !!user,
    clearError, 
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};