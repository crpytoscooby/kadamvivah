import mockProfiles from '../data/mock-profiles.json';
import mockUsers from '../data/mock-users.json';

/**
 * Initialize mock data in localStorage
 * 
 * This function loads mock profiles and users into localStorage
 * to simulate a backend database for development and testing.
 * 
 * Call this once when the app loads (in main.jsx)
 */

export const initMockData = () => {
  // Only initialize if data doesn't exist
  if (!localStorage.getItem('mockProfiles')) {
    localStorage.setItem('mockProfiles', JSON.stringify(mockProfiles));
    console.log('Mock profiles initialized');
  }

  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    console.log('Mock users initialized');
  }
};
