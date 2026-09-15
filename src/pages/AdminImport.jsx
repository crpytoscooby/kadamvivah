import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../components/Toast';
import { Upload, FileSpreadsheet, ArrowLeft, CheckCircle2, AlertTriangle, Download, RefreshCw } from 'lucide-react';

export const AdminImport = () => {
  const { showToast, ToastContainer } = useToast();
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(null);

  const sampleHeaders = [
    'First Name', 'Middle Name', 'Last Name', 'Gender', 'DOB (YYYY-MM-DD)', 
    'Caste', 'Sub Caste', 'City', 'State', 'Education', 'Occupation', 
    'Annual Income', 'Phone', 'Email', 'Father Name', 'Mother Name', 'Bio'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.json') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      showToast('Please select a CSV or Excel file', 'error');
      return;
    }

    setFile(selectedFile);
    setImportSuccess(null);
    parseFile(selectedFile);
  };

  const parseFile = (file) => {
    setParsing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          const dataArray = Array.isArray(parsed) ? parsed : [parsed];
          setPreviewData(dataArray.slice(0, 10));
          showToast(`Loaded ${dataArray.length} records from JSON`, 'success');
        } else {
          // Parse CSV
          const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
          if (lines.length <= 1) {
            showToast('File contains no data rows', 'warning');
            setParsing(false);
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
          const rows = lines.slice(1).map((line, idx) => {
            const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            const rowObj = { id: `import-${Date.now()}-${idx}` };
            headers.forEach((header, i) => {
              const key = header.toLowerCase().replace(/[^a-z0-9]/g, '');
              rowObj[key] = values[i] || '';
            });
            // Normalize standard fields
            rowObj.firstName = rowObj.firstname || values[0] || '';
            rowObj.lastName = rowObj.lastname || values[2] || '';
            rowObj.gender = (rowObj.gender || values[3] || 'male').toLowerCase();
            rowObj.dob = rowObj.dob || rowObj.dobyyyymmdd || values[4] || '1995-01-01';
            rowObj.city = rowObj.city || values[7] || 'Pune';
            rowObj.education = rowObj.education || values[9] || 'Graduate';
            rowObj.occupation = rowObj.occupation || values[10] || 'Professional';
            rowObj.caste = rowObj.caste || values[5] || 'Maratha';
            rowObj.phone = rowObj.phone || values[12] || '9876543210';
            rowObj.email = rowObj.email || values[13] || `user${idx + 1}@kadamvivah.in`;
            return rowObj;
          });

          setPreviewData(rows);
          showToast(`Parsed ${rows.length} records successfully!`, 'success');
        }
      } catch (err) {
        console.error('File parsing error:', err);
        showToast('Failed to parse file: ' + err.message, 'error');
      } finally {
        setParsing(false);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      showToast('No records to import', 'warning');
      return;
    }

    setImporting(true);
    try {
      showToast('Bulk import via file upload is currently unavailable. Please register candidate accounts directly through the registration portal.', 'warning');
      setPreviewData([]);
      setFile(null);
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      sampleHeaders.join(",") + "\n" +
      "Rahul,Ram,Kadam,male,1994-05-12,Maratha,96 Kuli,Pune,Maharashtra,B.Tech Computer Science,Software Engineer,12-15 LPA,9823012345,rahul.kadam@example.com,Ram Kadam,Sunita Kadam,Looking for a cultured and educated partner.\n" +
      "Pooja,Suresh,Patil,female,1996-08-20,Maratha,Deshmukh,Mumbai,Maharashtra,MBA Finance,Financial Analyst,8-10 LPA,9823012346,pooja.patil@example.com,Suresh Patil,Meena Patil,Family oriented and ambitious.";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kadamvivah_sample_profiles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sample template downloaded', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Panel
          </Link>
          <Button variant="outline" size="sm" onClick={downloadSampleTemplate} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Sample CSV
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>Bulk Profile Import</CardTitle>
                <CardDescription>
                  Upload Excel or CSV files to quickly import multiple matrimonial profiles.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-gray-300 hover:border-primary/50 rounded-xl p-8 text-center transition-colors bg-white">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="text-base font-medium text-gray-900 mb-1">
                {file ? file.name : 'Choose a CSV or JSON file to upload'}
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: .csv, .json (max 10MB)
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".csv,.json,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Select File</span>
                </Button>
              </label>
            </div>

            {/* Success Message */}
            {importSuccess && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    Successfully imported {importSuccess.count} profiles! Total profiles in system: {importSuccess.total}
                  </span>
                </div>
                <Link to="/profiles">
                  <Button size="sm" variant="outline">View Profiles</Button>
                </Link>
              </div>
            )}

            {/* Preview Section */}
            {previewData.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Preview Data ({previewData.length} records ready)
                  </h4>
                  <Button
                    onClick={handleImport}
                    disabled={importing}
                    className="flex items-center gap-2"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm & Import All
                      </>
                    )}
                  </Button>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Gender</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">DOB</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">City</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Education</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Occupation</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {row.firstName} {row.lastName}
                          </td>
                          <td className="px-4 py-3 text-gray-600 capitalize">{row.gender}</td>
                          <td className="px-4 py-3 text-gray-600">{row.dob}</td>
                          <td className="px-4 py-3 text-gray-600">{row.city}</td>
                          <td className="px-4 py-3 text-gray-600">{row.education}</td>
                          <td className="px-4 py-3 text-gray-600">{row.occupation}</td>
                          <td className="px-4 py-3 text-gray-600">{row.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length > 10 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Showing first 10 rows of {previewData.length} total records.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
