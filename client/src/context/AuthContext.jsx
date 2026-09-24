import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('flow_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        localStorage.removeItem('flow_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('flow_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('flow_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Quick switch between seeded demo accounts with 1 click
  const switchDemoAccount = async (role) => {
    const credentials = {
      client: { email: 'client@flow.com', password: 'password123' },
      freelancer: { email: 'freelancer@flow.com', password: 'password123' },
      designer: { email: 'ananya@flow.com', password: 'password123' },
      admin: { email: 'admin@flow.com', password: 'password123' },
    };

    const target = credentials[role];
    if (target) {
      return await login(target.email, target.password);
    }
  };

  const logout = () => {
    localStorage.removeItem('flow_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        switchDemoAccount,
        refreshUser,
        isAuthenticated: !!user,
        isClient: user?.role === 'client',
        isFreelancer: user?.role === 'freelancer',
        isAdmin: user?.role === 'admin',
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
