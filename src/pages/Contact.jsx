import { Card, CardContent } from '../components/ui/card';
import { Mail, MessageSquare, HelpCircle } from 'lucide-react';

/**
 * Contact Page - Contact information and support
 */

export const Contact = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground font-devanagari">आमच्याशी संपर्क साधा</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We are here to assist you! If you have any questions, profile-related queries, or suggestions, 
                    please feel free to reach out to our support team.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-2 font-devanagari">
                    आम्ही मदतीसाठी येथे आहोत! तुम्हाला काही प्रश्न, सूचना किंवा मदतीची आवश्यकता असल्यास, 
                    कृपया आमच्याशी संपर्क साधा.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Write to us at:</p>
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
                <h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  For queries regarding registration, profile updates, or platform features.
                </p>
                <p className="text-xs text-muted-foreground">
                  Expected response: Within 24-48 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Technical Assistance</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Experiencing technical issues while logging in or uploading photos? We are happy to help.
                </p>
                <p className="text-xs text-muted-foreground">
                  Expected response: Within 24-48 hours
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Is KadamVivah really free of cost?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, KadamVivah is 100% free with zero hidden charges. There are no registration 
                    fees, premium packages, or fees for connecting with matches.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">How do I browse matrimonial profiles?</h3>
                  <p className="text-sm text-muted-foreground">
                    Simply create a free account and sign in. You will have full access to 
                    browse verified member profiles across Maharashtra.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">How can I connect with a prospective match?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can express interest directly from the candidate's profile. Once your interest request is accepted, verified direct contact details (phone and email) will be unlocked mutually.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Is my personal information secure?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we maintain strict privacy and data security practices to protect your contact numbers, photographs, and personal information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
