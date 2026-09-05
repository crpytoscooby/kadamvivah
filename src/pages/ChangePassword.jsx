import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Lock, AlertCircle, Loader } from 'lucide-react';

/**
 * ChangePassword Page
 *
 * Used both for the forced first-login password change (mustChangePassword)
 * and as a normal "update password" screen for signed-in users.
 */
export const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { changePassword, mustChangePassword } = useAuth();

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError(t('changePassword.errAll'));
      return;
    }
    if (form.newPassword.length < 6) {
      setError(t('changePassword.errLen'));
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError(t('changePassword.errMatch'));
      return;
    }

    setLoading(true);
    try {
      await changePassword(form.oldPassword, form.newPassword, form.confirmPassword);
      navigate('/profiles');
    } catch (err) {
      setError(err.message || t('changePassword.errFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              {t('changePassword.title')}
            </CardTitle>
            <CardDescription>
              {mustChangePassword
                ? t('changePassword.descForced')
                : t('changePassword.descNormal')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="oldPassword">{t('changePassword.current')}</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('changePassword.new')}</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('changePassword.confirm')}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {t('changePassword.submitting')}
                  </>
                ) : (
                  t('changePassword.submit')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
