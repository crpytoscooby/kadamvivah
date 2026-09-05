import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useToast } from '../components/Toast';
import { Upload, FileJson, AlertCircle } from 'lucide-react';

/**
 * AdminImport - bulk import profiles (mock).
 *
 * In production this screen would upload an Excel/CSV file to the backend
 * (see importController.js / tools/importExcelToMongo.js). In this mock
 * build it accepts a JSON array of profile objects and merges them into the
 * `mockProfiles` collection in localStorage.
 */

const SAMPLE = `[
  {
    "firstName": "Sneha",
    "lastName": "Kulkarni",
    "gender": "female",
    "dob": "1996-05-12",
    "city": "Nashik",
    "state": "Maharashtra",
    "education": "M.Sc. Chemistry",
    "occupation": "Research Associate"
  }
]`;

export const AdminImport = () => {
  const { t } = useTranslation();
  const { showToast, ToastContainer } = useToast();
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    setError('');

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setError(t('adminImport.errInvalid'));
      return;
    }

    if (!Array.isArray(parsed)) {
      setError(t('adminImport.errArray'));
      return;
    }
    if (parsed.length === 0) {
      setError(t('adminImport.errEmpty'));
      return;
    }

    setImporting(true);

    // Merge into existing mock profiles with generated ids/timestamps.
    const existing = JSON.parse(localStorage.getItem('mockProfiles') || '[]');
    const now = new Date().toISOString();
    const prepared = parsed.map((p, i) => ({
      id: p.id || `profile-import-${Date.now()}-${i}`,
      photos: p.photos || [],
      createdAt: p.createdAt || now,
      ...p,
    }));

    localStorage.setItem('mockProfiles', JSON.stringify([...existing, ...prepared]));

    setImporting(false);
    setRaw('');
    showToast(t('adminImport.success', { count: prepared.length }), 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ToastContainer />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Upload className="w-7 h-7 text-primary" />
          {t('adminImport.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('adminImport.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            {t('adminImport.cardTitle')}
          </CardTitle>
          <CardDescription>{t('adminImport.cardDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={SAMPLE}
            rows={14}
            className="font-mono text-xs"
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={handleImport} disabled={importing || !raw.trim()}>
              {importing ? t('adminImport.importing') : t('adminImport.importBtn')}
            </Button>
            <Button variant="outline" onClick={() => setRaw(SAMPLE)}>
              {t('adminImport.loadSample')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        {t('adminImport.note')}
      </div>
    </div>
  );
};
