import { useState } from 'react';
import { Shield, Sparkles, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * ShivajiMaharajHeritage - Dedicated Cultural Heritage Section
 * Honoring Chhatrapati Shivaji Maharaj with dignity, Maratha heritage, and sacred family values.
 */
export const ShivajiMaharajHeritage = () => {
  const [imgError, setImgError] = useState(false);
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF7F2] via-[#F7F0E6] to-[#FAF7F2] border-y border-[#EAE0D2] relative overflow-hidden">
      {/* Clean Vector Background Art: Maratha Fort Ramparts & Saffron Flag (Subtle ambient) */}
      <div className="absolute right-0 bottom-0 w-72 sm:w-96 lg:w-[460px] pointer-events-none select-none opacity-[0.05] lg:opacity-[0.07] text-[#7A1526] z-0 overflow-hidden">
        <svg viewBox="0 0 600 350" fill="currentColor" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 350 L0 260 Q80 250 160 210 Q240 170 320 180 Q400 190 480 140 Q540 100 600 120 L600 350 Z" opacity="0.4" />
          <path d="M40 350 L40 230 L55 230 L55 238 L65 238 L65 230 L80 230 L80 238 L90 238 L90 230 L105 230 L105 238 L115 238 L115 230 L140 230 L140 350 Z" />
          <path d="M130 350 L130 190 L145 190 L145 198 L155 198 L155 190 L170 190 L170 198 L180 198 L180 190 L200 190 L200 350 Z" />
          <path d="M240 350 L240 160 L255 160 L255 168 L265 168 L265 160 L280 160 L280 168 L290 168 L290 160 L310 160 L310 350 Z" />
          <path d="M300 350 L300 110 L315 110 L315 118 L325 118 L325 110 L340 110 L340 118 L350 118 L350 110 L370 110 L370 350 Z" />
          <line x1="335" y1="110" x2="335" y2="40" stroke="#B88E4B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="335" cy="38" r="3" fill="#B88E4B" />
          <path d="M336 42 L395 58 L365 72 L400 86 L336 100 Z" fill="#E85A0C" opacity="0.9" />
          <path d="M360 350 L360 140 L375 140 L375 148 L385 148 L385 140 L400 140 L400 350 Z" />
        </svg>
      </div>

      {/* Ambient Warm Highlights */}
      <div className="absolute top-0 left-0 -ml-24 -mt-24 w-96 h-96 rounded-full bg-[#B88E4B]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mr-24 -mb-24 w-96 h-96 rounded-full bg-[#7A1526]/5 blur-3xl pointer-events-none" />

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#7A1526_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Mobile-Only Header Block (Order: Eyebrow -> Main Heading -> Value line -> Portrait) */}
        <div className="block lg:hidden text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/95 backdrop-blur-xs border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'मराठी संस्कृती व परंपरा' : 'Marathi Heritage & Tradition'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#7A1526] tracking-tight">
            {isMarathi ? (
              <span className="font-devanagari">छत्रपती शिवाजी महाराज</span>
            ) : (
              <span>Chhatrapati Shivaji Maharaj</span>
            )}
          </h2>
          <p className="text-sm font-bold text-[#9E7B42]">
            {isMarathi ? 'संस्कार • स्वाभिमान • परंपरा' : 'Values • Self-Respect • Tradition'}
          </p>
        </div>

        {/* Master Heritage Card Composition */}
        <div className="bg-white/90 backdrop-blur-xs border border-[#D9C39E] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Dignified Portrait / Arch Frame (5 cols on desktop) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] aspect-[4/5] rounded-t-[140px] rounded-b-[24px] p-2 bg-gradient-to-b from-[#FAF7F2] via-[#F6EFE5] to-[#EAE0D2] border-[3px] border-[#B88E4B] shadow-xl overflow-hidden">
                <div className="w-full h-full rounded-t-[130px] rounded-b-[18px] overflow-hidden bg-[#4A2A14] relative flex flex-col items-center justify-center border border-[#D9C39E]">
                  {!imgError ? (
                    <img
                      src="/images/shivaji-maharaj.png"
                      alt={isMarathi ? "छत्रपती शिवाजी महाराज" : "Chhatrapati Shivaji Maharaj"}
                      className="w-full h-full object-cover object-[center_top] block"
                      style={{ opacity: 1, filter: 'none' }}
                      loading="eager"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    /* Dignified Cultural Heritage Placeholder */
                    <div className="w-full h-full p-6 flex flex-col items-center justify-between text-center relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F3ECE0]">
                      {/* Top Crest */}
                      <div className="pt-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7A1526] to-[#550E1B] text-white flex items-center justify-center mx-auto border-2 border-[#D9C39E] shadow-md">
                          <Shield className="w-8 h-8 text-[#D9C39E]" />
                        </div>
                        <span className="inline-block mt-3 px-3 py-0.5 bg-[#FAF7F2] border border-[#D9C39E] rounded-full text-[11px] font-bold text-[#7A1526]">
                          {isMarathi ? 'पावन स्मृती व प्रेरणास्थान' : 'Sacred Heritage'}
                        </span>
                      </div>

                      {/* Center Title */}
                      <div className="space-y-1.5 py-2">
                        <h3 className="text-xl sm:text-2xl font-black text-[#7A1526] font-serif">
                          {isMarathi ? 'छत्रपती शिवाजी महाराज' : 'Chhatrapati Shivaji Maharaj'}
                        </h3>
                        <p className="text-xs font-semibold text-[#9E7B42]">
                          {isMarathi ? 'संस्कार • स्वाभिमान • परंपरा' : 'Heritage • Honour • Tradition'}
                        </p>
                        <p className="text-[11px] text-[#5A4D45] max-w-[220px] mx-auto leading-relaxed pt-1">
                          {isMarathi
                            ? 'मराठा व देशमुख समाजाचे अखंड प्रेरणास्थान'
                            : 'Eternal inspiration for the Maratha & Deshmukh community.'}
                        </p>
                      </div>

                      {/* Bottom Note */}
                      <div className="pb-2">
                        <span className="text-[10px] font-semibold text-[#B88E4B] tracking-wider uppercase">
                          Maratha & Deshmukh Heritage
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Cultural Copy & Refined Value Markers (7 cols on desktop, vertically centered) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left">
              
              {/* Desktop Header Block */}
              <div className="hidden lg:block space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/95 backdrop-blur-xs border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
                  <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                    {isMarathi ? 'मराठी संस्कृती व परंपरा' : 'Marathi Heritage & Tradition'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-[#7A1526] tracking-tight leading-tight">
                    {isMarathi ? (
                      <span className="font-devanagari">छत्रपती शिवाजी महाराज</span>
                    ) : (
                      <span>Chhatrapati Shivaji Maharaj</span>
                    )}
                  </h2>
                  <p className="text-base sm:text-lg font-bold text-[#9E7B42] tracking-wide">
                    {isMarathi ? (
                      <span className="font-devanagari">संस्कार • स्वाभिमान • परंपरा</span>
                    ) : (
                      <span>Values • Self-Respect • Tradition</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Matrimonial Heritage Statement */}
              <p className="text-sm sm:text-base lg:text-[16px] text-[#4A3E39] leading-relaxed max-w-xl font-medium">
                {isMarathi ? (
                  <span className="font-devanagari">
                    "आपल्या संस्कृतीची उदात्त मूल्ये, परस्पर सन्मान आणि कुटुंबसंस्कार जपत, नव्या नात्यांची सुरुवात."
                  </span>
                ) : (
                  <span>
                    "Honouring the values of our heritage, mutual respect and family traditions as new relationships begin."
                  </span>
                )}
              </p>

              {/* Refined Heritage Value Plaques (Equal height in 1 row on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {/* 1. संस्कार / Values */}
                <div className="p-4 bg-white/95 backdrop-blur-xs rounded-2xl border border-[#EAE0D2] hover:border-[#D4B896] shadow-2xs hover:shadow-xs transition-all duration-200 text-center lg:text-left flex flex-col items-center lg:items-start justify-between h-full space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#D9C39E] flex items-center justify-center text-[#7A1526] shrink-0">
                    <Sparkles className="w-4 h-4 text-[#B88E4B]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#7A1526]">
                      {isMarathi ? 'संस्कार' : 'Values'}
                    </div>
                    <div className="text-xs text-[#5A4D45] mt-0.5 leading-snug">
                      {isMarathi ? 'कौटुंबिक मूल्ये व संस्कृती' : 'Family principles'}
                    </div>
                  </div>
                </div>

                {/* 2. स्वाभिमान / Self-Respect */}
                <div className="p-4 bg-white/95 backdrop-blur-xs rounded-2xl border border-[#EAE0D2] hover:border-[#D4B896] shadow-2xs hover:shadow-xs transition-all duration-200 text-center lg:text-left flex flex-col items-center lg:items-start justify-between h-full space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#D9C39E] flex items-center justify-center text-[#7A1526] shrink-0">
                    <Shield className="w-4 h-4 text-[#B88E4B]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#7A1526]">
                      {isMarathi ? 'स्वाभिमान' : 'Self-Respect'}
                    </div>
                    <div className="text-xs text-[#5A4D45] mt-0.5 leading-snug">
                      {isMarathi ? 'सन्मान व प्रतिष्ठा' : 'Dignity & honour'}
                    </div>
                  </div>
                </div>

                {/* 3. परंपरा / Tradition */}
                <div className="p-4 bg-white/95 backdrop-blur-xs rounded-2xl border border-[#EAE0D2] hover:border-[#D4B896] shadow-2xs hover:shadow-xs transition-all duration-200 text-center lg:text-left flex flex-col items-center lg:items-start justify-between h-full space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#D9C39E] flex items-center justify-center text-[#7A1526] shrink-0">
                    <Award className="w-4 h-4 text-[#B88E4B]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#7A1526]">
                      {isMarathi ? 'परंपरा' : 'Tradition'}
                    </div>
                    <div className="text-xs text-[#5A4D45] mt-0.5 leading-snug">
                      {isMarathi ? 'पवित्र विवाह बंध' : 'Sacred alliance'}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ShivajiMaharajHeritage;
