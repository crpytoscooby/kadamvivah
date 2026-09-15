import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'mr' ? 'en' : 'mr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 text-gray-700 hover:bg-gray-100"
      title="Switch Language / भाषा बदला"
    >
      <Languages className="w-4 h-4 text-primary" />
      <span>{i18n.language === 'mr' ? 'मराठी' : 'English'}</span>
    </Button>
  );
};

export default LanguageToggle;
