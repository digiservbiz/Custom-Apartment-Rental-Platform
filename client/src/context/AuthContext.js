import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await axios.get('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.data);
      } catch (error) {
        console.error('Error loading user', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshUser = async () => {
    setLoading(true);
    await loadUser();
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/v1/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const { data: userData } = await axios.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
    });
    setUser(userData.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (name, email, password, role) => {
    const { data } = await axios.post('/api/v1/auth/register', { name, email, password, role });
    localStorage.setItem('token', data.token);
    const { data: userData } = await axios.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
    });
    setUser(userData.data);
    };

  const socialLoginCallback = async (token) => {
    setLoading(true);
    localStorage.setItem('token', token);
    try {
      const { data: userData } = await axios.get('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userData.data);
    } catch (error) {
      console.error('Error loading user after social login', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, socialLoginCallback, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
