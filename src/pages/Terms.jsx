import { useTranslation } from 'react-i18next';
import { ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Terms of Service Page
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) headings & accents
 * - Antique Gold (#B88E4B) badges
 * - Warm borders (#EAE0D2)
 * - Strict Marathi & English single-language support
 */

export const Terms = () => {
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background ambient pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(#7A1526 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'नियम आणि कायदेशीर अटी' : 'Platform Terms & Guidelines'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1B17] tracking-tight mb-2">
            {isMarathi ? 'नियम व अटी' : 'Terms of Service'}
          </h1>

          <p className="text-xs sm:text-sm text-[#7A6E65]">
            {isMarathi ? 'शेवटचे अद्यतन: सप्टेंबर २०२६' : 'Last updated: September 2026'}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '१. अटींची स्वीकृती' : '1. Acceptance of Terms'}
            </h2>
            <p>
              {isMarathi
                ? 'कदम विवाह प्लॅटफॉर्मचा वापर करून आपण या नियम व अटींचे पालन करण्याचे मान्य करता. जर आपण या अटींशी सहमत नसाल, तर कृपया प्लॅटफॉर्मचा वापर करू नये.'
                : 'By accessing and using KadamVivah, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '२. सेवेचे स्वरूप' : '2. Service Description'}
            </h2>
            <p>
              {isMarathi
                ? 'कदम विवाह हे मराठा व देशमुख समाजातील विवाह इच्छुकांसाठी आणि त्यांच्या कुटुंबांसाठी एक सन्माननीय वैवाहिक व्यासपीठ आहे. येथे केवळ विवाह उद्देशानेच प्रोफाइल तयार करण्याची परवानगी आहे.'
                : 'KadamVivah is a dedicated matrimonial platform designed for the Maratha & Deshmukh community. It provides a dignified digital space to create matrimonial profiles and connect for marriage alliances.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '३. पात्रता निकष' : '3. User Eligibility'}
            </h2>
            <p>
              {isMarathi
                ? 'कदम विवाहवर नोंदणी करण्यासाठी खालील निकष पूर्ण करणे बंधनकारक आहे:'
                : 'To register and use KadamVivah, you must satisfy the following criteria:'}
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>{isMarathi ? 'विवाहयोग्य वय पूर्ण असावे (किमान १८ वर्षे)' : 'Be of legal marriageable age (at least 18 years)'}</li>
              <li>{isMarathi ? 'कायदेशीररीत्या विवाह करण्यास पात्र असावे' : 'Possess the legal capacity to enter into marriage under applicable laws'}</li>
              <li>{isMarathi ? 'प्रोफाइलमध्ये दिलेली माहिती सत्य व अचूक असावी' : 'Provide authentic, truthful, and up-to-date personal details'}</li>
              <li>{isMarathi ? 'केवळ विवाह हेतूनेच व्यासपीठाचा वापर करावा' : 'Use the service strictly for bona fide matrimonial purposes'}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '४. सभासदांची जबाबदारी' : '4. Member Responsibilities'}
            </h2>
            <p>
              {isMarathi
                ? 'सभासदांनी आपल्या लॉगिन माहितीची सुरक्षितता राखणे आवश्यक आहे. खोटी माहिती देणे, दिशाभूल करणे, इतर सभासदांशी गैरवर्तन करणे किंवा प्लॅटफॉर्मचा व्यावसायिक कारणांसाठी वापर करणे सक्त निषिद्ध आहे.'
                : 'Members are solely responsible for maintaining the confidentiality of their account credentials. Providing misleading information, harassing members, or utilizing the platform for commercial solicitation is strictly prohibited.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '५. प्रोफाइल मंजुरी व प्रशासकीय अधिकार' : '5. Profile Moderation & Rights'}
            </h2>
            <p>
              {isMarathi
                ? 'प्लॅटफॉर्मची विश्वासार्हता टिकवून ठेवण्यासाठी नवीन प्रोफाइल्सची ॲडमिनद्वारे तपासणी केली जाते. नियमांचे उल्लंघन करणाऱ्या किंवा अयोग्य वाटणाऱ्या प्रोफाइल्सला नकार देण्याचा किंवा खाते निलंबित करण्याचा अधिकार प्रशासनाकडे राखून ठेवला आहे.'
                : 'To maintain high community standards, profiles undergo administrative review before becoming publicly visible. Administration reserves the right to reject, suspend, or terminate accounts that breach platform guidelines.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '६. संपर्काचे नियम' : '6. Contact & Verification Disclaimer'}
            </h2>
            <p>
              {isMarathi
                ? 'कुटुंबांनी विवाह संबंध जुळवताना स्वतःच्या पातळीवर योग्य ती कौटुंबिक व वैयक्तिक खातरजमा करून घ्यावी. कदम विवाह हे केवळ संपर्क सुलभ करण्याचे व्यासपीठ आहे.'
                : 'Families are advised to exercise independent judgment and conduct standard background verifications prior to finalizing matrimonial alliances. KadamVivah serves as a matchmaking medium.'}
            </p>
          </section>
        </div>

        {/* Trust Line */}
        <p className="text-center text-xs sm:text-sm text-[#7A6E65] mt-8 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#B88E4B] shrink-0" />
          <span>
            {isMarathi
              ? 'मराठा व देशमुख विवाह • गोपनीयतेला प्राधान्य'
              : 'Maratha & Deshmukh Matrimony • Privacy-Focused'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Terms;
