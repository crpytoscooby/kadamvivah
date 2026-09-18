import { useTranslation } from 'react-i18next';
import { Phone, ShieldCheck, Sparkles, HelpCircle, Lock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Contact Page - Official KadamVivah Support & FAQs
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) primary buttons & accents
 * - Antique Gold (#B88E4B) badges & highlights
 * - Warm borders (#EAE0D2)
 * - Strict Marathi & English single-language support
 * - Confirmed Official Contact: +91 80102 94034 (WhatsApp & Phone)
 */

export const Contact = () => {
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const supportNumber = '+91 80102 94034';
  const whatsappDigits = '918010294034';
  const callHref = 'tel:+918010294034';

  const whatsappMessage = isMarathi
    ? 'नमस्कार, मला कदम विवाहसंबंधित मदत हवी आहे.'
    : 'Hello, I need assistance regarding KadamVivah.';

  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(whatsappMessage)}`;

  const faqs = [
    {
      q: isMarathi 
        ? 'नोंदणी मोफत आहे का?' 
        : 'Is registration free?',
      a: isMarathi
        ? 'होय, कदम विवाहवर खाते तयार करणे आणि आपले विवाह प्रोफाइल नोंदवणे पूर्णपणे मोफत आहे.'
        : 'Yes, creating an account and registering your matrimonial profile on KadamVivah is completely free.'
    },
    {
      q: isMarathi 
        ? 'माझ्या प्रोफाइलला मंजुरीची आवश्यकता का आहे?' 
        : 'Why does my profile need approval?',
      a: isMarathi
        ? 'समाजातील विश्वासार्हता आणि सुरक्षितता राखण्यासाठी, शोध सूचीमध्ये दिसण्यापूर्वी प्रत्येक नवीन प्रोफाइल प्रशासकीय टीमद्वारे तपासले जाते.'
        : 'To maintain the trust, safety, and authenticity of our community, every new profile is reviewed by our administration team before appearing in search results.'
    },
    {
      q: isMarathi 
        ? 'मी दुसऱ्या सभासदांची संपर्क माहिती कधी पाहू शकतो?' 
        : "When can I see another member's contact details?",
      a: isMarathi
        ? 'गोपनीयता आणि सुरक्षिततेसाठी, दोन्ही बाजूंकडून पसंती (Interest) परस्पर स्वीकारली गेल्यानंतरच थेट फोन क्रमांक आणि संपर्क माहिती अनलॉक होते.'
        : 'For privacy and safety, direct phone numbers and contact details are only unlocked when both candidates mutually accept an interest request.'
    },
    {
      q: isMarathi 
        ? 'मंजुरीनंतर मी माझ्या प्रोफाइलमध्ये बदल करू शकतो का?' 
        : 'Can I edit my profile after approval?',
      a: isMarathi
        ? "होय, आपण 'My Profile' विभागातून आपल्या बायोडाटा, छायाचित्रे, शिक्षण आणि व्यवसाय माहितीमध्ये कधीही बदल करू शकता."
        : 'Yes, you can update your biodata, photographs, education, and career details anytime from the My Profile section.'
    },
    {
      q: isMarathi 
        ? 'मी एखाद्या प्रोफाइलमध्ये पसंती (Interest) कशी दर्शवू?' 
        : 'How do I express interest in a profile?',
      a: isMarathi
        ? "प्रोफाइल पाहताना, कोणत्याही सभासदाचा बायोडाटा उघडा आणि ऐच्छिक संदेशासह 'Express Interest' बटणावर क्लिक करून पसंती पाठवा."
        : "While browsing profiles, open any member's biodata and click the 'Express Interest' button to send a connection request with an optional note."
    },
    {
      q: isMarathi 
        ? 'मदतीसाठी कदम विवाहशी कसा संपर्क साधावा?' 
        : 'How can I contact KadamVivah for assistance?',
      a: isMarathi
        ? 'आपण या पानावर दिलेल्या WhatsApp किंवा फोन कॉल बटणांचा (+91 80102 94034) वापर करून थेट कदम विवाह सहाय्य (Support) शी संपर्क साधू शकता.'
        : 'You can reach KadamVivah Support directly using the WhatsApp or Call buttons provided on this page (+91 80102 94034).'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background ambient pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(#7A1526 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Compact Contact Intro */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'कदम विवाहशी संपर्क' : 'Contact KadamVivah'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1B17] tracking-tight mb-2.5">
            {isMarathi ? 'आम्ही आपल्या मदतीसाठी आहोत' : "We're Here to Help"}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-[#6B5E55] max-w-xl mx-auto leading-relaxed">
            {isMarathi
              ? 'आपल्या प्रोफाइल, विवाह स्थळ शोध, इंटरेस्ट किंवा कदम विवाह वापरण्याबद्दल मदत हवी असल्यास WhatsApp किंवा फोनद्वारे आमच्याशी संपर्क साधा.'
              : 'Need help with your profile, matrimonial search, interests, or using KadamVivah? Contact our team through WhatsApp or phone.'}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          
          {/* Official Support Card */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#EAE0D2]/70">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F8F3EA] border border-[#D9C39E]/70 flex items-center justify-center text-[#7A1526] shrink-0 shadow-2xs">
                  <Phone className="w-6 h-6 text-[#7A1526]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#7A6E65] uppercase tracking-wider block mb-0.5">
                    {isMarathi ? 'अधिकृत संपर्क' : 'Official Support'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2B1B17]">
                    {isMarathi ? 'कदम विवाह सहाय्य' : 'KadamVivah Support'}
                  </h2>
                  <p className="text-lg sm:text-xl font-mono font-bold text-[#7A1526] mt-0.5">
                    {supportNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons: WhatsApp (Primary) + Call (Secondary) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 sm:h-13 px-6 bg-[#128C7E] hover:bg-[#075E54] text-white text-sm sm:text-base font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer group"
              >
                {/* WhatsApp SVG Icon */}
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.055-.992-.055-.429-.133-1.002-.344-1.721-.659-1.503-.659-2.484-2.186-2.56-2.288-.075-.101-.617-.821-.617-1.566 0-.745.388-1.113.526-1.265.138-.152.302-.19.403-.19.101 0 .202.001.291.006.094.005.221-.036.345.263.129.313.441 1.077.48 1.155.039.078.064.168.013.27-.051.102-.077.165-.152.253-.076.089-.16.198-.228.266-.077.076-.157.159-.068.312.089.153.396.654.85 1.059.584.521 1.077.683 1.23.759.153.076.242.064.332-.039.09-.102.385-.448.487-.601.102-.153.204-.127.344-.076.14.051.89.42 1.043.496.153.076.255.114.292.178.037.064.037.371-.107.776zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.982-1.396C8.441 21.493 10.17 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.637 0-3.153-.485-4.43-1.319l-.317-.206-2.964.831.845-2.887-.227-.336A8.17 8.17 0 013.8 12c0-4.521 3.679-8.2 8.2-8.2 4.521 0 8.2 3.679 8.2 8.2 0 4.521-3.679 8.2-8.2 8.2z"/>
                </svg>
                <span>{isMarathi ? 'WhatsApp वर संदेश पाठवा' : 'Chat on WhatsApp'}</span>
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity ml-auto sm:ml-0" />
              </a>

              {/* Call Button */}
              <a
                href={callHref}
                className="h-12 sm:h-13 px-6 bg-white hover:bg-[#FAF7F2] border-2 border-[#7A1526] text-[#7A1526] hover:text-[#5B101D] text-sm sm:text-base font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#7A1526] shrink-0" />
                <span>{isMarathi ? 'फोन करा' : 'Call Us'}</span>
              </a>
            </div>
          </div>

          {/* Security & Privacy Notice */}
          <div className="bg-[#FAF6EE] border border-[#EAE0D2] rounded-2xl p-5 sm:p-6 flex items-start gap-3.5 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-white border border-[#D9C39E] flex items-center justify-center text-[#7A1526] shrink-0 mt-0.5">
              <Lock className="w-4 h-4 text-[#7A1526]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-serif font-bold text-[#2B1B17]">
                {isMarathi ? 'सुरक्षा व गोपनीयता सूचना' : 'Security & Privacy Notice'}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
                {isMarathi ? (
                  <>
                    आपल्या सुरक्षिततेसाठी WhatsApp किंवा फोनवर आपला पासवर्ड किंवा इतर संवेदनशील खाते माहिती कधीही शेअर करू नका. अधिक माहितीसाठी आमचे{' '}
                    <Link to="/privacy" className="text-[#7A1526] font-semibold underline hover:text-[#8F1024]">
                      गोपनीयता धोरण
                    </Link>{' '}
                    पहा.
                  </>
                ) : (
                  <>
                    For your security, never share your password or other sensitive account credentials over WhatsApp or phone. For details, read our{' '}
                    <Link to="/privacy" className="text-[#7A1526] font-semibold underline hover:text-[#8F1024]">
                      Privacy Policy
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>
          </div>

          {/* FAQs Accordion / List */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[#EAE0D2]/70">
              <HelpCircle className="w-5 h-5 text-[#7A1526] shrink-0" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2B1B17]">
                {isMarathi ? 'नेहमी विचारले जाणारे प्रश्न (FAQ)' : 'Frequently Asked Questions'}
              </h2>
            </div>

            <div className="divide-y divide-[#EAE0D2]/60 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className={index === 0 ? 'space-y-1.5' : 'pt-4 space-y-1.5'}>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#2B1B17] flex items-start gap-2">
                    <span className="text-[#B88E4B] font-mono text-xs sm:text-sm mt-0.5 shrink-0">
                      Q{index + 1}.
                    </span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5E55] pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Trust Footer */}
        <p className="text-center text-xs sm:text-sm text-[#7A6E65] mt-8 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#B88E4B] shrink-0" />
          <span>
            {isMarathi
              ? 'मराठा व देशमुख विवाह • विश्वासार्ह व सुरक्षित'
              : 'Maratha & Deshmukh Matrimony • Trusted & Secure'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Contact;
