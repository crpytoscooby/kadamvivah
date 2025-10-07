import axios from 'axios';

/**
 * API Wrapper using Axios
 * 
 * Configuration:
 * - Base URL is set via VITE_API_URL environment variable
 * - Automatically includes auth token in headers if available
 * - Handles common error scenarios
 * 
 * Backend Integration:
 * 1. Set VITE_API_URL in .env file (e.g., VITE_API_URL=http://localhost:5000/api)
 * 2. Replace mock implementations in components with actual API calls
 * 3. Ensure backend returns expected response format
 * 
 * Expected API Endpoints:
 * 
 * Auth:
 * - POST /auth/register - Register new user
 *   Body: { firstName, lastName, email, password, ...profileData }
 *   Response: { token, user: { id, email, firstName, lastName, role } }
 * 
 * - POST /auth/login - Login user
 *   Body: { email, password }
 *   Response: { token, user: { id, email, firstName, lastName, role } }
 * 
 * Profiles:
 * - GET /profiles - Get all profiles (with filters and pagination)
 *   Query params: gender, dobFrom, dobTo, city, education, page, limit
 *   Response: { profiles: [...], total, page, totalPages }
 * 
 * - GET /profiles/:id - Get single profile
 *   Response: { profile: {...} }
 * 
 * - POST /profiles - Create new profile (admin only)
 *   Body: { ...profileData }
 *   Response: { profile: {...} }
 * 
 * - PUT /profiles/:id - Update profile (admin only)
 *   Body: { ...profileData }
 *   Response: { profile: {...} }
 * 
 * - DELETE /profiles/:id - Delete profile (admin only)
 *   Response: { success: true }
 */

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API error:', data.message);
      }
      
      return Promise.reject(new Error(data.message || 'An error occurred'));
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
      return Promise.reject(new Error('Unable to connect to server'));
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
