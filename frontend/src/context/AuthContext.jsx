import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check stored token
  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem('smilecare_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('smilecare_token');
            setUser(null);
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('smilecare_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.token) {
      localStorage.setItem('smilecare_token', res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success && res.token) {
      localStorage.setItem('smilecare_token', res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.success && res.user) {
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Update failed');
  };

  const logout = () => {
    localStorage.removeItem('smilecare_token');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isPatient = user?.role === 'PATIENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isPatient,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
