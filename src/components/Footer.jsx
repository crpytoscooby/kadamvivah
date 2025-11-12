import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

/**
 * Footer - Site footer with links and copyright
 */

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl font-bold text-primary">KadamVivah</span>
              <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-devanagari font-semibold">
                कद
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Free Maratha matrimony service connecting families with trust and respect.
            </p>
            <p className="text-sm text-muted-foreground mt-2 font-devanagari">
              विनामूल्य मराठी विवाह सेवा
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3">Get in Touch</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Have questions? We're here to help.
            </p>
            <Link to="/contact" className="text-sm text-primary hover:underline">
              Contact Us →
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p className="flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-primary fill-current" /> for the Maratha community
          </p>
          <p className="mt-2 md:mt-0">
            © {new Date().getFullYear()} KadamVivah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
