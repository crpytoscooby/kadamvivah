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
                KadamVivah is a <span className="font-semibold text-foreground">completely free</span> matrimonial 
                service dedicated to the Maratha-speaking community. We believe that finding a life partner should 
                be accessible to everyone, without financial barriers.
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
                <h3 className="text-xl font-semibold mb-2">Free Service</h3>
                <p className="text-muted-foreground text-sm">
                  No registration fees, no subscription charges. Our service is and will always remain free 
                  for the community.
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
                  Built specifically for Maratha families with deep respect for cultural values and traditions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                <p className="text-muted-foreground text-sm">
                  Your privacy and data security are our highest priorities. We protect your information 
                  with industry-standard security measures.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple & Easy</h3>
                <p className="text-muted-foreground text-sm">
                  User-friendly interface designed for all age groups. No complicated processes, just 
                  straightforward matchmaking.
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
                    <span className="font-semibold text-foreground">Create Your Profile:</span> Register for 
                    free and fill in your details to create a comprehensive matrimonial profile.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">Browse Profiles:</span> Once registered, 
                    you can view all profiles and use filters to find matches that meet your preferences.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">Connect Directly:</span> Contact details 
                    are visible to all registered users, allowing families to connect directly.
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to maintaining this platform as a free service for the Maratha community. 
                This initiative is driven by the desire to serve and support families in their search for 
                suitable life partners, without commercial interests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
