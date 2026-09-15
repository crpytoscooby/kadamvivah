import { Card, CardContent } from '../components/ui/card';
import { Heart, Users, Shield, Target } from 'lucide-react';

/**
 * About Page - Information about KadamVivah
 */

export const About = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About KadamVivah</h1>
          <p className="text-xl text-muted-foreground font-devanagari">कदमविवाह बद्दल</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                KadamVivah is a <span className="font-semibold text-foreground">100% free</span> matrimonial 
                service dedicated to the Marathi-speaking community. We believe finding a suitable life partner should 
                be transparent, respectful, and accessible to every family without any financial burden.
              </p>
              <p className="text-muted-foreground leading-relaxed font-devanagari">
                कदमविवाह ही मराठी भाषिक समुदायासाठी पूर्णपणे विनामूल्य विवाह सेवा आहे. आम्ही मानतो की 
                जीवनसाथी शोधणे प्रत्येकासाठी सुलभ असावे, आर्थिक अडथळ्यांशिवाय.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Free Platform</h3>
                <p className="text-muted-foreground text-sm">
                  Zero registration fees, no contact unlock charges, and no hidden subscriptions. Our platform is and will always remain completely free for the community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
                <p className="text-muted-foreground text-sm">
                  Built specifically for Marathi families across Maharashtra and beyond, respecting cultural traditions, gotra, and family values.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Privacy-First</h3>
                <p className="text-muted-foreground text-sm">
                  Member privacy and profile authenticity are our highest priorities. Direct contact details are shared only upon mutual consent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple & Accessible</h3>
                <p className="text-muted-foreground text-sm">
                  Clean, user-friendly interface designed for candidates and parents of all age groups to browse biodatas with ease.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">Create Matrimonial Profile:</span> Register for 
                    free and fill in educational, professional, family, and personal biodata details.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">Browse Suitable Matches:</span> Search 
                    verified profiles and use filters (city, education, caste, age) to find matching candidates.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">Connect with Families:</span> Express interest 
                    and unlock verified direct contact details once mutual interest is accepted.
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are wholeheartedly committed to maintaining KadamVivah as a free community service for Marathi families. 
                This initiative is driven purely by the desire to support families in finding suitable life partners, 
                without commercial interests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
