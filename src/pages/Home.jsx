import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Lock, Users, Shield, ExternalLink } from 'lucide-react';

/**
 * Home Page - Landing page with hero, CTA, and blocked profile preview
 *
 * Features:
 * - Two-column hero with matrimony imagery + Marathi/English copy
 * - CTA to register (free service messaging)
 * - Blocked/blurred profile preview for non-authenticated users
 * - "Behind the initiative" section featuring Nitin Kadam
 * - Feature highlights
 */

// Facebook profile of the person behind the free initiative.
const NITIN_FB_URL = 'https://www.facebook.com/nitin.kadam.9235/';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [photoError, setPhotoError] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent to-background py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                <Heart className="w-4 h-4" /> 100% Free • विनामूल्य
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                Find Your Perfect Match
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-devanagari">
                योग्य जोडीदार शोधा
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 text-balance">
                KadamVivah is a <span className="font-semibold text-foreground">free</span> matrimony
                service for the Marathi community. Create an account to view profiles and connect
                with families.
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-8 font-devanagari">
                प्रोफाइल पाहण्यासाठी विनामूल्य खाते तयार करा
              </p>

              {!isAuthenticated() ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                      Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to="/profiles">
                  <Button size="lg" className="text-lg px-8">
                    Browse Profiles
                  </Button>
                </Link>
              )}
            </div>

            {/* Imagery */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/10">
                <img
                  src="/images/hero-main.jpg"
                  alt="An Indian bride and groom in traditional wedding attire"
                  className="w-full h-[360px] md:h-[460px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating accent images */}
              <div className="hidden sm:block absolute -bottom-6 -left-6 w-32 h-40 rounded-xl overflow-hidden shadow-xl ring-4 ring-background rotate-[-4deg]">
                <img
                  src="/images/matrimony-2.jpg"
                  alt="Indian newlyweds at a festively lit wedding"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="hidden sm:block absolute -top-6 -right-6 w-28 h-28 rounded-xl overflow-hidden shadow-xl ring-4 ring-background rotate-[6deg]">
                <img
                  src="/images/matrimony-3.jpg"
                  alt="Bride and groom joining henna-adorned hands"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blocked Profile Preview (for non-authenticated users) */}
      {!isAuthenticated() && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Discover Profiles</h3>
              <p className="text-muted-foreground">Register for free to view detailed profiles</p>
            </div>

            <div className="relative">
              {/* Blurred preview grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 blur-sm">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-muted to-muted-foreground/20" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                      <div className="h-3 bg-muted rounded mb-2 w-1/2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <Card className="max-w-md mx-4">
                  <CardContent className="p-8 text-center">
                    <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h4 className="text-xl font-bold mb-2">Profiles are Private</h4>
                    <p className="text-muted-foreground mb-6">
                      Create a free account to view all profiles and connect with potential matches
                    </p>
                    <Link to="/register">
                      <Button size="lg" className="w-full">
                        Register Now - It's Free!
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Why Choose KadamVivah?</h3>
            <p className="text-muted-foreground font-devanagari">आमच्याबरोबर का निवडावे?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">100% Free</h4>
                <p className="text-sm text-muted-foreground">
                  No hidden charges. Completely free service for the Marathi community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Safe & Secure</h4>
                <p className="text-sm text-muted-foreground">
                  Your privacy and data security are our top priorities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Community Focused</h4>
                <p className="text-sm text-muted-foreground">
                  Built specifically for Marathi-speaking families with cultural respect.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Behind the Initiative - Nitin Kadam */}
      <section className="py-16 bg-accent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Behind the Initiative</h3>
            <p className="text-muted-foreground font-devanagari">या उपक्रमामागील प्रेरणा</p>
          </div>

          <Card className="border-primary/20 overflow-hidden">
            <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 p-6 md:p-8 items-center">
              {/* Portrait with graceful fallback */}
              <div className="mx-auto md:mx-0">
                {!photoError ? (
                  <img
                    src="/images/nitin-kadam.jpg"
                    alt="Nitin Kadam, social worker from Pune"
                    onError={() => setPhotoError(true)}
                    className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
                  />
                ) : (
                  <div
                    className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-4 ring-primary/20 shadow-lg"
                    aria-label="Nitin Kadam"
                  >
                    <span className="text-4xl md:text-5xl font-bold font-devanagari">नि.क</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-xl md:text-2xl font-bold mb-1">Nitin Kadam</h4>
                <p className="text-primary font-medium mb-3 font-devanagari">
                  समाजसेवक, पुणे (परवती परिसर)
                </p>
                <p className="text-muted-foreground mb-3">
                  This free matrimony initiative is driven by{' '}
                  <span className="font-semibold text-foreground">Nitin Kadam</span>, a dedicated
                  social worker based in Pune and active in the Parvati area. His commitment to local
                  civic issues and community service is the inspiration behind KadamVivah — helping
                  Marathi families connect with trust and dignity, entirely free of cost.
                </p>
                <p className="text-muted-foreground mb-5 font-devanagari">
                  नितीन कदम यांच्या सामाजिक कार्यातून प्रेरित होऊन, मराठी कुटुंबांसाठी ही विनामूल्य
                  विवाह सेवा सुरू करण्यात आली आहे.
                </p>
                <a href={NITIN_FB_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Facebook
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated() && (
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Life Partner?</h3>
            <p className="text-lg mb-2 opacity-90 font-devanagari">
              आपल्या जीवनसाथीला शोधण्यासाठी तयार आहात?
            </p>
            <p className="text-lg mb-8 opacity-90">Join KadamVivah today - it's completely free!</p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
