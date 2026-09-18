import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isMarathi = currentLang.startsWith('mr');

  const toggleLanguage = () => {
    const nextLang = isMarathi ? 'en' : 'mr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border-[#D9C39E] text-[#7A1526] hover:bg-[#F8F3EA] transition-all shadow-2xs"
      title={isMarathi ? 'Switch to English' : 'मराठी मध्ये पहा'}
    >
      <Languages className="w-3.5 h-3.5 text-[#B88E4B]" />
      <span className={isMarathi ? 'font-sans' : 'font-devanagari'}>
        {isMarathi ? 'English' : 'मराठी'}
      </span>
    </Button>
  );
};

export default LanguageToggle;
