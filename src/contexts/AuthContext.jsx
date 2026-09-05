import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Manages authentication state across the application
 *
 * Stores:
 * - token: mock token (stored in localStorage)
 * - user: User object with { id, email, firstName, lastName, role, mustChangePassword }
 * - mustChangePassword: Flag to force password change on first login
 *
 * NOTE: This is a MOCK implementation backed by localStorage (the
 * `mockUsers` collection seeded by src/lib/initMockData.js). To connect a
 * real backend, swap the bodies of login/register/changePassword for the
 * axios calls documented in src/lib/api.js.
 */

// Simulate network latency for a realistic UX.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const readUsers = () => JSON.parse(localStorage.getItem('mockUsers') || '[]');
const writeUsers = (users) => localStorage.setItem('mockUsers', JSON.stringify(users));

// Strip the password before exposing a user object to the app.
const toPublicUser = ({ password, ...rest }) => rest;

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

  // Persist an authenticated session to state + localStorage.
  const startSession = (publicUser) => {
    const mockToken = `mock-token-${publicUser.id}-${Date.now()}`;
    setToken(mockToken);
    setUser(publicUser);
    setMustChangePassword(publicUser.mustChangePassword || false);

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('authUser', JSON.stringify(publicUser));
    localStorage.setItem('mustChangePassword', publicUser.mustChangePassword ? 'true' : 'false');
  };

  // Login with email and password (mock)
  const login = async (email, password) => {
    await delay();
    const users = readUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!match) {
      throw new Error('Invalid email or password');
    }

    const publicUser = toPublicUser(match);
    startSession(publicUser);
    return { success: true, user: publicUser };
  };

  // Register a new user (mock). Also creates a matching profile so the new
  // member immediately appears in the profiles listing.
  const register = async (data) => {
    await delay();
    const users = readUsers();

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }

    // Drop form-only fields that should never be persisted on the account.
    const { confirmPassword, acceptTerms, fatherName, motherName, siblings, ...rest } = data;
    const id = `user-${Date.now()}`;

    // Lean account record used for authentication.
    const newUser = {
      id,
      email: rest.email,
      password: rest.password,
      firstName: rest.firstName,
      lastName: rest.lastName,
      role: 'user',
    };
    users.push(newUser);
    writeUsers(users);

    // Matching public profile (never store the password here).
    const { password, ...profileFields } = rest;
    const profiles = JSON.parse(localStorage.getItem('mockProfiles') || '[]');
    profiles.push({
      id: `profile-${Date.now()}`,
      userId: id,
      ...profileFields,
      familyDetails: profileFields.familyDetails || { fatherName, motherName, siblings },
      photos: profileFields.photos || [],
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('mockProfiles', JSON.stringify(profiles));

    const publicUser = toPublicUser(newUser);
    startSession(publicUser);
    return { success: true, user: publicUser };
  };

  // Change password (mock)
  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    await delay();

    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match');
    }

    const users = readUsers();
    const index = users.findIndex((u) => u.id === user?.id);

    if (index === -1) {
      throw new Error('User not found');
    }
    if (users[index].password !== oldPassword) {
      throw new Error('Current password is incorrect');
    }

    users[index] = { ...users[index], password: newPassword, mustChangePassword: false };
    writeUsers(users);

    const publicUser = toPublicUser(users[index]);
    startSession(publicUser);
    setMustChangePassword(false);
    localStorage.setItem('mustChangePassword', 'false');
    return { success: true, user: publicUser };
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
    register,
    changePassword,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
