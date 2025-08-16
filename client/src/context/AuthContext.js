import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
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
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
