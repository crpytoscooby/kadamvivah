import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Search, MapPin, Users, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * QuickMatchSearch - Floating Match Discovery Filter Widget
 * Connects directly to the /profiles route with existing supported query filters.
 * Fully adapts to active Marathi or English language.
 */
export const QuickMatchSearch = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const [gender, setGender] = useState('female');
  const [city, setCity] = useState('');
  const [caste, setCaste] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (gender) params.append('gender', gender);
    if (city) params.append('city', city);
    if (caste) params.append('caste', caste);
    navigate(`/profiles?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl lg:max-w-[1080px] mx-auto -mt-6 sm:-mt-8 lg:-mt-8 relative z-20 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-[#E8DCB8] shadow-2xl rounded-2xl p-4 sm:p-6 lg:p-7 transition-all duration-300">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EAE0D2]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#7A1526]/10 text-[#7A1526] shrink-0">
              <Sparkles className="w-4 h-4 text-[#B88E4B]" />
            </span>
            <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight">
              {isMarathi ? (
                <span className="font-devanagari">योग्य जोडीदार शोधा</span>
              ) : (
                <span>Quick Partner Search</span>
              )}
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#7A1526] bg-[#F8F3EA] px-3.5 py-1 rounded-full border border-[#D9C39E] self-start sm:self-auto">
            {isMarathi ? 'मराठा व देशमुख समाज' : 'Maratha & Deshmukh Community'}
          </span>
        </div>

        {/* Search Form with Exact Baseline & Height Matching */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-end">
          
          {/* 1. Looking For */}
          <div className="flex flex-col justify-end">
            <label className="h-5 flex items-center text-xs font-semibold text-[#66564B] mb-1.5">
              {isMarathi ? 'शोध / लिंग' : 'Looking For'}
            </label>
            <div className="h-11 p-1 bg-[#FAF7F2] rounded-xl border border-[#EAE0D2] grid grid-cols-2 gap-1 items-center">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`h-full text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                  gender === 'female'
                    ? 'bg-[#7A1526] text-white shadow-xs'
                    : 'text-[#4A3E39] hover:text-[#7A1526]'
                }`}
              >
                {isMarathi ? 'वधू' : 'Bride'}
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`h-full text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
                  gender === 'male'
                    ? 'bg-[#7A1526] text-white shadow-xs'
                    : 'text-[#4A3E39] hover:text-[#7A1526]'
                }`}
              >
                {isMarathi ? 'वर' : 'Groom'}
              </button>
            </div>
          </div>

          {/* 2. Location / City */}
          <div className="flex flex-col justify-end">
            <label className="h-5 flex items-center gap-1 text-xs font-semibold text-[#66564B] mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span>{isMarathi ? 'शहर' : 'City / Location'}</span>
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 w-full bg-white border border-[#EAE0D2] rounded-xl pl-3.5 pr-9 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 appearance-none cursor-pointer transition duration-150"
              >
                <option value="">{isMarathi ? 'सर्व शहरे' : 'All Locations'}</option>
                <option value="Pune">{isMarathi ? 'पुणे' : 'Pune'}</option>
                <option value="Kolhapur">{isMarathi ? 'कोल्हापूर' : 'Kolhapur'}</option>
                <option value="Satara">{isMarathi ? 'सातारा' : 'Satara'}</option>
                <option value="Sangli">{isMarathi ? 'सांगली' : 'Sangli'}</option>
                <option value="Solapur">{isMarathi ? 'सोलापूर' : 'Solapur'}</option>
                <option value="Mumbai">{isMarathi ? 'मुंबई' : 'Mumbai'}</option>
                <option value="Thane">{isMarathi ? 'ठाणे' : 'Thane'}</option>
                <option value="Nashik">{isMarathi ? 'नाशिक' : 'Nashik'}</option>
                <option value="Chhatrapati Sambhajinagar">{isMarathi ? 'छत्रपती संभाजीनगर' : 'Chhatrapati Sambhajinagar'}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 3. Caste / Community */}
          <div className="flex flex-col justify-end">
            <label className="h-5 flex items-center gap-1 text-xs font-semibold text-[#66564B] mb-1.5">
              <Users className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span>{isMarathi ? 'समाज' : 'Community'}</span>
            </label>
            <div className="relative">
              <select
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                className="h-11 w-full bg-white border border-[#EAE0D2] rounded-xl pl-3.5 pr-9 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 appearance-none cursor-pointer transition duration-150"
              >
                <option value="">{isMarathi ? 'सर्व (मराठा व देशमुख)' : 'All (Maratha & Deshmukh)'}</option>
                <option value="Maratha">{isMarathi ? 'मराठा' : 'Maratha'}</option>
                <option value="Deshmukh">{isMarathi ? 'देशमुख' : 'Deshmukh'}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 4. Search Action Button */}
          <div className="flex flex-col justify-end">
            <label className="hidden lg:flex h-5 items-center text-xs font-semibold text-transparent select-none mb-1.5 pointer-events-none" aria-hidden="true">
              Action
            </label>
            <Button
              type="submit"
              className="h-11 w-full bg-[#7A1526] hover:bg-[#600F1E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm rounded-xl border border-[#962638]"
            >
              <Search className="w-4 h-4" />
              <span>{isMarathi ? 'जोडीदार शोधा' : 'Find Matches'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickMatchSearch;
