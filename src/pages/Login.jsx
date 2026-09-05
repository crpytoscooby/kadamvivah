import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';

/**
 * Login Page
 * 
 * Email + password only login flow.
 * Redirects to password change if mustChangePassword is true.
 */

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
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
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        setError(t('login.errBoth'));
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.email)) {
        setError(t('login.errValidEmail'));
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
      setError(err.response?.data?.message || err.message || t('login.errFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">KadamVivah</h1>
          <p className="text-muted-foreground">{t('login.subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('login.heading')}</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('login.emailPh')}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-primary-foreground font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t('login.loggingIn')}
                </>
              ) : (
                t('login.loginBtn')
              )}
            </button>
          </form>

          {/* Demo credentials (mock mode) */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm font-semibold mb-2">{t('login.demoTitle')}</p>
            <p className="text-blue-700 text-xs mb-3">{t('login.demoDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setFormData({ email: 'admin@kadamvivah.in', password: 'admin123' })
                }
                className="flex-1 text-left px-3 py-2 bg-white border border-blue-200 rounded-md hover:bg-blue-100 transition disabled:opacity-50"
              >
                <span className="block text-xs font-semibold text-blue-900">{t('login.roleAdmin')}</span>
                <span className="block text-[11px] text-blue-600">admin@kadamvivah.in</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setFormData({ email: 'test@example.com', password: 'test123' })
                }
                className="flex-1 text-left px-3 py-2 bg-white border border-blue-200 rounded-md hover:bg-blue-100 transition disabled:opacity-50"
              >
                <span className="block text-xs font-semibold text-blue-900">{t('login.roleUser')}</span>
                <span className="block text-[11px] text-blue-600">test@example.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          {t('login.footer')}
        </p>
      </div>
    </div>
  );
}
