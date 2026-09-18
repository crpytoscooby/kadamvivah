import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProfileCard } from '../components/ProfileCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Search, 
  Lock, 
  Users, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useToast } from '../components/Toast';
import api from '../lib/api';

/**
 * Profiles Page - Grid listing of all matrimonial profiles
 * 
 * Features:
 * - Protected route (only accessible when logged in)
 * - Filterable by gender, city, caste, education, DOB range
 * - Accepts query parameters from homepage quick match & city discovery cards
 * - Pagination & Real API data
 * - Responsive grid layout (4 cols desktop, 2-3 tablet, 1 mobile)
 * - Premium Marathi matrimonial visual styling
 * - Factual count display with zero fake profiles or statistics
 */

export const Profiles = () => {
  const { showToast, ToastContainer } = useToast();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const initialGender = searchParams.get('gender') || '';
  const initialCity = searchParams.get('city') || '';
  const initialCaste = searchParams.get('caste') || '';
  const initialEducation = searchParams.get('education') || '';
  const initialDobFrom = searchParams.get('dobFrom') || '';
  const initialDobTo = searchParams.get('dobTo') || '';

  const [filtersOpen, setFiltersOpen] = useState(
    Boolean(initialGender || initialCity || initialCaste || initialEducation || initialDobFrom || initialDobTo)
  );
  
  const [filters, setFilters] = useState({
    gender: initialGender,
    dobFrom: initialDobFrom,
    dobTo: initialDobTo,
    city: initialCity,
    caste: initialCaste,
    education: initialEducation
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Sync state if URL query params change (e.g. user navigates from city cards or search)
  useEffect(() => {
    const gender = searchParams.get('gender') || '';
    const city = searchParams.get('city') || '';
    const caste = searchParams.get('caste') || '';
    const education = searchParams.get('education') || '';
    const dobFrom = searchParams.get('dobFrom') || '';
    const dobTo = searchParams.get('dobTo') || '';

    setFilters({
      gender,
      city,
      caste,
      education,
      dobFrom,
      dobTo
    });

    if (gender || city || caste || education || dobFrom || dobTo) {
      setFiltersOpen(true);
    }
  }, [searchParams]);

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
      showToast(error.response?.data?.message || (isMarathi ? 'स्थळे लोड करण्यात अयशस्वी' : 'Failed to load profiles'), 'error');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#241C1A] py-8 sm:py-12">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. PROFILES PAGE INTRO (Compact Header) */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EAE0D2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-2.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                {isMarathi ? 'मराठा व देशमुख विवाह' : 'Maratha & Deshmukh Matrimony'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#7A1526] tracking-tight">
              {isMarathi ? (
                <span className="font-devanagari">योग्य स्थळे शोधा</span>
              ) : (
                <span>Discover Matrimonial Profiles</span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-[#5A4D45] mt-1.5 max-w-2xl leading-relaxed">
              {isMarathi ? (
                <span className="font-devanagari">
                  मराठा व देशमुख समाजातील मंजूर वधू-वर स्थळे पाहा आणि योग्य जीवनसाथीचा शोध घ्या.
                </span>
              ) : (
                <span>
                  Explore approved matrimonial profiles and find a suitable life partner within the Maratha & Deshmukh community.
                </span>
              )}
            </p>
          </div>

          {/* Quick Filter Toggle Button on Header */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7A1526] bg-white px-4 py-2 rounded-full border border-[#D9C39E] shadow-2xs hover:bg-[#FAF7F2] hover:border-[#B88E4B] transition-all self-center sm:self-auto shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B88E4B]" />
            <span>{isMarathi ? 'फिल्टर / शोध निकष' : 'Filter Profiles'}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#7A1526]" />
            )}
          </button>
        </div>

        {/* 2. SEARCH / FILTER PANEL */}
        <div className="mb-8 bg-white/95 backdrop-blur-xs border border-[#D9C39E] rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE0D2]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#7A1526]/10 text-[#7A1526] shrink-0">
                <Filter className="w-4 h-4 text-[#B88E4B]" />
              </span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#7A1526]">
                {isMarathi ? 'शोध निकष निवडा' : 'Refine Search Criteria'}
              </h3>
              {hasActiveFilters && (
                <span className="px-2.5 py-0.5 bg-[#FAF7F2] border border-[#D9C39E] text-[#7A1526] text-[11px] font-bold rounded-full">
                  {isMarathi ? 'सक्रिय फिल्टर्स' : 'Active'}
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A1526] hover:text-[#550E1B] self-start sm:self-auto py-1 px-2.5 rounded-lg hover:bg-[#FAF7F2] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#B88E4B]" />
                <span>{isMarathi ? 'सर्व फिल्टर्स रीसेट करा' : 'Clear All Filters'}</span>
              </button>
            )}
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            
            {/* 1. Looking For / Gender */}
            <div className="space-y-1.5">
              <label htmlFor="gender" className="block text-xs font-semibold text-[#66564B]">
                {isMarathi ? 'शोध / लिंग' : 'Looking For'}
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={filters.gender}
                  onChange={handleFilterChange}
                  className="h-11 w-full bg-white border border-[#EAE0D2] rounded-xl pl-3.5 pr-9 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 appearance-none cursor-pointer transition duration-150"
                >
                  <option value="">{isMarathi ? 'सर्व स्थळे (वधू व वर)' : 'All Profiles (Brides & Grooms)'}</option>
                  <option value="female">{isMarathi ? 'वधू (Bride)' : 'Bride'}</option>
                  <option value="male">{isMarathi ? 'वर (Groom)' : 'Groom'}</option>
                  <option value="other">{isMarathi ? 'इतर' : 'Other'}</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* 2. City / Location */}
            <div className="space-y-1.5">
              <label htmlFor="city" className="block text-xs font-semibold text-[#66564B]">
                {isMarathi ? 'शहर / जिल्हा' : 'City / Location'}
              </label>
              <Input
                id="city"
                name="city"
                placeholder={isMarathi ? 'उदा. पुणे, सातारा, मुंबई' : 'e.g. Pune, Satara, Mumbai'}
                value={filters.city}
                onChange={handleFilterChange}
                className="h-11 bg-white border-[#EAE0D2] rounded-xl text-xs sm:text-sm font-medium focus:ring-[#7A1526]"
              />
            </div>

            {/* 3. Education */}
            <div className="space-y-1.5">
              <label htmlFor="education" className="block text-xs font-semibold text-[#66564B]">
                {isMarathi ? 'शिक्षण' : 'Education'}
              </label>
              <Input
                id="education"
                name="education"
                placeholder={isMarathi ? 'उदा. B.E., MBA, MBBS' : 'e.g. B.E., MBA, MBBS'}
                value={filters.education}
                onChange={handleFilterChange}
                className="h-11 bg-white border-[#EAE0D2] rounded-xl text-xs sm:text-sm font-medium focus:ring-[#7A1526]"
              />
            </div>

            {/* 4. Caste / Community */}
            <div className="space-y-1.5">
              <label htmlFor="caste" className="block text-xs font-semibold text-[#66564B]">
                {isMarathi ? 'समाज / जात' : 'Community / Caste'}
              </label>
              <Input
                id="caste"
                name="caste"
                placeholder={isMarathi ? 'उदा. मराठा / देशमुख' : 'e.g. Maratha / Deshmukh'}
                value={filters.caste}
                onChange={handleFilterChange}
                className="h-11 bg-white border-[#EAE0D2] rounded-xl text-xs sm:text-sm font-medium focus:ring-[#7A1526]"
              />
            </div>

            {/* 5. Date of Birth Range (Span 2 cols on lg) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="dobFrom" className="block text-xs font-semibold text-[#66564B]">
                {isMarathi ? 'जन्मतारीख मर्यादा (या तारखेपासून - या तारखेपर्यंत)' : 'Date of Birth Range (From - To)'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="dobFrom"
                  name="dobFrom"
                  type="date"
                  value={filters.dobFrom}
                  onChange={handleFilterChange}
                  title={isMarathi ? 'या तारखेपासून' : 'Born on or after'}
                  className="h-11 bg-white border-[#EAE0D2] rounded-xl text-xs sm:text-sm font-medium focus:ring-[#7A1526]"
                />
                <Input
                  id="dobTo"
                  name="dobTo"
                  type="date"
                  value={filters.dobTo}
                  onChange={handleFilterChange}
                  title={isMarathi ? 'या तारखेपर्यंत' : 'Born on or before'}
                  className="h-11 bg-white border-[#EAE0D2] rounded-xl text-xs sm:text-sm font-medium focus:ring-[#7A1526]"
                />
              </div>
            </div>

            {/* Quick Action Info / Reset Button on bottom row */}
            <div className="sm:col-span-2 flex items-end justify-end pt-1">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="h-11 px-5 rounded-xl border-[#D9C39E] text-[#7A1526] hover:bg-[#FAF7F2] text-xs font-bold w-full sm:w-auto"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    <span>{isMarathi ? 'फिल्टर्स काढा' : 'Reset Filters'}</span>
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={fetchProfiles}
                  className="h-11 px-6 rounded-xl bg-[#7A1526] hover:bg-[#600F1E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border border-[#962638] w-full sm:w-auto"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isMarathi ? 'शोध लागू करा' : 'Apply Search'}</span>
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. RESULTS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-2 border-b border-[#EAE0D2]">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-[#7A1526]">
              {isMarathi ? 'उपलब्ध स्थळे' : 'Available Profiles'}
            </h2>
            <span className="text-xs text-[#66554B]">
              {!loading && (
                <span>
                  ({isMarathi 
                    ? `${pagination.total} पैकी ${profiles.length} स्थळे प्रदर्शित` 
                    : `Showing ${profiles.length} of ${pagination.total} candidate profiles`
                  })
                </span>
              )}
            </span>
          </div>

          <div className="text-xs text-[#9E7B42] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#B88E4B]" />
            <span>{isMarathi ? 'प्रशासकीय मंजूर स्थळे' : 'Admin-Approved Candidates'}</span>
          </div>
        </div>

        {/* 4. PROFILES GRID / EMPTY STATE / LOADING */}
        {loading ? (
          <div className="text-center py-20 bg-white/60 rounded-3xl border border-[#EAE0D2] my-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7A1526] mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-[#5A4D45] font-medium">
              {isMarathi ? 'मंजूर स्थळे लोड होत आहेत...' : 'Loading approved profiles...'}
            </p>
          </div>
        ) : profiles.length === 0 ? (
          /* 5. EMPTY RESULTS STATE */
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-[#EAE0D2] p-6 sm:p-8 max-w-xl mx-auto shadow-xs my-4 space-y-4">
            <div className="w-14 h-14 bg-[#FAF7F2] border border-[#D9C39E] rounded-2xl flex items-center justify-center mx-auto text-[#7A1526] shadow-2xs">
              <Users className="w-7 h-7 text-[#7A1526]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-[#7A1526] font-serif">
                {isMarathi 
                  ? 'तुमच्या शोधानुसार सध्या कोणतेही स्थळ उपलब्ध नाही.'
                  : 'No profiles match your current search.'
                }
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4D45] max-w-md mx-auto leading-relaxed">
                {isMarathi
                  ? 'शोध निकष बदला किंवा सर्व मंजूर स्थळे पाहण्यासाठी फिल्टर्स रीसेट करा.'
                  : 'Try adjusting your filters or explore all approved profiles across Maharashtra.'
                }
              </p>
            </div>

            {hasActiveFilters && (
              <div className="pt-2">
                <Button 
                  onClick={clearFilters} 
                  className="h-10 px-6 rounded-full bg-[#7A1526] hover:bg-[#600F1E] text-white text-xs sm:text-sm font-bold shadow-sm border border-[#962638]"
                >
                  {isMarathi ? 'सर्व स्थळे पहा' : 'View All Profiles'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* 4 Cards per row on desktop (lg), 2-3 on tablet (sm/md), 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mb-10 items-stretch">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* 6. PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 py-4 mb-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="h-10 px-4 rounded-xl border-[#D9C39E] text-[#7A1526] hover:bg-white text-xs font-bold disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>{isMarathi ? 'मागील' : 'Previous'}</span>
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      return (
                        <div key={page} className="flex items-center gap-1.5">
                          {showEllipsis && <span className="text-xs text-[#9E7B42] px-1">...</span>}
                          <button
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                              page === pagination.page
                                ? 'bg-[#7A1526] text-white shadow-sm border border-[#7A1526]'
                                : 'bg-white border border-[#EAE0D2] text-[#5A4D45] hover:border-[#B88E4B] hover:text-[#7A1526]'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="h-10 px-4 rounded-xl border-[#D9C39E] text-[#7A1526] hover:bg-white text-xs font-bold disabled:opacity-40"
                >
                  <span>{isMarathi ? 'पुढील' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* 7. PRIVACY & COMMUNITY TRUST DETAIL */}
        <div className="mt-8 pt-6 border-t border-[#EAE0D2] text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#7A6B63] font-medium bg-white/70 px-4 py-1.5 rounded-full border border-[#EAE0D2]">
            <Lock className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span>
              {isMarathi
                ? 'सदस्यांची माहिती गोपनीयतेचा विचार करून प्रदर्शित केली जाते.'
                : 'Member information is displayed with privacy in mind.'
              }
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profiles;
