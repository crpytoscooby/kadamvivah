import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.js';
import mr from './locales/mr.js';

/**
 * i18n configuration.
 *
 * Marathi (mr) is the default language for new visitors; a returning visitor's
 * saved choice (localStorage 'language') wins. English (en) is the fallback.
 * All UI strings live in src/locales/{mr,en}.js under one default namespace.
 */

const savedLanguage =
  (typeof localStorage !== 'undefined' && localStorage.getItem('language')) || 'mr';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    mr: { translation: mr },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
