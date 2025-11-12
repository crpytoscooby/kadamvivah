import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

/**
 * AuthContext - Manages authentication state across the application
 * 
 * Stores:
 * - token: JWT token from login (stored in localStorage)
 * - user: User object with { id, email, firstName, lastName, role, mustChangePassword }
 * - mustChangePassword: Flag to force password change on first login
 */

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    const storedMustChangePassword = localStorage.getItem('mustChangePassword') === 'true';
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setMustChangePassword(storedMustChangePassword);
    }
    setLoading(false);
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setMustChangePassword(user.mustChangePassword || false);

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('mustChangePassword', user.mustChangePassword ? 'true' : 'false');

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
        confirmPassword
      });

      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setMustChangePassword(false);

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('mustChangePassword', 'false');

      return { success: true, user };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMustChangePassword(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('mustChangePassword');
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    token,
    mustChangePassword,
    loading,
    login,
    changePassword,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
