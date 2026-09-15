import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    common: {
      home: 'Home',
      about: 'About Us',
      contact: 'Contact',
      admin: 'Admin',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profiles: 'Profiles',
      search: 'Search',
      filter: 'Filter',
      apply: 'Apply'
    }
  },
  mr: {
    common: {
      home: 'मुख्यपृष्ठ',
      about: 'आमच्याबद्दल',
      contact: 'संपर्क',
      admin: 'प्रशासक',
      login: 'लॉगिन',
      register: 'नोंदणी करा',
      logout: 'बाहेर पडा',
      profiles: 'स्थळे',
      search: 'शोधा',
      filter: 'फिल्टर',
      apply: 'लागू करा'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
