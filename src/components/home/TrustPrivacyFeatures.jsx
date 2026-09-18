import { ShieldCheck, HeartHandshake, Lock, UserCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * TrustPrivacyFeatures - Authentic Trust, Safety & Community Pillars + How It Works Flow
 * Strict compliance: Factual descriptions, no fake stats/counts or verification claims.
 * Fully adapts to active Marathi or English language.
 */
export const TrustPrivacyFeatures = () => {
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const pillars = [
    {
      icon: HeartHandshake,
      title: isMarathi ? 'विनामूल्य विवाह सेवा' : 'Free Matrimonial Service',
      desc: isMarathi
        ? 'नोंदणीसाठी कोणतेही शुल्क नाही. योग्य जीवनसाथीच्या शोधासाठी सहज आणि सुलभ व्यासपीठ.'
        : 'No registration fee. A simple and accessible platform for finding a suitable life partner.'
    },
    {
      icon: UserCheck,
      title: isMarathi ? 'प्रशासकीय मंजूर प्रोफाइल' : 'Admin-Approved Profiles',
      desc: isMarathi
        ? 'विवाह स्थळांची माहिती प्रकाशित होण्यापूर्वी प्रशासकीय पुनरावलोकनातून जाते.'
        : 'Profile information is reviewed administratively before being published on the platform.'
    },
    {
      icon: Lock,
      title: isMarathi ? 'संपर्क व फोटो गोपनीयता' : 'Contact & Photo Privacy',
      desc: isMarathi
        ? 'वैयक्तिक संपर्क माहिती आणि सदस्यांची माहिती गोपनीयतेचा विचार करून हाताळली जाते.'
        : 'Personal contact details and member information are handled with privacy in mind.'
    },
    {
      icon: ShieldCheck,
      title: isMarathi ? 'मराठा व देशमुख समाज' : 'Maratha & Deshmukh Community',
      desc: isMarathi
        ? 'मराठा व देशमुख समाजातील विवाह इच्छुक कुटुंबांसाठी संस्कृती आणि परंपरेशी जोडलेले व्यासपीठ.'
        : 'A community-focused matrimonial platform designed around Maratha & Deshmukh traditions and family values.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: isMarathi ? 'मोफत प्रोफाइल तयार करा' : 'Create Your Free Profile',
      desc: isMarathi
        ? 'उमेदवाराची मूलभूत माहिती, शिक्षण, व्यवसाय व कौटुंबिक पार्श्वभूमी प्रविष्ट करा.'
        : 'Enter basic candidate biodata, education, occupation, and family background.'
    },
    {
      step: '02',
      title: isMarathi ? 'योग्य स्थळे शोधा' : 'Discover Suitable Matches',
      desc: isMarathi
        ? 'शिक्षण, शहर आणि कुटुंब तपशीलानुसार प्रशासकीय मंजूर स्थळे शोधा.'
        : 'Browse admin-approved candidates filtered by education, city, and family background.'
    },
    {
      step: '03',
      title: isMarathi ? 'पसंती पाठवा व संपर्क साधा' : 'Send Interest & Connect',
      desc: isMarathi
        ? 'पसंती दर्शवा आणि दोन्ही कुटुंबांची परस्पर सहमती झाल्यावर थेट संपर्क मिळवा.'
        : 'Express interest and unlock direct family contact details upon mutual acceptance.'
    }
  ];

  return (
    <div>
      {/* 4 Pillars Features Section: Why Families Choose KadamVivah */}
      <section className="relative py-12 sm:py-14 bg-[#FDFBF7] border-t border-[#EAE0D2] overflow-hidden">
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
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-9">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
              <span>{isMarathi ? 'विश्वासार्हता व सुरक्षितता' : 'Trust & Safety'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#7A1526] mb-3 tracking-tight">
              {isMarathi ? (
                <span className="font-devanagari">कदम विवाहची वैशिष्ट्ये</span>
              ) : (
                <span>Why Families Choose KadamVivah</span>
              )}
            </h2>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-px w-10 bg-linear-to-r from-transparent to-[#B88E4B]" />
              <span className="text-[#B88E4B] text-xs">❖</span>
              <span className="h-px w-10 bg-linear-to-l from-transparent to-[#B88E4B]" />
            </div>

            <p className="text-xs sm:text-sm text-[#5A4A42] leading-relaxed max-w-xl mx-auto">
              {isMarathi 
                ? 'मराठा व देशमुख कुटुंबांसाठी विश्वासार्ह, सुरक्षित आणि सुलभ विवाह व्यासपीठ.'
                : 'A trusted, secure and simple matrimonial platform for Maratha & Deshmukh families.'
              }
            </p>
          </div>

          {/* 4 Feature Cards Grid: Compact, balanced heights, tight natural grouping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {pillars.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-[#EAE0D2] shadow-2xs hover:border-[#D4B896] hover:shadow-xs transition-all duration-200 flex flex-col h-full"
                >
                  {/* Top gold accent line */}
                  <div className="h-0.5 w-6 bg-gradient-to-r from-[#B88E4B] to-[#D9C39E] rounded-full mb-3.5 group-hover:w-10 transition-all duration-200" />

                  {/* Icon container */}
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9C39E] flex items-center justify-center text-[#7A1526] mb-3 shrink-0 shadow-2xs group-hover:bg-[#7A1526] group-hover:text-[#FDFBF7] group-hover:border-[#7A1526] transition-all duration-200">
                    <IconComponent className="w-5 h-5 text-current" />
                  </div>

                  {/* Content Block: Naturally grouped title & description without empty gap */}
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-serif font-bold text-[15px] sm:text-base text-[#7A1526] leading-snug min-h-[42px] flex items-start">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#5A4D45] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works - 3 Step Flow: Seamless ivory transition */}
      <section className="relative py-14 sm:py-16 bg-[#FAF7F2] border-t border-[#EAE0D2] overflow-hidden">
        {/* Subtle background texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#7A1526 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/95 border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
              <span>{isMarathi ? 'सोपी कार्यपद्धती' : 'Simple Process'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#7A1526] mb-3 tracking-tight">
              {isMarathi ? (
                <span className="font-devanagari">कदम विवाह कसे कार्य करते?</span>
              ) : (
                <span>How KadamVivah Works</span>
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
                ? 'योग्य जोडीदार शोधण्याची तीन सोपी आणि सुरक्षित पावले.'
                : 'Three simple, dignified steps to find your ideal life partner.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 relative">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#EAE0D2] relative hover:border-[#B88E4B]/70 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-2xs"
              >
                <span className="text-4xl font-black text-[#B88E4B]/30 font-serif absolute top-4 right-5 select-none pointer-events-none">
                  {item.step}
                </span>
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#7A1526] text-white flex items-center justify-center text-xs font-bold mb-4 shadow-xs">
                    {idx + 1}
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#7A1526] mb-2">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-[#66554B] leading-relaxed mt-2 pt-2 border-t border-[#EAE0D2]/80">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustPrivacyFeatures;

