import { useState } from 'react';
import { Sparkles, Quote, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * FounderSection - Dedicated Editorial Founder Presentation for Nitin Kadam
 * Communicates community vision, personal responsibility, and trust.
 * Strictly distinct from the Chhatrapati Shivaji Maharaj Heritage section.
 */
export const FounderSection = () => {
  const [imgError, setImgError] = useState(false);
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  return (
    <section className="relative py-14 sm:py-16 bg-[#FAF7F2] border-t border-[#EAE0D2] overflow-hidden">
      {/* Subtle background ambient pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(#7A1526 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      {/* Ambient subtle glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#B88E4B]/5 blur-3xl pointer-events-none -mr-24" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-xs border border-[#EAE0D2] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (55% / 7 cols on desktop): Text & Vision */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-center lg:text-left order-1">
              
              {/* Eyebrow Badge */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
                  <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                    {isMarathi ? 'कदम विवाहची संकल्पना' : 'The Vision Behind KadamVivah'}
                  </span>
                </div>
              </div>

              {/* Founder Name & Role */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-[#7A1526] tracking-tight">
                  {isMarathi ? (
                    <span className="font-devanagari">नितीन कदम</span>
                  ) : (
                    <span>Nitin Kadam</span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-[#9E7B42] tracking-wide uppercase">
                  {isMarathi ? (
                    <span className="font-devanagari">संस्थापक — कदम विवाह</span>
                  ) : (
                    <span>Founder — KadamVivah</span>
                  )}
                </p>
              </div>

              {/* Short Gold Divider */}
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-0.5">
                <span className="h-0.5 w-12 bg-linear-to-r from-[#B88E4B] to-[#D9C39E] rounded-full" />
                <span className="text-[#B88E4B] text-xs">❖</span>
              </div>

              {/* Mobile Portrait (Shown between header and message on mobile) */}
              <div className="block lg:hidden my-2">
                <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#D9C39E] shadow-md bg-[#FAF7F2]">
                  {!imgError ? (
                    <img
                      src="/images/nitin-kadam-founder.webp"
                      alt={isMarathi ? 'नितीन कदम — संस्थापक' : 'Nitin Kadam — Founder'}
                      className="w-full h-full object-cover object-[center_top] block"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src.endsWith('.webp')) {
                          e.target.src = '/images/nitin-kadam-founder.jpg';
                        } else {
                          setImgError(true);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-linear-to-b from-[#FFFDF9] to-[#F3ECE0]">
                      <div className="w-16 h-16 rounded-full bg-[#7A1526]/10 border border-[#D9C39E] flex items-center justify-center text-[#7A1526] mb-3">
                        <User className="w-8 h-8 text-[#7A1526]" />
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#7A1526]">
                        {isMarathi ? 'नितीन कदम' : 'Nitin Kadam'}
                      </h4>
                      <p className="text-xs text-[#9E7B42]">
                        {isMarathi ? 'संस्थापक' : 'Founder'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Founder Message */}
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#4A3E39] leading-relaxed font-normal max-w-2xl">
                {isMarathi ? (
                  <span className="font-devanagari">
                    "मराठा व देशमुख समाजातील कुटुंबांना विश्वासार्ह, सुरक्षित आणि सन्मानपूर्वक विवाह व्यासपीठ उपलब्ध करून देण्याच्या संकल्पनेतून कदम विवाहची सुरुवात झाली. परंपरा, कौटुंबिक मूल्ये आणि आधुनिक तंत्रज्ञानाची सांगड घालत योग्य नाती जोडण्यासाठी हे व्यासपीठ उभारण्यात आले आहे."
                  </span>
                ) : (
                  <span>
                    "KadamVivah was founded with the vision of providing Maratha and Deshmukh families with a trusted, secure and respectful matrimonial platform. By bringing together tradition, family values and modern technology, the platform aims to help families discover meaningful relationships."
                  </span>
                )}
              </p>

              {/* Vision / Quote Line */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] text-xs font-semibold text-[#7A1526]">
                  <Quote className="w-4 h-4 text-[#B88E4B] shrink-0 rotate-180" />
                  <span className={isMarathi ? 'font-devanagari italic' : 'italic'}>
                    {isMarathi 
                      ? 'विश्वासाने जोडलेली नाती, संस्कारांनी जपलेली परंपरा.'
                      : 'Relationships built on trust, traditions carried forward with values.'
                    }
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column (45% / 5 cols on desktop): Editorial Portrait */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-center order-2">
              <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-3xl p-2 bg-linear-to-b from-[#FAF7F2] via-[#F6EFE5] to-[#EAE0D2] border-2 border-[#D9C39E] shadow-lg group">
                {/* Subtle corner flourish */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B88E4B] rounded-tl pointer-events-none z-10" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B88E4B] rounded-tr pointer-events-none z-10" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B88E4B] rounded-bl pointer-events-none z-10" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B88E4B] rounded-br pointer-events-none z-10" />

                <div className="w-full h-full rounded-2xl overflow-hidden bg-[#FAF7F2] relative flex flex-col items-center justify-center border border-[#D9C39E]">
                  {!imgError ? (
                    <img
                      src="/images/nitin-kadam-founder.webp"
                      alt={isMarathi ? 'नितीन कदम — संस्थापक' : 'Nitin Kadam — Founder'}
                      className="w-full h-full object-cover object-[center_top] block transition-all duration-500 group-hover:scale-102"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src.endsWith('.webp')) {
                          e.target.src = '/images/nitin-kadam-founder.jpg';
                        } else {
                          setImgError(true);
                        }
                      }}
                    />
                  ) : (
                    /* Clean Editorial Placeholder */
                    <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-linear-to-b from-[#FFFDF9] to-[#F3ECE0]">
                      <div className="w-20 h-20 rounded-full bg-[#7A1526]/10 border border-[#D9C39E] flex items-center justify-center text-[#7A1526] mb-4 shadow-2xs">
                        <User className="w-10 h-10 text-[#7A1526]" />
                      </div>
                      <h4 className="font-serif font-bold text-lg text-[#7A1526] mb-1">
                        {isMarathi ? 'नितीन कदम' : 'Nitin Kadam'}
                      </h4>
                      <p className="text-xs font-semibold text-[#9E7B42] uppercase tracking-wider mb-2">
                        {isMarathi ? 'संस्थापक — कदम विवाह' : 'Founder — KadamVivah'}
                      </p>
                      <p className="text-[11px] text-[#66554B] max-w-[200px] leading-relaxed">
                        {isMarathi ? 'मराठा व देशमुख विवाह व्यासपीठ' : 'Maratha & Deshmukh Matrimony'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
