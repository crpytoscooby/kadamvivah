import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ProfileCard } from '../components/ProfileCard';
import { QuickMatchSearch } from '../components/home/QuickMatchSearch';
import { ShivajiMaharajHeritage } from '../components/home/ShivajiMaharajHeritage';
import { FounderSection } from '../components/home/FounderSection';
import { CityDiscovery } from '../components/home/CityDiscovery';
import { TrustPrivacyFeatures } from '../components/home/TrustPrivacyFeatures';
import { 
  Heart, 
  Lock, 
  Users, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  HeartHandshake,
  UserCheck,
  Church,
  Flower2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';

/**
 * Home Page - Main Landing Page for KadamVivah
 * Dedicated Matrimony Platform for Maratha & Deshmukh Communities
 */
export const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  // Fetch approved profiles if authenticated
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated()) {
      setLoadingProfiles(true);
      api.get('/profiles', { params: { limit: 4 } })
        .then((res) => {
          if (isMounted) {
            setFeaturedProfiles(res.data?.data?.profiles || []);
          }
        })
        .catch(() => {
          if (isMounted) {
            setFeaturedProfiles([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoadingProfiles(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated()]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241C1A]">
      
      {/* 1. Premium Hero Section */}
      <section className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[640px] xl:min-h-[680px] flex items-center overflow-hidden border-b border-[#EAE0D2] bg-gradient-to-b from-[#FAF6F0] via-[#FAF7F2] to-[#F7F1E6]">
        
        {/* Clean Vector Cultural Background: Maratha Fort Silhouette & Saffron Bhagwa Flag */}
        <div className="absolute left-0 bottom-0 w-80 sm:w-96 lg:w-[500px] pointer-events-none select-none opacity-30 lg:opacity-40 text-[#9E7B66] z-0 overflow-hidden">
          <svg viewBox="0 0 600 350" fill="currentColor" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            {/* Mountain Ridge */}
            <path d="M0 350 L0 240 Q80 230 160 190 Q240 150 320 160 Q400 170 480 120 Q540 80 600 100 L600 350 Z" opacity="0.35" fill="#BFA795" />
            {/* Fort Ramparts & Bastions */}
            <path d="M40 350 L40 210 L55 210 L55 220 L65 220 L65 210 L80 210 L80 220 L90 220 L90 210 L105 210 L105 220 L115 220 L115 210 L140 210 L140 350 Z" fill="#A88B77" />
            <path d="M130 350 L130 170 L145 170 L145 180 L155 180 L155 170 L170 170 L170 180 L180 180 L180 170 L200 170 L200 350 Z" fill="#9E7F6B" />
            <path d="M240 350 L240 140 L255 140 L255 150 L265 150 L265 140 L280 140 L280 150 L290 150 L290 140 L310 140 L310 350 Z" fill="#A88B77" />
            {/* Tallest Central Bastion */}
            <path d="M300 350 L300 90 L315 90 L315 100 L325 100 L325 90 L340 90 L340 100 L350 100 L350 90 L370 90 L370 350 Z" fill="#9E7F6B" />
            <path d="M325 130 Q335 115 345 130 L345 150 L325 150 Z" fill="#FAF7F2" />
            {/* Flagstaff & Fluttering Saffron Bhagwa Flag */}
            <line x1="335" y1="90" x2="335" y2="20" stroke="#B88E4B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="335" cy="18" r="3" fill="#B88E4B" />
            <path d="M336 22 L400 40 L368 56 L405 72 L336 88 Z" fill="#E85A0C" opacity="0.95" />
            {/* Secondary Wall Lines */}
            <path d="M360 350 L360 120 L375 120 L375 130 L385 130 L385 120 L400 120 L400 350 Z" fill="#A88B77" opacity="0.8" />
            <path d="M430 350 L430 150 L450 150 L450 350 Z" fill="#BFA795" opacity="0.6" />
          </svg>
        </div>

        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#7A1526]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#B88E4B]/10 blur-3xl pointer-events-none" />
        
        {/* Subtle Cultural Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#7A1526_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* DESKTOP INTEGRATED RIGHT-SIDE WEDDING COUPLE VISUAL (New Wide Landscape Scene reaching right edge) */}
        {!heroImgError && (
          <div className="hidden lg:flex absolute top-0 right-0 bottom-0 left-[45%] lg:left-[46%] xl:left-[48%] h-full pointer-events-none select-none z-0 items-center justify-end overflow-hidden">
            <div className="relative h-full w-full flex items-center justify-end overflow-hidden">
              {/* Single High-Res Sharp Wedding Photo - Natural Wide Landscape, Full Headroom, Zero artificial zoom */}
              <img
                src="/images/kadamvivah-hero-couple.webp"
                alt={isMarathi ? "मराठा व देशमुख विवाह संस्कार" : "Maratha & Deshmukh Matrimony"}
                className="h-full w-full object-cover object-[center_12%]"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0px, rgba(0,0,0,0.6) 40px, black 120px)',
                  maskImage: 'linear-gradient(to right, transparent 0px, rgba(0,0,0,0.6) 40px, black 120px)'
                }}
                onError={(e) => {
                  if (e.currentTarget.src.endsWith('.webp')) {
                    e.currentTarget.src = '/images/kadamvivah-hero-couple.png';
                  } else {
                    setHeroImgError(true);
                  }
                }}
              />

              {/* Subtle Ivory Gradient Feather over the left edge (~100-120px) */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/40 to-transparent pointer-events-none z-[1]" />

              {/* Seamless Bottom Fade for QuickMatchSearch overlap */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-transparent pointer-events-none z-[1]" />

              {/* Subtle Top Soft Fade */}
              <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#FAF6F0]/30 to-transparent pointer-events-none z-[1]" />
            </div>

            {/* Celebratory Floating Red Rose Petals */}
            <div className="absolute top-[20%] left-[2%] w-3.5 h-6 rounded-full bg-[#8E1B2D]/75 blur-[0.4px] rotate-45 transform pointer-events-none shadow-xs z-[2]" />
            <div className="absolute top-[44%] left-[1%] w-3 h-5 rounded-full bg-[#A31D32]/70 blur-[0.4px] -rotate-25 transform pointer-events-none shadow-xs z-[2]" />
            <div className="absolute top-[68%] left-[5%] w-3.5 h-5.5 rounded-full bg-[#8E1B2D]/60 blur-[0.4px] rotate-15 transform pointer-events-none z-[2]" />
          </div>
        )}

        {/* Master Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20 relative z-10 w-full">
          <div className="max-w-xl lg:max-w-[540px] xl:max-w-[580px] flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 lg:space-y-6 mx-auto lg:mx-0">
            
            {/* Community Positioning Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/95 backdrop-blur-xs border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                {isMarathi 
                  ? 'मराठा व देशमुख समाजासाठी विश्वासाचे विवाह व्यासपीठ'
                  : 'Trusted Matrimony for Maratha & Deshmukh Families'
                }
              </span>
            </div>

            {/* Brand Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-black text-[#7A1526] tracking-tight leading-[1.2] drop-shadow-2xs">
                {isMarathi ? (
                  <span className="font-devanagari">
                    योग्य जोडीदाराचा शोध, <br />
                    संस्कारांच्या साथीने
                  </span>
                ) : (
                  <span>
                    Find the Right Life Partner, <br />
                    Rooted in Values
                  </span>
                )}
              </h1>
            </div>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#4A3E39] leading-relaxed max-w-[620px]">
              {isMarathi ? (
                <span className="font-devanagari">
                  परंपरा, संस्कार आणि आधुनिक जीवनशैलीचा सुंदर संगम — मराठा व देशमुख कुटुंबांसाठी एक विश्वासार्ह, सुरक्षित आणि विनामूल्य विवाह व्यासपीठ.
                </span>
              ) : (
                <span>
                  A dedicated, privacy-protected matrimonial platform connecting respectful Maratha & Deshmukh families across Maharashtra while honoring sacred traditions.
                </span>
              )}
            </p>

            {/* Action Buttons (Pill CTAs) */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              {!isAuthenticated() ? (
                <>
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#7A1526] hover:bg-[#600F1E] text-white text-sm sm:text-base font-bold shadow-md border border-[#962638] flex items-center justify-center gap-2">
                      <span>{isMarathi ? 'विनामूल्य नोंदणी करा' : 'Register Free'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/profiles" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full border-[#D9C39E] text-[#7A1526] hover:bg-white text-sm sm:text-base font-bold shadow-2xs">
                      {isMarathi ? 'प्रोफाइल पहा' : 'Browse Profiles'}
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/profiles" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#7A1526] hover:bg-[#600F1E] text-white text-sm sm:text-base font-bold shadow-md border border-[#962638] flex items-center justify-center gap-2">
                    <span>{isMarathi ? 'सर्व प्रोफाइल पहा' : 'Browse All Profiles'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Under-CTA Trust / Value Indicators Line */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-3 text-xs font-semibold text-[#5A4D45]">
              <span className="font-devanagari text-[#9E7B42] tracking-wide">
                {isMarathi ? 'संस्कार • स्वाभिमान • परंपरा' : 'Heritage • Honor • Tradition'}
              </span>
              <span className="text-[#D9C39E] hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#7A1526] shrink-0" />
                <span>{isMarathi ? 'समुदाय-केंद्रित व्यासपीठ' : 'Community-Focused'}</span>
              </span>
              <span className="text-[#D9C39E] hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#7A1526] shrink-0" />
                <span>{isMarathi ? 'मंजूर प्रोफाइल' : 'Approved Profiles'}</span>
              </span>
              <span className="text-[#D9C39E] hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#7A1526] shrink-0" />
                <span>{isMarathi ? 'आपली गोपनीयता सुरक्षित' : 'Contact Privacy'}</span>
              </span>
            </div>

            {/* MOBILE / TABLET INLINE WEDDING COUPLE VISUAL (Natural wide landscape framing) */}
            {!heroImgError && (
              <div className="lg:hidden w-full max-w-lg sm:max-w-xl mx-auto pt-6 relative">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-xs border border-[#EAE0D2]/70 bg-gradient-to-b from-white to-[#FAF7F2]">
                  <img
                    src="/images/kadamvivah-hero-couple.webp"
                    alt={isMarathi ? "मराठा व देशमुख विवाह संस्कार" : "Maratha & Deshmukh Matrimony"}
                    className="w-full h-auto max-h-[380px] object-cover object-[center_12%]"
                    onError={(e) => {
                      if (e.currentTarget.src.endsWith('.webp')) {
                        e.currentTarget.src = '/images/kadamvivah-hero-couple.png';
                      } else {
                        setHeroImgError(true);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/25 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 2. Interactive Match Finder / Quick Search Bar */}
      <QuickMatchSearch />

      {/* 3. Latest Approved Brides & Grooms Section */}
      <section className="py-10 sm:py-14 lg:py-16 bg-[#FAF7F2] border-b border-[#EAE0D2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-[#EAE0D2]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] mb-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
                <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                  {isMarathi ? 'मंजूर वधू-वर स्थळे' : 'Approved Matrimonial Profiles'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#7A1526] tracking-tight">
                {isMarathi ? (
                  <span className="font-devanagari">नवीन स्थळे</span>
                ) : (
                  <span>Latest Profiles</span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4D45] mt-1">
                {isMarathi ? (
                  <span className="font-devanagari">मराठा व देशमुख समाजातील अलीकडे मंजूर झालेली स्थळे पहा.</span>
                ) : (
                  <span>Explore recently approved profiles from the Maratha & Deshmukh community.</span>
                )}
              </p>
            </div>

            <Link
              to="/profiles"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1526] hover:text-[#550E1B] bg-white px-5 py-2.5 rounded-full border border-[#D9C39E] shadow-2xs hover:shadow-xs transition-all self-start sm:self-auto shrink-0"
            >
              <span>{isMarathi ? 'सर्व स्थळे पहा →' : 'View All Profiles →'}</span>
            </Link>
          </div>

          {/* Conditional Profile Rendering */}
          {isAuthenticated() ? (
            <div>
              {loadingProfiles ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7A1526] mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground font-medium">
                    {isMarathi ? 'स्थळे लोड होत आहेत...' : 'Loading approved profiles...'}
                  </p>
                </div>
              ) : featuredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                  {featuredProfiles.map((p) => (
                    <ProfileCard key={p.id} profile={p} />
                  ))}
                </div>
              ) : (
                /* Authenticated Empty State */
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE0D2] p-8 max-w-xl mx-auto shadow-xs">
                  <div className="w-14 h-14 bg-[#FAF7F2] border border-[#D9C39E] rounded-2xl flex items-center justify-center mx-auto text-[#7A1526] mb-4 shadow-2xs">
                    <Users className="w-7 h-7 text-[#7A1526]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#7A1526] mb-2 font-serif">
                    {isMarathi ? 'सध्या नवीन मंजूर स्थळे उपलब्ध नाहीत.' : 'No new approved profiles are available right now.'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4D45] mb-5 max-w-md mx-auto leading-relaxed">
                    {isMarathi
                      ? 'कृपया थोड्या वेळाने पुन्हा तपासा किंवा आपले स्वतःचे प्रोफाइल पूर्ण करा.'
                      : 'Please check back soon or ensure your own matrimonial profile is complete.'}
                  </p>
                  <Link to="/my-profile">
                    <Button className="h-10 px-6 rounded-full bg-[#7A1526] hover:bg-[#600F1E] text-white text-xs sm:text-sm font-bold shadow-sm border border-[#962638]">
                      {isMarathi ? 'माझे प्रोफाइल पूर्ण करा' : 'Complete My Profile'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Experience: Privacy-First Matrimonial Biodata Previews + Integrated Unlock Panel */
            <div className="space-y-8 sm:space-y-10">
              {/* Privacy-Safe Substantial Silhouette Preview Cards (4 Cards Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#EAE0D2] hover:border-[#D4B896] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group"
                  >
                    {/* Substantial Silhouette Portrait Area */}
                    <div className="relative h-44 sm:h-48 lg:h-52 w-full bg-gradient-to-b from-[#F7F2EA] via-[#FAF7F2] to-[#EAE0D2]/60 flex flex-col items-center justify-center overflow-hidden">
                      {/* Top-Right Discreet Privacy Lock Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-full text-[11px] font-semibold text-[#7A1526] border border-[#E8DCB8] shadow-2xs">
                        <Lock className="w-3 h-3 text-[#7A1526]" />
                        <span>{isMarathi ? 'गोपनीय' : 'Private'}</span>
                      </div>

                      {/* Tasteful Anonymous Matrimonial Silhouette with Soft Glow */}
                      <div className="flex flex-col items-center justify-center text-[#BFAFA0] group-hover:text-[#A89888] transition-colors duration-200 mt-2">
                        <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-2xs" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="7.5" r="4.2" opacity="0.85" />
                          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" opacity="0.7" />
                        </svg>
                      </div>
                    </div>

                    {/* Protected Biodata Placeholder Area (Static, Deliberate Protected Lines - No Loading Pulse) */}
                    <div className="p-4 space-y-2.5 bg-white border-t border-[#EAE0D2]/70 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Protected Name Field */}
                        <div className="h-3.5 bg-[#EFE8DE] rounded-full w-3/4" />
                        {/* Protected Details / Location Field */}
                        <div className="h-2.5 bg-[#F4EFE7] rounded-full w-1/2" />
                        {/* Protected Profession / Education Field */}
                        <div className="h-2.5 bg-[#FAF7F2] border border-[#EAE0D2]/60 rounded-full w-2/3" />
                      </div>

                      {/* Card Footer: Community Badge & Protected Indicator */}
                      <div className="pt-3 border-t border-[#EAE0D2]/80 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#7A1526]">
                          {isMarathi ? 'मराठा व देशमुख समाज' : 'Maratha & Deshmukh'}
                        </span>
                        <span className="text-[#9E7B42] font-semibold flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EAE0D2]/80 text-[11px]">
                          <Lock className="w-3 h-3 text-[#7A1526]" />
                          <span>{isMarathi ? 'सुरक्षित' : 'Protected'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compact Integrated Registration & Unlock Panel */}
              <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-[#FAF7F2] to-[#F5EEE4] border border-[#D9C39E] rounded-2xl p-6 sm:p-8 text-center shadow-xs">
                <div className="w-11 h-11 bg-[#7A1526]/10 border border-[#D9C39E] rounded-xl flex items-center justify-center mx-auto text-[#7A1526] mb-3 shadow-2xs">
                  <Lock className="w-5 h-5 text-[#7A1526]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#7A1526] mb-1.5 font-serif">
                  {isMarathi ? (
                    <span className="font-devanagari">स्थळे पाहण्यासाठी विनामूल्य नोंदणी करा</span>
                  ) : (
                    <span>Create an Account to View Profiles</span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A3E39] leading-relaxed max-w-lg mx-auto mb-5">
                  {isMarathi ? (
                    <span className="font-devanagari">
                      सदस्यांची मूळ छायाचित्रे व संपूर्ण वैवाहिक बायोडाटा पाहण्यासाठी आजच विनामूल्य खाते तयार करा.
                    </span>
                  ) : (
                    <span>
                      Register free to view member photographs, education, occupation, and complete matrimonial profiles.
                    </span>
                  )}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-11 px-7 rounded-full bg-[#7A1526] hover:bg-[#600F1E] text-white text-xs sm:text-sm font-bold shadow-sm border border-[#962638] flex items-center justify-center gap-2">
                      <span>{isMarathi ? 'विनामूल्य नोंदणी करा' : 'Register Free'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 px-7 rounded-full border-[#D9C39E] text-[#7A1526] hover:bg-white text-xs sm:text-sm font-bold shadow-2xs">
                      {isMarathi ? 'आधीच खाते आहे? लॉगिन करा' : 'Already registered? Login'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. Dedicated Chhatrapati Shivaji Maharaj Heritage Section */}
      <ShivajiMaharajHeritage />

      {/* 5. Why KadamVivah & 6. How It Works */}
      <TrustPrivacyFeatures />

      {/* 7. Browse Profiles by Maharashtra Hubs (City Discovery) */}
      <CityDiscovery />

      {/* 8. Founder Section — Nitin Kadam */}
      <FounderSection />

      {/* 9. Final Registration CTA */}
      {!isAuthenticated() && (
        <section className="relative py-12 sm:py-16 bg-gradient-to-r from-[#7A1526] via-[#65101E] to-[#500D18] text-white overflow-hidden border-t border-[#962638]">
          {/* Subtle traditional cultural pattern overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(#FAF7F2 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
            aria-hidden="true"
          />

          {/* Ambient soft glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B88E4B]/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4 sm:space-y-5">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 backdrop-blur-xs border border-[#D9C39E]/30 rounded-full text-xs font-semibold text-[#D9C39E] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D9C39E]" />
              <span>{isMarathi ? 'विनामूल्य नोंदणी' : 'Free Registration'}</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              {isMarathi ? (
                <span className="font-devanagari">आपल्या जीवनातील नव्या प्रवासाची सुरुवात करा</span>
              ) : (
                <span>Begin a New Journey in Your Life</span>
              )}
            </h2>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D9C39E]" />
              <span className="text-[#D9C39E] text-xs">❖</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D9C39E]" />
            </div>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-sm lg:text-base text-[#F5EEE4] max-w-2xl mx-auto leading-relaxed">
              {isMarathi ? (
                <span className="font-devanagari">
                  मराठा व देशमुख समाजातील योग्य जीवनसाथीच्या शोधासाठी आजच विनामूल्य नोंदणी करा.
                </span>
              ) : (
                <span>
                  Create your free KadamVivah profile and begin your search for a suitable life partner within the Maratha & Deshmukh community.
                </span>
              )}
            </p>

            {/* Action Button */}
            <div className="pt-2">
              <Link to="/register" className="inline-block">
                <Button size="lg" className="h-12 px-8 rounded-full bg-[#FAF7F2] hover:bg-white text-[#7A1526] font-bold text-sm sm:text-base border border-[#D9C39E] hover:border-[#B88E4B] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                  <span>{isMarathi ? 'विनामूल्य नोंदणी करा →' : 'Register Free →'}</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
