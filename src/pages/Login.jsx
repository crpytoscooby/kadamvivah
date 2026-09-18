import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * Login Page
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) primary accents and buttons
 * - Antique Gold (#B88E4B) badges and highlights
 * - Warm borders (#EAE0D2) & refined card
 * - Strict Marathi & English single-language support
 * - Preserved authentication logic and show/hide password toggle
 */

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading, logout, login } = useAuth();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      setError(
        isMarathi 
          ? 'आपण आधीच लॉगिन आहात. खाते बदलण्यासाठी कृपया आधी लॉग आउट करा.'
          : 'You are already logged in. Please log out first to switch accounts.'
      );
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        setError(
          isMarathi
            ? 'कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.'
            : 'Please enter both email and password'
        );
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.email)) {
        setError(
          isMarathi
            ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा.'
            : 'Please enter a valid email address'
        );
        setLoading(false);
        return;
      }

      // Call login
      const result = await login(formData.email, formData.password);

      if (result.user.mustChangePassword) {
        // Redirect to password change page
        navigate('/change-password', { state: { from: location } });
      } else {
        // Redirect to profiles page or previous location
        const from = location.state?.from?.pathname || '/profiles';
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || (isMarathi ? 'लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा.' : 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!authLoading && isAuthenticated()) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Subtle background ambient pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(#7A1526 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="w-full max-w-[450px] bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-sm relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'सध्या सक्रिय सत्र' : 'Active Session'}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#2B1B17] mb-2">
            {isMarathi ? 'आपण आधीच लॉगिन आहात' : 'Already Signed In'}
          </h2>

          <p className="text-xs sm:text-sm text-[#6B5E55] mb-6">
            {isMarathi ? (
              <>
                आपण <strong className="text-[#2B1B17]">{user?.email}</strong> ({user?.firstName || user?.first_name} {user?.lastName || user?.last_name}) म्हणून लॉगिन आहात.
              </>
            ) : (
              <>
                You are currently signed in as <strong className="text-[#2B1B17]">{user?.email}</strong> ({user?.firstName || user?.first_name} {user?.lastName || user?.last_name}).
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/my-profile')}
              className="bg-[#7A1526] hover:bg-[#8F1024] text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer text-sm"
            >
              {isMarathi ? 'माझे प्रोफाइल पहा' : 'Go to My Profile'}
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
              }}
              className="border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] font-semibold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer text-sm"
            >
              {isMarathi ? 'लॉग आउट करा' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] flex items-center justify-center px-4 py-10 sm:py-14 relative overflow-hidden">
      {/* Subtle background ambient pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(#7A1526 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      {/* Ambient warm glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#B88E4B]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[450px] relative z-10">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Eyebrow & Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                {isMarathi ? 'पुन्हा स्वागत आहे' : 'Welcome Back'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1B17] tracking-tight">
              {isMarathi ? 'सदस्य लॉगिन' : 'Member Login'}
            </h1>

            <p className="text-xs sm:text-sm text-[#6B5E55] mt-1.5 leading-relaxed">
              {isMarathi
                ? 'योग्य जीवनसाथीच्या शोधासाठी आपल्या खात्यात लॉगिन करा.'
                : 'Sign in to continue your search for a suitable life partner.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-[#FDF2F2] border border-[#F5C2C7] rounded-xl flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-[#9E1B32] flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#7A1526] font-medium leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                {isMarathi ? 'ईमेल पत्ता' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8E81]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. rahul@example.com' : 'e.g. rahul@example.com'}
                  disabled={loading}
                  className="w-full h-11 sm:h-12 pl-10 pr-4 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 disabled:bg-gray-50 transition duration-150"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                {isMarathi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8E81]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full h-11 sm:h-12 pl-10 pr-11 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 disabled:bg-gray-50 transition duration-150"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? (isMarathi ? 'पासवर्ड लपवा' : 'Hide password') : (isMarathi ? 'पासवर्ड दाखवा' : 'Show password')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E8E81] hover:text-[#2B1B17] focus:outline-none p-1 rounded transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 bg-[#7A1526] hover:bg-[#8F1024] disabled:bg-gray-400 text-white font-semibold text-sm sm:text-base rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>{isMarathi ? 'लॉगिन होत आहे...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{isMarathi ? 'लॉगिन करा' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Register Prompt */}
          <div className="mt-5 pt-4 border-t border-[#EAE0D2]/60 text-center text-xs sm:text-sm text-[#6B5E55]">
            {isMarathi ? 'कदम विवाहवर नवीन आहात? ' : 'New to KadamVivah? '}
            <Link 
              to="/register" 
              className="font-semibold text-[#7A1526] hover:text-[#8F1024] hover:underline transition-colors"
            >
              {isMarathi ? 'विनामूल्य प्रोफाइल तयार करा' : 'Create your free profile'}
            </Link>
          </div>
        </div>

        {/* Trust Line */}
        <p className="text-center text-xs sm:text-sm text-[#7A6E65] mt-5 sm:mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#B88E4B] shrink-0" />
          <span>
            {isMarathi
              ? 'मराठा व देशमुख विवाह • गोपनीयतेला प्राधान्य'
              : 'Maratha & Deshmukh Matrimony • Privacy-Focused'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
