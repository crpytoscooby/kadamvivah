import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages authentication state across the application
 * 
 * Stores:
 * - token: JWT token from login (stored in localStorage)
 * - user: User object with { id, email, firstName, lastName, role }
 * 
 * Backend integration notes:
 * - Replace mockLogin with actual API call to POST /api/auth/login
 * - Replace mockRegister with actual API call to POST /api/auth/register
 * - Add token refresh logic if using refresh tokens
 * - Validate token on app load (e.g., GET /api/auth/me)
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
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login - replace with actual API call
  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/login', { email, password });
      // const { token, user } = response.data;
      
      // Mock implementation
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const mockToken = 'mock-jwt-token-' + Date.now();
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role || 'user'
      };

      setToken(mockToken);
      setUser(userData);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Mock register - replace with actual API call
  const register = async (userData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/register', userData);
      // const { token, user } = response.data;
      
      // Mock implementation
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      // Check if email already exists
      if (mockUsers.find(u => u.email === userData.email)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      mockUsers.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

      // Auto-login after registration
      const mockToken = 'mock-jwt-token-' + Date.now();
      const userForContext = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      };

      setToken(mockToken);
      setUser(userForContext);
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('authUser', JSON.stringify(userForContext));

      return { success: true, user: userForContext };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
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
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
