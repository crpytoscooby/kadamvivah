import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Menu, X, User, LogOut, UserCog } from 'lucide-react';
import { useState } from 'react';

/**
 * Navbar - Main navigation component
 * 
 * Features:
 * - Logo with Marathi badge 'कद'
 * - Responsive mobile menu
 * - Shows Login/Register when logged out
 * - Shows user menu with profile and logout when logged in
 * - Shows admin link for admin users
 */

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>

            {isAuthenticated() ? (
              <>
                <Link to="/profiles">
                  <Button variant="ghost">Profiles</Button>
                </Link>
                {isAdmin() && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <UserCog className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2 border-l border-border pl-4 ml-2">
                  <span className="text-sm text-muted-foreground">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
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
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCog className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  <div className="px-3 py-2 text-sm text-muted-foreground border-t border-border mt-2 pt-3">
                    Logged in as: {user?.firstName} {user?.lastName}
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
