import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';

/**
 * Contact Page - Contact information and support
 */

export const Contact = () => {
  const { t } = useTranslation();

  const faqs = [
    { q: t('contact.faq1Q'), a: t('contact.faq1A') },
    { q: t('contact.faq2Q'), a: t('contact.faq2A') },
    { q: t('contact.faq3Q'), a: t('contact.faq3A') },
    { q: t('contact.faq4Q'), a: t('contact.faq4A') },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t('contact.title')}</h1>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('contact.getInTouch')}</h2>
                  <p className="text-muted-foreground leading-relaxed">{t('contact.intro')}</p>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{t('contact.emailLabel')}</p>
                <a
                  href="mailto:contact@kadamvivah.in"
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  contact@kadamvivah.in
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('contact.generalTitle')}</h3>
                <p className="text-muted-foreground text-sm mb-3">{t('contact.generalDesc')}</p>
                <p className="text-xs text-muted-foreground">{t('contact.responseTime')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('contact.techTitle')}</h3>
                <p className="text-muted-foreground text-sm mb-3">{t('contact.techDesc')}</p>
                <p className="text-xs text-muted-foreground">{t('contact.responseTime')}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-4">{t('contact.faqTitle')}</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="font-semibold mb-1">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
