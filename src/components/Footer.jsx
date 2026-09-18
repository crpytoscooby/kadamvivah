import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * Footer - Site footer with 3-column layout, verified attribution, and strict language support
 * Fully adapts to active Marathi or English language.
 */

export const Footer = () => {
  const { isAdmin } = useAuth();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  return (
    <footer className="bg-[#171210] text-[#EDE6DC] border-t border-[#362A26] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        {/* 3-Column Composition */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1 (Left): Brand, Identity, & Attribution */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 px-2.5 min-w-[44px] rounded-xl bg-gradient-to-br from-[#7A1526] to-[#550E1B] text-white flex items-center justify-center border border-[#D9C39E] shadow-xs">
                <span className="text-xs font-black font-devanagari tracking-wider text-white">कदम</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  KadamVivah
                </span>
                <span className="block text-[10px] font-medium text-[#D9C39E] font-devanagari tracking-wider">
                  {isMarathi ? 'मराठा व देशमुख विवाह व्यासपीठ' : 'Maratha & Deshmukh Matrimony'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#C4B7A6] leading-relaxed max-w-sm">
              {isMarathi
                ? 'मराठा व देशमुख समाजातील कुटुंबांसाठी परस्पर आदर, प्रशासकीय मंजूर प्रोफाइल आणि गोपनीयतेसह विनामूल्य विवाह व्यासपीठ.'
                : 'A community-focused matrimonial platform dedicated to Maratha and Deshmukh families with mutual respect, admin-approved profiles, and contact privacy.'
              }
            </p>

            <div className="pt-3 space-y-1.5 border-t border-[#2F2420] text-xs font-medium">
              <p className="text-[#D9C39E]">
                {isMarathi ? 'संस्थापक — नितीन कदम' : 'Founder — Nitin Kadam'}
              </p>
              <div>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#A89A89] hover:text-[#D9C39E] transition-colors py-0.5"
                >
                  <ShieldCheck className="w-3 h-3 text-[#B88E4B]/80" />
                  <span>{isMarathi ? 'प्रशासक पोर्टल' : 'Admin Portal'}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2 (Middle): Quick Links */}
          <div className="md:col-span-3 space-y-3 sm:pl-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D9C39E]">
              {isMarathi ? 'महत्त्वाचे दुवे' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="text-[#C4B7A6] hover:text-white transition-colors inline-block py-0.5">
                  {isMarathi ? 'आमच्याबद्दल' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/profiles" className="text-[#C4B7A6] hover:text-white transition-colors inline-block py-0.5">
                  {isMarathi ? 'सर्व स्थळे' : 'Browse Profiles'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#C4B7A6] hover:text-white transition-colors inline-block py-0.5">
                  {isMarathi ? 'संपर्क सहाय्यता' : 'Contact Support'}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#C4B7A6] hover:text-white transition-colors inline-block py-0.5">
                  {isMarathi ? 'गोपनीयता धोरण' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#C4B7A6] hover:text-white transition-colors inline-block py-0.5">
                  {isMarathi ? 'नियम व अटी' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 (Right): Service Locations & Contact */}
          <div className="md:col-span-4 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D9C39E]">
              {isMarathi ? 'कार्यक्षेत्र' : 'Service Locations'}
            </h3>
            
            <div className="space-y-1.5 text-xs text-[#C4B7A6] leading-relaxed">
              <p>Pune • Satara • Kolhapur • Sangli</p>
              <p>Solapur • Mumbai • Thane • Nashik</p>
              <p className="text-[#D9C39E]/90">Chhatrapati Sambhajinagar</p>
            </div>

            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D9C39E] hover:text-white transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 text-[#D9C39E]" />
                <span>{isMarathi ? 'संपर्क साधा →' : 'Contact Support →'}</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-[#2F2420] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#A89A89]">
          <p className="text-center sm:text-left">
            {isMarathi
              ? 'मराठा व देशमुख समाजाच्या सेवेसाठी समर्पित'
              : 'Dedicated to serving the Maratha & Deshmukh community'
            }
          </p>
          <p className="text-center sm:text-right">
            © 2026 KadamVivah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

