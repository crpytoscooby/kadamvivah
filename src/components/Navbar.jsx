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
  const { t } = useTranslation('common');

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
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">KadamVivah</span>
              <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded text-sm font-devanagari font-semibold">
                कद
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              {t('about')}
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              {t('contact')}
            </Link>
            
            <LanguageToggle />

            {isAuthenticated() ? (
              <>
                <Link to="/profiles">
                  <Button variant="ghost">Profiles</Button>
                </Link>
                <Link to="/interests">
                  <Button variant="ghost" className="relative flex items-center">
                    <HeartHandshake className="w-4 h-4 mr-1.5 text-primary" />
                    Interests
                    {pendingCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full animate-pulse">
                        {pendingCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/my-profile">
                  <Button variant="ghost">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 border-l border-border pl-4 ml-2">
                  <Link to="/my-profile" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                    {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">{t('login')}</Button>
                </Link>
                <Link to="/register">
                  <Button>{t('register')}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {isAuthenticated() ? (
                <>
                  <Link
                    to="/profiles"
                    className="px-3 py-2 rounded-md hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profiles
                  </Link>
                  <Link
                    to="/interests"
                    className="px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <HeartHandshake className="w-4 h-4 mr-2 text-primary" />
                      Interests & Matches
                    </span>
                    {pendingCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/my-profile"
                    className="px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                  <div className="px-3 py-2 text-sm text-muted-foreground border-t border-border mt-2 pt-3">
                    Logged in as: {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="mx-3">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
