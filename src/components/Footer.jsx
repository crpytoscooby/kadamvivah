import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Footer - Site footer with links and copyright
 */

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/logo-horizontal.svg"
              alt="KadamVivah"
              className="h-12 w-auto mb-3"
            />
            <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3">{t('footer.getInTouch')}</h3>
            <p className="text-sm text-muted-foreground mb-2">{t('footer.haveQuestions')}</p>
            <Link to="/contact" className="text-sm text-primary hover:underline">
              {t('footer.contactUs')}
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p className="flex items-center">
            {t('footer.madeWith')} <Heart className="w-4 h-4 mx-1 text-primary fill-current" />{' '}
            {t('footer.forCommunity')}
          </p>
          <p className="mt-2 md:mt-0">
            © {new Date().getFullYear()} KadamVivah. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
