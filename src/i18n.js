import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * i18n configuration
 *
 * Provides the `common` namespace used across the UI (Navbar, etc.)
 * in English and Marathi. The selected language is persisted to
 * localStorage so it survives reloads.
 */

const resources = {
  en: {
    common: {
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin',
      login: 'Login',
      register: 'Register',
      profiles: 'Profiles',
      language: 'मराठी',
    },
  },
  mr: {
    common: {
      home: 'मुख्यपृष्ठ',
      about: 'आमच्याबद्दल',
      contact: 'संपर्क',
      admin: 'प्रशासक',
      login: 'लॉगिन',
      register: 'नोंदणी',
      profiles: 'प्रोफाइल',
      language: 'English',
    },
  },
};

// Default the UI to Marathi; a returning visitor's saved choice wins.
const savedLanguage =
  (typeof localStorage !== 'undefined' && localStorage.getItem('language')) || 'mr';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
