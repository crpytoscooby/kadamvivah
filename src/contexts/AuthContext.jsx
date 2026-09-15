import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

/**
 * AuthContext - Manages authenticated user session across the application.
 * Uses secure HttpOnly cookie session via backend API.
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
  const [loading, setLoading] = useState(true);

  // Verify authenticated session with backend
  const verifySession = async () => {
    try {
      const response = await api.get('/auth/me');
      const freshUser = response.data?.data?.user;
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem('authUser', JSON.stringify(freshUser));
        return freshUser;
      } else {
        setUser(null);
        localStorage.removeItem('authUser');
        return null;
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('authUser');
      return null;
    }
  };

  // Check authenticated session on mount from /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // Optimistically restore cached user object for instant UI render
      const cachedUser = localStorage.getItem('authUser');
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch (e) {
          localStorage.removeItem('authUser');
        }
      }

      try {
        const response = await api.get('/auth/me');
        if (isMounted) {
          const freshUser = response.data?.data?.user;
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem('authUser', JSON.stringify(freshUser));
          } else {
            setUser(null);
            localStorage.removeItem('authUser');
          }
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('authUser');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Cross-tab synchronization via storage events
    const handleStorageChange = (e) => {
      if (e.key === 'authUser') {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            setUser(parsed);
          } catch (err) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    // Re-verify session on window focus / tab visibility change (throttled)
    let lastFocusCheck = 0;
    const handleFocusOrVisibility = () => {
      const now = Date.now();
      if (now - lastFocusCheck > 3000) {
        lastFocusCheck = now;
        verifySession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocusOrVisibility);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocusOrVisibility();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocusOrVisibility);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const authenticatedUser = response.data?.data?.user;

      if (!authenticatedUser) {
        throw new Error('Failed to retrieve user information.');
      }

      setUser(authenticatedUser);
      localStorage.setItem('authUser', JSON.stringify(authenticatedUser));

      return { success: true, user: authenticatedUser };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register new user and profile
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const registeredUser = response.data?.data?.user;

      if (!registeredUser) {
        throw new Error('Registration succeeded but user data was missing.');
      }

      setUser(registeredUser);
      localStorage.setItem('authUser', JSON.stringify(registeredUser));

      return { success: true, user: registeredUser };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authUser');
    }
  };

  const isAuthenticated = () => {
    return !!user && user.account_status !== 'suspended';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifySession,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
