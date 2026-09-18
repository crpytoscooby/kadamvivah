import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Menu, X, User, LogOut, HeartHandshake } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';
import api from '../lib/api';

/**
 * Navbar - Main navigation component
 * 
 * Features:
 * - Logo with Marathi badge 'कद'
 * - Responsive mobile menu
 * - Shows Login/Register when logged out
 * - Shows user menu with profile, interests, and logout when logged in
 * - Shows pending interests badge for quick notifications
 */

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  // Fetch pending received count for notification badge
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated()) {
      api.get('/interests/counts')
        .then((res) => {
          if (isMounted) {
            setPendingCount(res.data?.data?.pending_received || 0);
          }
        })
        .catch(() => {
          // Ignore count error silently
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated(), location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#FAF7F2] border-b border-[#EAE0D2] sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo with 'कदम' Pill Crest */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 px-3.5 min-w-[52px] rounded-full bg-gradient-to-br from-[#7A1526] to-[#550E1B] text-white flex items-center justify-center border-2 border-[#D9C39E] shadow-sm">
              <span className="text-sm font-black font-devanagari tracking-wider text-white">कदम</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#7A1526] font-serif group-hover:text-[#550E1B] transition-colors">
                KadamVivah
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#9E7B42] font-devanagari -mt-1 tracking-wider">
                {isMarathi ? 'मराठा व देशमुख विवाह' : 'Maratha & Deshmukh Matrimony'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm transition-colors ${
                location.pathname === '/'
                  ? 'text-[#7A1526] font-bold border-b-2 border-[#7A1526] pb-1'
                  : 'font-medium text-foreground hover:text-[#7A1526]'
              }`}
            >
              {isMarathi ? 'मुख्यपृष्ठ' : 'Home'}
            </Link>
            <Link
              to="/about"
              className={`text-sm transition-colors ${
                location.pathname === '/about'
                  ? 'text-[#7A1526] font-bold border-b-2 border-[#7A1526] pb-1'
                  : 'font-medium text-foreground hover:text-[#7A1526]'
              }`}
            >
              {isMarathi ? 'आमच्याबद्दल' : 'About Us'}
            </Link>
            <Link
              to="/contact"
              className={`text-sm transition-colors ${
                location.pathname === '/contact'
                  ? 'text-[#7A1526] font-bold border-b-2 border-[#7A1526] pb-1'
                  : 'font-medium text-foreground hover:text-[#7A1526]'
              }`}
            >
              {isMarathi ? 'संपर्क' : 'Contact'}
            </Link>
            
            <LanguageToggle />

            {isAuthenticated() ? (
              <>
                <Link to="/profiles">
                  <Button variant="ghost" className="text-sm font-medium hover:text-[#7A1526] hover:bg-[#F8F3EA] rounded-full">
                    {isMarathi ? 'सर्व स्थळे' : 'Profiles'}
                  </Button>
                </Link>
                <Link to="/interests">
                  <Button variant="ghost" className="relative flex items-center text-sm font-medium hover:text-[#7A1526] hover:bg-[#F8F3EA] rounded-full">
                    <HeartHandshake className="w-4 h-4 mr-1.5 text-[#7A1526]" />
                    {isMarathi ? 'पसंती व स्थळे' : 'Interests'}
                    {pendingCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold bg-[#7A1526] text-white rounded-full animate-pulse">
                        {pendingCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/my-profile">
                  <Button variant="ghost" className="text-sm font-medium hover:text-[#7A1526] hover:bg-[#F8F3EA] rounded-full">
                    <User className="w-4 h-4 mr-1.5 text-[#B88E4B]" />
                    {isMarathi ? 'माझे प्रोफाइल' : 'My Profile'}
                  </Button>
                </Link>
                <div className="flex items-center space-x-3 border-l border-[#EAE0D2] pl-4 ml-1">
                  <Link to="/my-profile" className="text-xs text-muted-foreground hover:text-[#7A1526] transition-colors font-medium">
                    {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="border-[#EAE0D2] text-xs h-8 rounded-full">
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                    {isMarathi ? 'बाहेर पडा' : 'Logout'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" className="rounded-full border-[#D9C39E] text-[#7A1526] hover:bg-white text-sm h-9 px-5 font-semibold">
                    {isMarathi ? 'लॉगिन' : 'Login'}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-full bg-[#7A1526] hover:bg-[#600F1E] text-white text-sm h-9 px-6 font-semibold shadow-xs border border-[#962638]">
                    {isMarathi ? 'विनामूल्य नोंदणी' : 'Register Free'}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Bar: Language Toggle + Menu Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              className="p-2 rounded-lg hover:bg-[#FAF7F2] text-foreground border border-[#EAE0D2]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#7A1526]" /> : <Menu className="w-6 h-6 text-[#7A1526]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#EAE0D2] bg-white">
            <div className="flex flex-col space-y-2.5">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FAF7F2] text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isMarathi ? 'मुख्यपृष्ठ' : 'Home'}
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FAF7F2] text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isMarathi ? 'आमच्याबद्दल' : 'About Us'}
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FAF7F2] text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isMarathi ? 'संपर्क' : 'Contact'}
              </Link>

              {isAuthenticated() ? (
                <>
                  <Link
                    to="/profiles"
                    className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FAF7F2] text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isMarathi ? 'सर्व स्थळे' : 'Profiles'}
                  </Link>
                  <Link
                    to="/interests"
                    className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FAF7F2] text-foreground transition-colors flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <HeartHandshake className="w-4 h-4 mr-2 text-[#7A1526]" />
                      {isMarathi ? 'पसंती व स्थळे' : 'Interests'}
                    </span>
                    {pendingCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#7A1526] text-white rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/my-profile"
                    className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#FAF7F2] text-foreground transition-colors flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2 text-[#B88E4B]" />
                    {isMarathi ? 'माझे प्रोफाइल' : 'My Profile'}
                  </Link>
                  <div className="px-3 py-2 text-xs text-muted-foreground border-t border-[#EAE0D2] mt-2 pt-3">
                    {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="mx-3 text-xs border-[#EAE0D2] text-[#7A1526]">
                    <LogOut className="w-4 h-4 mr-2" />
                    {isMarathi ? 'बाहेर पडा' : 'Logout'}
                  </Button>
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-2 px-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-[#D9C39E] text-[#7A1526] text-sm h-10">
                      {isMarathi ? 'लॉगिन' : 'Login'}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#7A1526] hover:bg-[#600F1E] text-white text-sm h-10">
                      {isMarathi ? 'विनामूल्य नोंदणी करा' : 'Register Free'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
