import axios from 'axios';

/**
 * API Wrapper using Axios
 * 
 * Configured with HttpOnly cookie sessions (`withCredentials: true`)
 * compatible with PHP backend on Hostinger and local development.
 */

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In browser, if hosted on a web domain (not localhost), always use relative /api
  if (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  // Default to relative /api in production or localhost:5000/api in local development
  return (import.meta.env.PROD || process.env.NODE_ENV === 'production') ? '/api' : 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Response interceptor - handle common errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || 'A server error occurred';

      if (status === 401) {
        // Clear cached auth user on 401
        localStorage.removeItem('authUser');
      }

      const customError = new Error(errorMessage);
      customError.response = error.response;
      customError.status = status;
      customError.data = data;
      return Promise.reject(customError);
    } else if (error.request) {
      const netError = new Error('Unable to connect to server. Please check your internet connection.');
      netError.request = error.request;
      return Promise.reject(netError);
    } else {
      return Promise.reject(new Error(error.message || 'Request failed'));
    }
  }
);

export default api;
