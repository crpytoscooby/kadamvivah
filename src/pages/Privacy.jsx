import { Card, CardContent } from '../components/ui/card';

/**
 * Privacy Policy Page
 */

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                KadamVivah ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our 
                matrimonial service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you register on KadamVivah, we collect the following information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                <li>Name (first, middle, last)</li>
                <li>Email address and phone number</li>
                <li>Date of birth and gender</li>
                <li>Location (city, state, pincode)</li>
                <li>Community information (caste, sub-caste)</li>
                <li>Education and occupation details</li>
                <li>Family information</li>
                <li>Photographs</li>
                <li>Bio and personal description</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Create and manage your matrimonial profile</li>
                <li>Display your profile to other registered users</li>
                <li>Facilitate communication between users</li>
                <li>Improve our services and user experience</li>
                <li>Send service-related notifications (if opted in)</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Information Sharing and Disclosure</h2>
              <h3 className="text-xl font-semibold mb-2">With Other Users</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your profile information, including contact details, is visible to all registered users of 
                KadamVivah. This is essential for the matrimonial matchmaking purpose of our service.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">With Third Parties</h3>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information. 
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Update or correct your information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to improve your experience on our platform. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is intended for users aged 18 and above. We do not knowingly collect information 
                from individuals under 18 years of age.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant 
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
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
