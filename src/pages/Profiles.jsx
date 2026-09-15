import { useState, useEffect } from 'react';
import { ProfileCard } from '../components/ProfileCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useToast } from '../components/Toast';
import api from '../lib/api';

/**
 * Profiles Page - Grid listing of all matrimonial profiles
 * 
 * Features:
 * - Protected route (only accessible when logged in)
 * - Filterable by gender, DOB range, city, education
 * - Pagination
 * - Responsive grid layout
 * - Empty state
 */

export const Profiles = () => {
  const { showToast, ToastContainer } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    gender: '',
    dobFrom: '',
    dobTo: '',
    city: '',
    caste: '',
    education: ''
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchProfiles();
  }, [pagination.page, filters]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const cleanParams = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (filters.gender) cleanParams.gender = filters.gender;
      if (filters.city) cleanParams.city = filters.city;
      if (filters.caste) cleanParams.caste = filters.caste;
      if (filters.education) cleanParams.education = filters.education;
      if (filters.dobFrom) cleanParams.dobFrom = filters.dobFrom;
      if (filters.dobTo) cleanParams.dobTo = filters.dobTo;

      const response = await api.get('/profiles', { params: cleanParams });
      const data = response.data?.data || {};

      setProfiles(data.profiles || []);
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total || 0,
          totalPages: data.pagination.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      showToast(error.response?.data?.message || 'Failed to load profiles', 'error');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      gender: '',
      dobFrom: '',
      dobTo: '',
      city: '',
      caste: '',
      education: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Matrimonial Profiles</h1>
          <p className="text-muted-foreground font-devanagari">प्रोफाइल पहा</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span className="font-semibold">Filter Profiles</span>
                {hasActiveFilters && (
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    Active
                  </span>
                )}
              </button>
              
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>

            {filtersOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-in slide-in-from-top">
                <div className="space-y-2">
                  <Label htmlFor="gender">Looking For (लिंग)</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={filters.gender}
                    onChange={handleFilterChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Profiles</option>
                    <option value="male">Groom (पुरुष)</option>
                    <option value="female">Bride (स्त्री)</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City / Location (शहर)</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g. Pune, Mumbai"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education (शिक्षण)</Label>
                  <Input
                    id="education"
                    name="education"
                    placeholder="e.g. B.E., MBA, MBBS"
                    value={filters.education}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caste">Caste (जात)</Label>
                  <Input
                    id="caste"
                    name="caste"
                    placeholder="e.g. Maratha, 96 Kuli"
                    value={filters.caste}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dobFrom">Date of Birth (From - To)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="dobFrom"
                      name="dobFrom"
                      type="date"
                      value={filters.dobFrom}
                      onChange={handleFilterChange}
                      title="Born on or after"
                    />
                    <Input
                      id="dobTo"
                      name="dobTo"
                      type="date"
                      value={filters.dobTo}
                      onChange={handleFilterChange}
                      title="Born on or before"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading ? (
            'Loading profiles...'
          ) : (
            <>
              Showing {profiles.length} of {pagination.total} candidate profiles
              {hasActiveFilters && ' (filtered)'}
            </>
          )}
        </div>

        {/* Profiles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : profiles.length === 0 ? (
          <Card className="py-20">
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground mb-2">No matching profiles found</p>
              <p className="text-sm text-muted-foreground mb-4 font-devanagari">
                कोणतेही प्रोफाइल आढळले नाहीत
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      return (
                        <div key={page} className="flex items-center gap-2">
                          {showEllipsis && <span className="text-muted-foreground">...</span>}
                          <Button
                            variant={page === pagination.page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
