import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Users, Shield, Target } from 'lucide-react';

/**
 * About Page - Information about KadamVivah
 */

export const About = () => {
  const { t } = useTranslation();

  const cards = [
    { icon: Heart, title: t('about.card1Title'), desc: t('about.card1Desc') },
    { icon: Users, title: t('about.card2Title'), desc: t('about.card2Desc') },
    { icon: Shield, title: t('about.card3Title'), desc: t('about.card3Desc') },
    { icon: Target, title: t('about.card4Title'), desc: t('about.card4Desc') },
  ];

  const steps = [
    { label: t('about.step1Label'), text: t('about.step1') },
    { label: t('about.step2Label'), text: t('about.step2') },
    { label: t('about.step3Label'), text: t('about.step3') },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t('about.title')}</h1>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t('about.missionTitle')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('about.mission')}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t('about.howTitle')}</h2>
              <ol className="space-y-4 text-muted-foreground">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-foreground">{step.label}</span> {step.text}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">{t('about.commitTitle')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('about.commit')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
