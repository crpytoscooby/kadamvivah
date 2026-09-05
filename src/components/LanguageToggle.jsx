import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';

/**
 * LanguageToggle - switches the UI between English and Marathi.
 * The choice is persisted to localStorage by re-reading it in i18n.js.
 */
export const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'mr' : 'en';
    i18n.changeLanguage(next);
    try {
      localStorage.setItem('language', next);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage} aria-label="Toggle language">
      <Languages className="w-4 h-4 mr-2" />
      {t('nav.language')}
    </Button>
  );
};
