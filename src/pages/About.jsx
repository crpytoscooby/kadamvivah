import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Lock, 
  Users, 
  Quote, 
  User, 
  ArrowRight, 
  MapPin, 
  Award,
  Flower2
} from 'lucide-react';

/**
 * About Page - Authentic Story, Vision, Values, & Founder Presentation
 * Dedicated Matrimonial Platform for Maratha & Deshmukh Families
 * Strict single-language support: Marathi / English.
 */
export const About = () => {
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');
  const [imgError, setImgError] = useState(false);

  const values = [
    {
      num: '01',
      icon: HeartHandshake,
      title: isMarathi ? 'विश्वास' : 'Trust',
      desc: isMarathi
        ? 'पारदर्शक आणि आदरयुक्त संवाद, ज्यामुळे दोन्ही कुटुंबांमध्ये परस्पर विश्वासाची पायाभरणी होते.'
        : 'Respectful and transparent matrimonial interactions building genuine trust between families.'
    },
    {
      num: '02',
      icon: Award,
      title: isMarathi ? 'कौटुंबिक संस्कार' : 'Family Values',
      desc: isMarathi
        ? 'विवाह निर्णयात कौटुंबिक संस्कृती, परंपरा आणि उदात्त मूल्यांना सर्वोच्च प्राधान्य देणे.'
        : 'Recognising the paramount importance of family culture, honour and traditions in matrimonial decisions.'
    },
    {
      num: '03',
      icon: Lock,
      title: isMarathi ? 'गोपनीयता' : 'Privacy',
      desc: isMarathi
        ? 'सदस्यांची वैयक्तिक माहिती व संपर्क तपशील जबाबदारीने आणि संपूर्ण गोपनीयतेने हाताळणे.'
        : 'Responsible and secure handling of member profiles and personal contact details.'
    },
    {
      num: '04',
      icon: Users,
      title: isMarathi ? 'समाज' : 'Community',
      desc: isMarathi
        ? 'मराठा व देशमुख समाजातील विवाह इच्छुक कुटुंबांसाठी एक समर्पित, सुलभ आणि सांस्कृतिक व्यासपीठ.'
        : 'A dedicated matrimonial platform centred specifically around Maratha & Deshmukh families.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241C1A]">
      
      {/* 1. ABOUT HERO SECTION */}
      <section className="relative py-14 sm:py-16 lg:py-20 overflow-hidden border-b border-[#EAE0D2] bg-gradient-to-b from-[#FAF6F0] via-[#FAF7F2] to-[#F7F1E6]">
        {/* Subtle Fort Silhouette Background Artwork */}
        <div className="absolute left-0 bottom-0 w-72 sm:w-96 lg:w-[480px] pointer-events-none select-none opacity-[0.05] lg:opacity-[0.07] text-[#7A1526] z-0 overflow-hidden">
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

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#7A1526]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#B88E4B]/10 blur-3xl pointer-events-none" />

        {/* Subtle Cultural Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#7A1526_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white/95 backdrop-blur-xs border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'आमच्याविषयी' : 'About KadamVivah'}
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#7A1526] tracking-tight leading-[1.2] max-w-4xl mx-auto mb-4">
            {isMarathi ? (
              <span className="font-devanagari">
                परंपरा जपत, विश्वासाने नाती जोडण्याचा प्रयत्न
              </span>
            ) : (
              <span>
                Connecting Families Through Trust, Values & Tradition
              </span>
            )}
          </h1>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="h-px w-12 bg-linear-to-r from-transparent to-[#B88E4B]" />
            <span className="text-[#B88E4B] text-xs">❖</span>
            <span className="h-px w-12 bg-linear-to-l from-transparent to-[#B88E4B]" />
          </div>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base lg:text-[17px] text-[#4A3E39] leading-relaxed max-w-2xl mx-auto">
            {isMarathi ? (
              <span className="font-devanagari">
                कदम विवाह हे मराठा व देशमुख समाजातील कुटुंबांसाठी समर्पित, गोपनीय आणि संस्काराधिष्ठित विवाह व्यासपीठ आहे. परंपरा आणि आधुनिक तंत्रज्ञानाचा समतोल साधत योग्य जीवनसाथी शोधण्यासाठी आम्ही सदैव कार्यरत आहोत.
              </span>
            ) : (
              <span>
                KadamVivah is a respectful, privacy-conscious matrimonial platform dedicated to Maratha and Deshmukh families across Maharashtra, blending cultural traditions with secure modern technology.
              </span>
            )}
          </p>
        </div>
      </section>

      {/* 2. OUR STORY / KADAMVIVAH VISION */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#EAE0D2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Story Text Left (7 cols) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
                <span>{isMarathi ? 'ध्येय व संकल्पना' : 'Vision & Origin'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#7A1526] tracking-tight">
                {isMarathi ? (
                  <span className="font-devanagari">कदम विवाहची सुरुवात</span>
                ) : (
                  <span>The Story Behind KadamVivah</span>
                )}
              </h2>

              {/* Decorative line */}
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="h-0.5 w-10 bg-linear-to-r from-[#B88E4B] to-[#D9C39E] rounded-full" />
                <span className="text-[#B88E4B] text-xs">❖</span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm lg:text-[15px] text-[#4A3E39] leading-relaxed">
                <p>
                  {isMarathi ? (
                    <span className="font-devanagari">
                      मराठा व देशमुख समाजातील कुटुंबांना विवाह जुळवणीच्या प्रक्रियेत पारदर्शकता, सुरक्षितता आणि परस्परादर मिळावा या उद्देशाने <strong>नितीन कदम</strong> यांनी कदम विवाहची स्थापना केली.
                    </span>
                  ) : (
                    <span>
                      KadamVivah was founded by <strong>Nitin Kadam</strong> with the clear purpose of providing Maratha and Deshmukh families with a dedicated, authentic and privacy-protected matrimonial space.
                    </span>
                  )}
                </p>

                <p>
                  {isMarathi ? (
                    <span className="font-devanagari">
                      पारंपरिक कौटुंबिक मूल्यांचा आदर करत आणि आजच्या डिजिटल युगातील सुलभतेचा लाभ घेत, योग्य व सुसंस्कृत जीवनसाथी शोधणे प्रत्येक कुटुंबासाठी सहज व सन्मानपूर्वक व्हावे, हा या व्यासपीठाचा मुख्य हेतू आहे.
                    </span>
                  ) : (
                    <span>
                      By honouring traditional family heritage while leveraging modern digital accessibility, the platform aims to make matrimonial discovery dignified, secure, and accessible to every family.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Cultural Statement Card Right (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#FAF7F2] via-[#F6EFE5] to-[#EAE0D2] border-2 border-[#D9C39E] rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7A1526] to-[#550E1B] text-white flex items-center justify-center mx-auto border border-[#D9C39E] shadow-xs">
                  <Flower2 className="w-7 h-7 text-[#D9C39E]" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9E7B42]">
                    {isMarathi ? 'पवित्र विवाह संस्कार' : 'Sacred Matrimony'}
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#7A1526]">
                    {isMarathi ? 'संस्कार • स्वाभिमान • परंपरा' : 'Values • Honor • Tradition'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4D45] leading-relaxed max-w-xs mx-auto">
                    {isMarathi
                      ? 'दोन मनांचे आणि दोन कुटुंबांचे सन्मानपूर्वक मिलन घडवून आणणारा विश्वासार्ह सेतू.'
                      : 'A respectful bridge uniting two individuals and two families with sacred cultural values.'
                    }
                  </p>
                </div>

                <div className="pt-2 border-t border-[#D9C39E]/60 text-xs font-bold text-[#7A1526]">
                  {isMarathi ? 'मराठा व देशमुख विवाह व्यासपीठ' : 'Maratha & Deshmukh Matrimony'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FOUNDER PRESENTATION (ABOUT PAGE SPECIFIC) */}
      <section className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#EAE0D2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-xs border border-[#EAE0D2] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Founder Portrait Left (5 cols on lg) */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-full max-w-[300px] sm:max-w-[320px] aspect-[4/5] rounded-3xl p-2 bg-gradient-to-b from-[#FAF7F2] via-[#F6EFE5] to-[#EAE0D2] border-2 border-[#D9C39E] shadow-lg group">
                  {/* Subtle corner flourish */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B88E4B] rounded-tl pointer-events-none z-10" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B88E4B] rounded-tr pointer-events-none z-10" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B88E4B] rounded-bl pointer-events-none z-10" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B88E4B] rounded-br pointer-events-none z-10" />

                  <div className="w-full h-full rounded-2xl overflow-hidden bg-[#FAF7F2] relative flex flex-col items-center justify-center border border-[#D9C39E]">
                    {!imgError ? (
                      <img
                        src="/images/nitin-kadam-founder.webp"
                        alt={isMarathi ? "नितीन कदम — संस्थापक" : "Nitin Kadam — Founder"}
                        className="w-full h-full object-cover object-[center_top] block transition-all duration-500 group-hover:scale-102"
                        loading="lazy"
                        onError={(e) => {
                          if (e.target.src.endsWith('.webp')) {
                            e.target.src = '/images/nitin-kadam-founder.png';
                          } else {
                            setImgError(true);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#FFFDF9] to-[#F3ECE0]">
                        <div className="w-20 h-20 rounded-full bg-[#7A1526]/10 border border-[#D9C39E] flex items-center justify-center text-[#7A1526] mb-4 shadow-2xs">
                          <User className="w-10 h-10 text-[#7A1526]" />
                        </div>
                        <h4 className="font-serif font-bold text-lg text-[#7A1526] mb-1">
                          {isMarathi ? 'नितीन कदम' : 'Nitin Kadam'}
                        </h4>
                        <p className="text-xs font-semibold text-[#9E7B42] uppercase tracking-wider mb-2">
                          {isMarathi ? 'संस्थापक — कदम विवाह' : 'Founder — KadamVivah'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Founder Details Right (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
                  <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                    {isMarathi ? 'संस्थापकांचे मनोगत' : 'Founder’s Message'}
                  </span>
                </div>

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

                <div className="flex items-center justify-center lg:justify-start gap-2 pt-0.5">
                  <span className="h-0.5 w-12 bg-linear-to-r from-[#B88E4B] to-[#D9C39E] rounded-full" />
                  <span className="text-[#B88E4B] text-xs">❖</span>
                </div>

                <p className="text-xs sm:text-sm lg:text-[15px] text-[#4A3E39] leading-relaxed">
                  {isMarathi ? (
                    <span className="font-devanagari">
                      "मराठा व देशमुख समाजातील प्रत्येक कुटुंबाला योग्य स्थळ शोधताना आत्मसन्मान, सत्यता आणि पारदर्शकता मिळावी, या दृढ विश्वासाने कदम विवाहची मुहूर्तमेढ रोवली गेली. नव्या पिढीच्या अपेक्षा आणि कुटुंबाचे संस्कार यांचा सुवर्णमध्य साधत, विश्वासाची एक नवी परंपरा आम्ही घडवत आहोत."
                    </span>
                  ) : (
                    <span>
                      "KadamVivah was established with the conviction that every Maratha and Deshmukh family deserves a dignified, authentic and transparent matrimonial discovery experience. By bridging modern aspirations with sacred family values, we strive to build enduring relationships on trust."
                    </span>
                  )}
                </p>

                {/* Established Vision Quote */}
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

            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR CORE VALUES (4 VALUE CARDS) */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#EAE0D2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
              <span>{isMarathi ? 'आमची मार्गदर्शक तत्त्वे' : 'Our Guiding Principles'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#7A1526] mb-3 tracking-tight">
              {isMarathi ? (
                <span className="font-devanagari">मूल्ये व तत्त्वप्रणाली</span>
              ) : (
                <span>Our Core Values</span>
              )}
            </h2>

            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-px w-10 bg-linear-to-r from-transparent to-[#B88E4B]" />
              <span className="text-[#B88E4B] text-xs">❖</span>
              <span className="h-px w-10 bg-linear-to-l from-transparent to-[#B88E4B]" />
            </div>

            <p className="text-xs sm:text-sm text-[#5A4A42] max-w-xl mx-auto leading-relaxed">
              {isMarathi
                ? 'कदम विवाहची प्रत्येक कार्यपद्धती या चार मूलभूत स्तंभांवर आधारित आहे.'
                : 'Every feature and service at KadamVivah is rooted in these four pillars.'
              }
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#EAE0D2] shadow-2xs hover:border-[#B88E4B]/70 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] group-hover:bg-[#7A1526] group-hover:text-white group-hover:border-[#7A1526] transition-all duration-300 shadow-2xs">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="font-serif font-black text-xl text-[#B88E4B]/40">
                      {v.num}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#7A1526] mb-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-[#66554B] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HERITAGE & CULTURAL CONNECTION */}
      <section className="py-12 sm:py-14 bg-gradient-to-b from-[#FAF7F2] via-[#F7F0E6] to-[#FAF7F2] border-b border-[#EAE0D2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-xs border border-[#D9C39E] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-4">
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
              <span>{isMarathi ? 'सांस्कृतिक वारसा' : 'Cultural Heritage'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#7A1526] tracking-tight">
              {isMarathi ? (
                <span className="font-devanagari">संस्कार • स्वाभिमान • परंपरा</span>
              ) : (
                <span>Values • Self-Respect • Tradition</span>
              )}
            </h3>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-linear-to-r from-transparent to-[#B88E4B]" />
              <span className="text-[#B88E4B] text-xs">❖</span>
              <span className="h-px w-10 bg-linear-to-l from-transparent to-[#B88E4B]" />
            </div>

            <p className="text-xs sm:text-sm lg:text-base text-[#4A3E39] leading-relaxed max-w-xl mx-auto">
              {isMarathi ? (
                <span className="font-devanagari">
                  महाराष्ट्रातील मराठा व देशमुख समाजाचा उज्ज्वल इतिहास, शौर्य आणि कुटुंबसंस्कारांची समृद्ध परंपरा जपत, नव्या नात्यांची सन्मानपूर्वक सुरुवात करण्यास आम्ही कटिबद्ध आहोत.
                </span>
              ) : (
                <span>
                  Honouring the rich legacy, noble values and enduring traditions of the Maratha and Deshmukh community, we are dedicated to fostering respectful, lifelong alliances.
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY PURPOSE & REGIONAL REACH */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#EAE0D2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-3 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-[#B88E4B]" />
              <span>{isMarathi ? 'समाजाची सेवा' : 'Community Focus'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#7A1526] mb-3 tracking-tight">
              {isMarathi ? (
                <span className="font-devanagari">महाराष्ट्रातील कुटुंबांशी थेट जोडणी</span>
              ) : (
                <span>Connecting Families Across Maharashtra</span>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-[#5A4A42] max-w-xl mx-auto leading-relaxed">
              {isMarathi
                ? 'पुणे, सातारा, कोल्हापूर, सांगली, सोलापूर, मुंबई, ठाणे, नाशिक, छ. संभाजीनगर व संपूर्ण महाराष्ट्रातील मराठा व देशमुख कुटुंबांसाठी.'
                : 'Serving Maratha & Deshmukh families across Pune, Satara, Kolhapur, Sangli, Solapur, Mumbai, Thane, Nashik, Chhatrapati Sambhajinagar and beyond.'
              }
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#EAE0D2] text-center max-w-3xl mx-auto space-y-3">
            <h4 className="font-serif font-bold text-base sm:text-lg text-[#7A1526]">
              {isMarathi ? 'आमचा उद्देश' : 'Our Purpose'}
            </h4>
            <p className="text-xs sm:text-sm text-[#4A3E39] leading-relaxed">
              {isMarathi ? (
                <span className="font-devanagari">
                  प्रत्येक पात्र वधू-वरास आणि त्यांच्या पालकांना त्यांच्या अपेक्षांनुसार सुसंस्कृत व योग्य स्थळ शोधता यावे, यासाठी आम्ही एक सुलभ आणि विश्वासार्ह डिजिटल व्यासपीठ उपलब्ध करून दिले आहे.
                </span>
              ) : (
                <span>
                  To provide candidates and their parents with a dignified, transparent, and seamless matrimonial platform tailored to their values and aspirations.
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 7. FINAL REGISTRATION CTA */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-r from-[#7A1526] via-[#65101E] to-[#500D18] text-white overflow-hidden border-t border-[#962638]">
        {/* Subtle traditional pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#FAF7F2 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        {/* Soft Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B88E4B]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 backdrop-blur-xs border border-[#D9C39E]/30 rounded-full text-xs font-semibold text-[#D9C39E] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D9C39E]" />
            <span>{isMarathi ? 'विनामूल्य नोंदणी' : 'Free Registration'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
            {isMarathi ? (
              <span className="font-devanagari">योग्य नात्याच्या शोधाची सुरुवात आजच करा</span>
            ) : (
              <span>Begin Your Search for a Meaningful Relationship</span>
            )}
          </h2>

          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D9C39E]" />
            <span className="text-[#D9C39E] text-xs">❖</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D9C39E]" />
          </div>

          <p className="text-xs sm:text-sm lg:text-base text-[#F5EEE4] max-w-2xl mx-auto leading-relaxed">
            {isMarathi ? (
              <span className="font-devanagari">
                मराठा व देशमुख समाजातील योग्य जीवनसाथीच्या शोधासाठी आजच आपले मोफत प्रोफाइल तयार करा.
              </span>
            ) : (
              <span>
                Create your free KadamVivah profile today and begin exploring suitable matrimonial matches within the Maratha & Deshmukh community.
              </span>
            )}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full !bg-[#FAF7F2] hover:!bg-white !text-[#7A1526] font-bold text-sm sm:text-base border border-[#D9C39E] hover:border-[#B88E4B] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                <span className="text-[#7A1526] font-bold">{isMarathi ? 'विनामूल्य नोंदणी करा →' : 'Register Free →'}</span>
              </Button>
            </Link>
            <Link to="/profiles" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full !bg-white hover:!bg-[#FAF7F2] !text-[#7A1526] hover:!text-[#550E1B] font-bold text-sm sm:text-base border border-[#D9C39E] hover:border-[#B88E4B] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                <span className="text-[#7A1526] font-bold">{isMarathi ? 'स्थळे पहा' : 'Browse Profiles'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
