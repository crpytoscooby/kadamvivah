import { Card, CardContent } from '../components/ui/card';

/**
 * Terms of Service Page
 */

export const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using KadamVivah, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                KadamVivah is a free matrimonial service platform designed for the Maratha-speaking community. 
                We provide a platform for users to create profiles and connect with potential life partners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To use KadamVivah, you must:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and truthful information</li>
                <li>Not be prohibited from using the service under applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">User Responsibilities</h2>
              <h3 className="text-xl font-semibold mb-2">Account Security</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for 
                all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold mb-2">Accurate Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to provide accurate, current, and complete information in your profile and to 
                update it as necessary to maintain its accuracy.
              </p>

              <h3 className="text-xl font-semibold mb-2">Prohibited Conduct</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Provide false or misleading information</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Use the service for commercial purposes</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to the platform</li>
                <li>Upload malicious code or viruses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Content and Intellectual Property</h2>
              <h3 className="text-xl font-semibold mb-2">Your Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain ownership of the content you upload (photos, bio, etc.). By uploading content, 
                you grant KadamVivah a license to display and use this content for the purpose of providing 
                the service.
              </p>

              <h3 className="text-xl font-semibold mb-2">Platform Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                All content on the KadamVivah platform, including design, text, graphics, and software, is 
                owned by KadamVivah and protected by intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of KadamVivah is also governed by our Privacy Policy. Please review our Privacy 
                Policy to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                KadamVivah is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>The accuracy or reliability of user-provided information</li>
                <li>That you will find a suitable match</li>
                <li>Uninterrupted or error-free service</li>
                <li>That the service will meet your specific requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, KadamVivah shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages arising from your use of the service. 
                We are not responsible for the conduct of users or the outcome of any connections made through 
                the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account at any time, with or without notice, 
                for any reason, including violation of these Terms of Service. You may also delete your account 
                at any time by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Modifications to Service and Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify or discontinue the service at any time. We may also update 
                these Terms of Service from time to time. Continued use of the service after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-primary font-semibold mt-2">
                <a href="mailto:contact@kadamvivah.in" className="hover:underline">
                  contact@kadamvivah.in
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
