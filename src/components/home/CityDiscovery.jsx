import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * CityDiscovery - Browse Profiles by Maharashtra Regional Hubs
 * Fully adapts to active Marathi or English language.
 * Preserves exact filtering URLs and equal default styling across all cities.
 */
export const CityDiscovery = () => {
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const cities = [
    {
      name: 'Pune',
      display: isMarathi ? 'पुणे' : 'Pune',
      region: isMarathi ? 'सांस्कृतिक व शैक्षणिक केंद्र' : 'Cultural & Educational Hub'
    },
    {
      name: 'Kolhapur',
      display: isMarathi ? 'कोल्हापूर' : 'Kolhapur',
      region: isMarathi ? 'ऐतिहासिक मराठा वारसा' : 'Historic Maratha Heritage'
    },
    {
      name: 'Satara',
      display: isMarathi ? 'सातारा' : 'Satara',
      region: isMarathi ? 'छत्रपतींची राजधानी' : 'Royal Capital of Chhatrapatis'
    },
    {
      name: 'Sangli',
      display: isMarathi ? 'सांगली' : 'Sangli',
      region: isMarathi ? 'पश्चिम महाराष्ट्र केंद्र' : 'Western Maharashtra Center'
    },
    {
      name: 'Solapur',
      display: isMarathi ? 'सोलापूर' : 'Solapur',
      region: isMarathi ? 'उद्योग व शिक्षण केंद्र' : 'Industrial & Commercial Hub'
    },
    {
      name: 'Mumbai',
      display: isMarathi ? 'मुंबई - ठाणे' : 'Mumbai - Thane',
      region: isMarathi ? 'महानगर परिसर' : 'Metropolitan Region'
    },
    {
      name: 'Nashik',
      display: isMarathi ? 'नाशिक' : 'Nashik',
      region: isMarathi ? 'उत्तर महाराष्ट्र केंद्र' : 'Northern Maharashtra Hub'
    },
    {
      name: 'Chhatrapati Sambhajinagar',
      display: isMarathi ? 'छत्रपती संभाजीनगर' : 'Chhatrapati Sambhajinagar',
      region: isMarathi ? 'मराठवाडा ऐतिहासिक केंद्र' : 'Marathwada Historic Center'
    }
  ];

  return (
    <section className="relative py-14 sm:py-16 bg-[#FAF7F2] border-t border-[#EAE0D2] overflow-hidden">
      {/* Subtle decorative background watermark */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#7A1526 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
            <span>{isMarathi ? 'प्रमुख शहरे व जिल्हे' : 'Cities & Districts'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#7A1526] mb-3 tracking-tight">
            {isMarathi ? (
              <span className="font-devanagari">शहरांनुसार स्थळे शोधा</span>
            ) : (
              <span>Discover Profiles by Location</span>
            )}
          </h2>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-10 bg-linear-to-r from-transparent to-[#B88E4B]" />
            <span className="text-[#B88E4B] text-xs">❖</span>
            <span className="h-px w-10 bg-linear-to-l from-transparent to-[#B88E4B]" />
          </div>

          <p className="text-xs sm:text-sm text-[#5A4A42] max-w-xl mx-auto leading-relaxed">
            {isMarathi
              ? 'महाराष्ट्रातील प्रमुख शहरांमधील मराठा व देशमुख समाजातील स्थळे शोधा.'
              : 'Explore Maratha & Deshmukh matrimonial profiles across major cities in Maharashtra.'
            }
          </p>
        </div>

        {/* Cities Grid: Desktop 4x2, Tablet 2-col, Mobile 1-col / 2-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {cities.map((city) => (
            <Link
              key={city.name}
              to={`/profiles?city=${encodeURIComponent(city.name)}`}
              className="group p-5 rounded-[18px] bg-white/95 backdrop-blur-xs border border-[#EAE0D2] shadow-2xs hover:border-[#B88E4B]/70 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] text-[#7A1526] group-hover:bg-[#7A1526] group-hover:text-white group-hover:border-[#7A1526] transition-all duration-300 flex items-center justify-center shadow-2xs">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#A89A89] group-hover:text-[#7A1526] group-hover:translate-x-1.5 transition-all duration-300" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#7A1526] group-hover:text-[#550E1B] transition-colors">
                  {city.display}
                </h3>
              </div>
              <p className="text-xs text-[#66554B] mt-3 pt-2.5 border-t border-[#EAE0D2]/80 leading-relaxed">
                {city.region}
              </p>
            </Link>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="mt-10 text-center">
          <Link
            to="/profiles"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#7A1526] hover:text-[#550E1B] group transition-colors"
          >
            <span>{isMarathi ? 'सर्व जिल्ह्यांतील प्रोफाइल पहा →' : 'Explore All Locations →'}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CityDiscovery;

