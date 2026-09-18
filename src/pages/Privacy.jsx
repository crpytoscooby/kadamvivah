import { useTranslation } from 'react-i18next';
import { ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Privacy Policy Page
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) headings & accents
 * - Antique Gold (#B88E4B) badges
 * - Warm borders (#EAE0D2)
 * - Strict Marathi & English single-language support
 */

export const Privacy = () => {
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
              {isMarathi ? 'गोपनीयता व डेटा सुरक्षा' : 'Data Privacy & Security'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1B17] tracking-tight mb-2">
            {isMarathi ? 'गोपनीयता धोरण' : 'Privacy Policy'}
          </h1>

          <p className="text-xs sm:text-sm text-[#7A6E65]">
            {isMarathi ? 'शेवटचे अद्यतन: सप्टेंबर २०२६' : 'Last updated: September 2026'}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '१. प्रस्तावना' : '1. Introduction'}
            </h2>
            <p>
              {isMarathi
                ? 'कदम विवाह ("आम्ही", "आमचे") आपल्या गोपनीयतेचे रक्षण करण्यास कटिबद्ध आहे. हे धोरण आम्ही आपल्या विवाह सेवांच्या वापरादरम्यान माहिती कशा प्रकारे संकलित करतो, वापरतो आणि सुरक्षित ठेवतो हे स्पष्ट करते.'
                : 'KadamVivah ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our matrimonial platform.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '२. संकलित केली जाणारी माहिती' : '2. Information We Collect'}
            </h2>
            <p>
              {isMarathi
                ? 'नोंदणी आणि प्रोफाइल निर्मिती दरम्यान आम्ही खालील माहिती संकलित करतो:'
                : 'When you register on KadamVivah, we collect the following information for matrimonial profile purposes:'}
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>{isMarathi ? 'पूर्ण नाव, जन्मतारीख आणि लिंग' : 'Full Name, Date of Birth, and Gender'}</li>
              <li>{isMarathi ? 'ईमेल पत्ता आणि मोबाईल क्रमांक' : 'Email Address and Mobile Phone Number'}</li>
              <li>{isMarathi ? 'सध्याचे शहर, राज्य आणि पिनकोड' : 'Location (City, State, Pincode)'}</li>
              <li>{isMarathi ? 'समाज व गोत्र माहिती' : 'Community details (Maratha/Deshmukh community, Gotra)'}</li>
              <li>{isMarathi ? 'शैक्षणिक पात्रता, व्यवसाय आणि वार्षिक उत्पन्न' : 'Education, Profession, and Annual Income'}</li>
              <li>{isMarathi ? 'कौटुंबिक माहिती आणि भावंडांची माहिती' : 'Family background and sibling details'}</li>
              <li>{isMarathi ? 'बायोडाटा आणि प्रोफाइल छायाचित्रे' : 'Photographs and personal partner expectations'}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '३. माहितीचा वापर' : '3. How We Use Your Information'}
            </h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>{isMarathi ? 'आपले विवाह प्रोफाइल तयार करणे आणि व्यवस्थापित करणे' : 'Creating and managing your matrimonial biodata profile'}</li>
              <li>{isMarathi ? 'फक्त मंजूर सभासदांना शोध सूचीमध्ये प्रोफाइल दाखवणे' : 'Displaying approved profile details to matching community members'}</li>
              <li>{isMarathi ? 'परस्पर पसंतीनंतर सुरक्षित संपर्क देवाणघेवाण सुलभ करणे' : 'Facilitating connection requests and mutual match communication'}</li>
              <li>{isMarathi ? 'प्लॅटफॉर्मची सुरक्षितता राखणे आणि गैरवापर रोखणे' : 'Maintaining platform security and preventing unauthorized access'}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '४. संपर्क गोपनीयतेचे नियम' : '4. Contact Privacy Rules'}
            </h2>
            <p>
              {isMarathi
                ? 'आपला थेट मोबाईल क्रमांक आणि ईमेल पत्ता सामान्य शोध परिणामांमध्ये कधीही उघडे केले जात नाहीत. जेव्हा दोन्ही सभासदांनी एकमेकांची पसंती स्वीकारली (Mutual Match) असेल, तेव्हाच संपर्क माहिती आपोआप अनलॉक होते.'
                : 'Your direct phone numbers and email address are never displayed publicly in search listings. Contact details are only unlocked mutually after both candidates accept a connection request.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '५. डेटा सुरक्षा' : '5. Data Security'}
            </h2>
            <p>
              {isMarathi
                ? 'आम्ही खात्याची माहिती आणि वैयक्तिक माहिती सुरक्षित ठेवण्यासाठी वाजवी तांत्रिक व सुरक्षा उपाययोजना वापरतो, ज्यामध्ये सुरक्षित पासवर्ड हाताळणी आणि उत्पादन वेबसाइटवरील HTTPS चा समावेश आहे. आम्ही वापरकर्त्यांची माहिती कोणत्याही तृतीय पक्षाला विकत किंवा भाड्याने देत नाही.'
                : 'We use reasonable technical and security measures to protect account credentials and personal information, including secure password handling and HTTPS on the production website. We do not sell or rent user data to third-party advertisers.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? '६. आपले अधिकार' : '6. Your Rights'}
            </h2>
            <p>
              {isMarathi
                ? 'आपण आपल्या खात्यातील माहिती कधीही अद्ययावत करू शकता किंवा सपोर्टशी संपर्क साधून खाते निष्क्रिय करण्याची विनंती करू शकता.'
                : 'You have full rights to update your matrimonial profile details, replace photos, or request account closure anytime.'}
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

export default Privacy;
