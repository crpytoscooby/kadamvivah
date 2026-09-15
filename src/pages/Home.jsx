import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Lock, Users, Shield, CheckCircle } from 'lucide-react';

/**
 * Home Page - Landing page with hero, CTA, and blocked profile preview
 * 
 * Features:
 * - Hero section with Marathi and English copy
 * - CTA to register (free service messaging)
 * - Blocked/blurred profile preview for non-authenticated users
 * - Thank you section for Nitin Kadam
 * - Feature highlights
 */

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-accent to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Find Your Ideal Life Partner
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 font-devanagari">
              योग्य जोडीदार शोधा
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
              KadamVivah is a <span className="font-semibold text-foreground">100% free</span> matrimony platform dedicated to the Marathi community. 
              Create your account to view verified profiles and connect directly with families.
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 font-devanagari">
              प्रोफाइल पाहण्यासाठी विनामूल्य खाते तयार करा
            </p>
            
            {!isAuthenticated() ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                    Register Free
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
        </div>
      </section>

      {/* Blocked Profile Preview (for non-authenticated users) */}
      {!isAuthenticated() && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Discover Suitable Matches
              </h3>
              <p className="text-muted-foreground">
                Register for free to view complete biodatas and photographs
              </p>
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
                    <h4 className="text-xl font-bold mb-2">Profiles & Contacts Protected</h4>
                    <p className="text-muted-foreground mb-6">
                      Create your free account to view detailed biodatas and connect with prospective matches
                    </p>
                    <Link to="/register">
                      <Button size="lg" className="w-full">
                        Register Free Today
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
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Why Choose KadamVivah?
            </h3>
            <p className="text-muted-foreground font-devanagari">
              आमच्याबरोबर का निवडावे?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">100% Free Service</h4>
                <p className="text-sm text-muted-foreground">
                  Zero registration fees or hidden charges. Completely free matrimony service for our Marathi community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Verified & Secure</h4>
                <p className="text-sm text-muted-foreground">
                  Member privacy, verified biodatas, and family safety are our highest priorities.
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
                  Tailored specifically for Marathi-speaking families with cultural values and mutual respect.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Thank You Section - Nitin Kadam */}
      <section className="py-12 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">Special Gratitude</h4>
                  <p className="text-muted-foreground mb-2">
                    We express our sincere gratitude to <span className="font-semibold text-foreground">Nitin Kadam</span>, 
                    dedicated social worker from Pune (Parvati constituency), whose commitment to community welfare 
                    has been an inspiration for this matrimonial initiative.
                  </p>
                  <p className="text-muted-foreground font-devanagari">
                    नितीन कदम यांचे आभार - पुणे येथील समाजसेवक, परवती परिसरातील सामाजिक कार्यासाठी समर्पित.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated() && (
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Find Your Life Partner?
            </h3>
            <p className="text-lg mb-2 opacity-90 font-devanagari">
              आपल्या जीवनसाथीला शोधण्यासाठी तयार आहात?
            </p>
            <p className="text-lg mb-8 opacity-90">
              Join KadamVivah today — completely free of cost!
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Register Free Now
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
