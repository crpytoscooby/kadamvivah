import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  HeartHandshake, 
  Clock, 
  Phone, 
  Mail, 
  Send, 
  Edit, 
  RefreshCw, 
  AlertCircle,
  Sparkles,
  Award,
  Lock
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_AVATAR, handleImageError } from '../lib/avatarFallback';
import api from '../lib/api';
import dayjs from 'dayjs';

/**
 * ProfileDetail Page - Matrimonial Biodata View with Real Match & Privacy Logic
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) primary buttons & accents
 * - Antique Gold (#B88E4B) badges & highlights
 * - Approved Profile terminology (मंजूर प्रोफाइल)
 * - Strict Marathi & English single-language support
 * - Contact privacy strictly preserved until mutual match acceptance
 */

export const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Interest Action Modal States
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // Keyboard shortcut: Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!sendLoading && !acceptLoading && !declineLoading) {
          setSendModalOpen(false);
          setAcceptModalOpen(false);
          setDeclineModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendLoading, acceptLoading, declineLoading]);

  const fetchProfile = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const response = await api.get(`/profiles/${id}`);
      const data = response.data?.data;
      if (!data) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
      if (error.response?.status === 404) {
        setNotFound(true);
      } else {
        showToast(error.response?.data?.message || (isMarathi ? 'प्रोफाइल लोड करण्यात त्रुटी आली' : 'Failed to load profile details'), 'error');
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Send Interest
  const handleConfirmSendInterest = async (e) => {
    e.preventDefault();
    if (sendLoading) return;

    setSendLoading(true);
    try {
      await api.post('/interests', {
        receiver_profile_id: parseInt(id, 10),
        message: interestMessage.trim() || undefined
      });

      showToast(isMarathi ? 'स्थळास पसंतीची विनंती पाठवली!' : 'Interest request sent successfully!', 'success');
      setSendModalOpen(false);
      setInterestMessage('');
      fetchProfile();
    } catch (error) {
      console.error('Failed to send interest:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'पसंतीची विनंती पाठवण्यात त्रुटी आली' : 'Failed to send interest request'), 'error');
    } finally {
      setSendLoading(false);
    }
  };

  // Handle Accept Interest
  const handleConfirmAccept = async () => {
    const interestId = profile?.interest_status?.interest_id;
    if (!interestId || acceptLoading) return;

    setAcceptLoading(true);
    try {
      await api.post(`/interests/${interestId}/accept`);
      showToast(isMarathi ? 'विनंती स्वीकारली! संपर्क माहिती अनलॉक झाली.' : 'Interest accepted! Contact details unlocked.', 'success');
      setAcceptModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to accept interest:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'विनंती स्वीकारण्यात त्रुटी आली' : 'Failed to accept interest'), 'error');
    } finally {
      setAcceptLoading(false);
    }
  };

  // Handle Decline Interest
  const handleConfirmDecline = async () => {
    const interestId = profile?.interest_status?.interest_id;
    if (!interestId || declineLoading) return;

    setDeclineLoading(true);
    try {
      await api.post(`/interests/${interestId}/reject`);
      showToast(isMarathi ? 'विनंती नाकारली.' : 'Interest request declined.', 'success');
      setDeclineModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to decline interest:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'विनंती नाकारण्यात त्रुटी आली' : 'Failed to decline interest'), 'error');
    } finally {
      setDeclineLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const years = dayjs().diff(dayjs(dob), 'year');
    return isNaN(years) ? null : years;
  };

  const formatMaritalStatus = (status) => {
    if (!status) return isMarathi ? 'नोंद नाही' : 'Not Specified';
    if (isMarathi) {
      if (status === 'never_married') return 'अविवाहित';
      if (status === 'divorced') return 'घटस्फोटित';
      if (status === 'widowed') return 'विधुर / विधवा';
      if (status === 'separated') return 'विभक्त';
    }
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#7A1526] border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-[#7A6E65] font-medium">
            {isMarathi ? 'प्रोफाइल लोड होत आहे...' : 'Loading profile details...'}
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] py-16 px-4 flex items-center justify-center relative overflow-hidden">
        <ToastContainer />
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-sm">
          <div className="w-14 h-14 bg-[#F8F3EA] border border-[#D9C39E] rounded-full flex items-center justify-center mx-auto text-[#7A1526] mb-4 shadow-2xs">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#2B1B17] mb-2">
            {isMarathi ? 'प्रोफाइल आढळले नाही' : 'Profile Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E55] mb-6">
            {isMarathi 
              ? 'हे प्रोफाइल सध्या उपलब्ध नाही, मंजुरीच्या प्रतीक्षेत आहे किंवा अस्तित्वात नाही.'
              : 'This profile is either unavailable, pending approval, or does not exist.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/profiles')}
            className="px-6 py-2.5 bg-[#7A1526] hover:bg-[#8F1024] text-white font-semibold text-xs sm:text-sm rounded-xl transition inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isMarathi ? 'सर्व स्थळे पहा' : 'Back to Profiles'}</span>
          </button>
        </div>
      </div>
    );
  }

  const dob = profile.dob || profile.date_of_birth;
  const age = calculateAge(dob);
  const firstName = profile.firstName || profile.first_name || '';
  const middleName = profile.middleName || profile.middle_name || '';
  const lastName = profile.lastName || profile.last_name || '';
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
  const caste = profile.caste;
  const maritalStatus = profile.maritalStatus || profile.marital_status;
  const fatherName = profile.fatherName || profile.father_name || profile.familyDetails?.fatherName;
  const motherName = profile.motherName || profile.mother_name || profile.familyDetails?.motherName;
  const siblings = profile.siblings || profile.familyDetails?.siblings;
  const familyType = profile.familyType || profile.family_type || profile.familyDetails?.familyType;
  const hasFamilyDetails = fatherName || motherName || siblings || familyType;

  const isOwnProfile = profile.is_own_profile || (user?.profile_id && user?.profile_id === profile.id);
  const isAdmin = user?.role === 'admin';
  const interestStatus = profile.interest_status || {};
  const currentInterestStatus = interestStatus.status;
  const interestDirection = interestStatus.direction;
  const isMatched = currentInterestStatus === 'accepted';
  const isSentPending = interestDirection === 'sent' && currentInterestStatus === 'pending';
  const isReceivedPending = interestDirection === 'received' && currentInterestStatus === 'pending';
  const isDeclined = currentInterestStatus === 'declined';
  const canSendInterest = Boolean(interestStatus.can_send || user?.profile_status === 'approved');

  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : (profile.primary_photo ? [profile.primary_photo] : [DEFAULT_AVATAR]);

  const nextPhoto = () => {
    if (photos && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ToastContainer />

      {/* Subtle background ambient pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(#7A1526 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAE0D2]">
          <button
            type="button"
            onClick={() => navigate('/profiles')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2D8CC] hover:border-[#7A1526] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1B17] transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#7A1526]" />
            <span>{isMarathi ? 'सर्व स्थळे पहा' : 'Back to Profiles'}</span>
          </button>

          {/* Quick Match Status Indicator */}
          {isMatched && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F4F9F4] border border-[#CDE4CD] text-green-800 rounded-full text-xs font-semibold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{isMarathi ? 'परस्पर पसंती जुळली (Mutual Match)' : 'Mutual Match Connected'}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Photo Carousel & Primary Interest Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm sticky top-24">
              
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
                <img
                  src={photos[currentPhotoIndex]}
                  alt={fullName}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  onError={handleImageError}
                />

                {/* Approved Profile Badge over photo */}
                <div className="absolute top-3 left-3 bg-[#7A1526]/90 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full shadow flex items-center gap-1.5 border border-[#D9C39E]/50">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
                  <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans'}>
                    {isMarathi ? 'मंजूर प्रोफाइल' : 'Approved Profile'}
                  </span>
                </div>

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      disabled={currentPhotoIndex === 0}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-20 transition-all cursor-pointer"
                      aria-label={isMarathi ? 'मागील फोटो' : 'Previous photo'}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={nextPhoto}
                      disabled={currentPhotoIndex === photos.length - 1}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-20 transition-all cursor-pointer"
                      aria-label={isMarathi ? 'पुढील फोटो' : 'Next photo'}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            index === currentPhotoIndex
                              ? 'bg-[#B88E4B] w-5'
                              : 'bg-white/60 hover:bg-white w-1.5'
                          }`}
                          aria-label={`Photo ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Action Bar Beneath Photo */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#EAE0D2]/70">
                {isOwnProfile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#7A6E65]">
                      {isMarathi ? 'हे आपले स्वतःचे प्रोफाइल आहे' : 'This is your profile'}
                    </span>
                    <Link
                      to="/my-profile"
                      className="px-4 py-2 bg-[#7A1526] hover:bg-[#8F1024] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-2xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isMarathi ? 'माहिती बदला' : 'Edit Profile'}</span>
                    </Link>
                  </div>
                ) : isAdmin ? (
                  <div className="p-3 bg-[#FAF7F2] border border-[#EAE0D2] rounded-xl text-xs text-[#7A6E65] flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-[#2B1B17]">
                      <ShieldCheck className="w-4 h-4 text-[#7A1526] shrink-0" />
                      <span>{isMarathi ? 'प्रशासक दृश्य' : 'Administrator View'}</span>
                    </div>
                    <Link
                      to="/admin"
                      className="px-3 py-1 bg-white border border-[#E2D8CC] rounded-lg text-xs font-semibold text-[#7A1526] hover:bg-[#FAF7F2] transition"
                    >
                      {isMarathi ? 'ॲडमिन पॅनेल' : 'Admin Panel'}
                    </Link>
                  </div>
                ) : isMatched ? (
                  <div className="w-full text-center py-2.5 px-3 bg-[#F4F9F4] border border-[#CDE4CD] rounded-xl text-green-800 text-xs font-bold flex items-center justify-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-green-600" />
                    <span>{isMarathi ? 'परस्पर पसंती जुळली! संपर्क खाली पहा' : 'Matched & Connected!'}</span>
                  </div>
                ) : isSentPending ? (
                  <div className="w-full text-center py-2.5 px-3 bg-[#FFFBF2] border border-[#E9D8B4] rounded-xl text-[#7A5416] text-xs font-semibold flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-[#B88E4B]" />
                    <span>{isMarathi ? 'पसंतीची विनंती पाठवली आहे (प्रतीक्षेत)' : 'Interest Sent (Awaiting Response)'}</span>
                  </div>
                ) : isReceivedPending ? (
                  <div className="space-y-2.5">
                    <p className="text-xs text-center font-medium text-[#2B1B17]">
                      {isMarathi ? 'या सभासदाने आपल्याला पसंतीची विनंती पाठवली आहे:' : 'This member sent you an interest request:'}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAcceptModalOpen(true)}
                        className="flex-1 py-2.5 px-3 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isMarathi ? 'स्वीकारा' : 'Accept Interest'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeclineModalOpen(true)}
                        className="py-2.5 px-3 bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        <span>{isMarathi ? 'नाकारा' : 'Decline'}</span>
                      </button>
                    </div>
                  </div>
                ) : isDeclined ? (
                  <div className="w-full text-center py-2 px-3 bg-[#FAF7F2] rounded-xl text-[#7A6E65] text-xs font-medium border border-[#EAE0D2]">
                    {isMarathi ? 'पसंतीची विनंती नाकारली गेली आहे.' : 'Interest request was declined.'}
                  </div>
                ) : canSendInterest ? (
                  <button
                    type="button"
                    onClick={() => setSendModalOpen(true)}
                    className="w-full py-3 px-4 bg-[#7A1526] hover:bg-[#8F1024] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer active:scale-[0.99]"
                  >
                    <Heart className="w-4 h-4 fill-current text-[#D9C39E]" />
                    <span>{isMarathi ? 'पसंती कळवा (Send Interest)' : 'Send Interest'}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-[#FFFBF2] border border-[#E9D8B4] rounded-xl text-xs text-[#7A5416] flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#B88E4B] shrink-0 mt-0.5" />
                    <span>
                      {isMarathi
                        ? 'आपले प्रोफाइल सध्या ॲडमिन मंजुरीच्या प्रतीक्षेत आहे. मंजुरीनंतर आपण पसंती पाठवू शकाल.'
                        : 'Your profile is currently awaiting admin approval. You will be able to send interest once approved.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Biodata Sections (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Candidate Header */}
            <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1B17]">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs bg-[#F8F3EA] border border-[#D9C39E] text-[#7A1526] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88E4B]" />
                  <span>{isMarathi ? 'मंजूर प्रोफाइल' : 'Approved Profile'}</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-[#6B5E55] text-xs sm:text-sm flex-wrap">
                {age !== null && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-[#7A1526]" />
                    <span>{age} {isMarathi ? 'वर्षे' : 'years'}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#7A1526]" />
                  <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
                </span>
                {caste && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Award className="w-4 h-4 text-[#B88E4B]" />
                    <span>{caste}</span>
                  </span>
                )}
              </div>
            </div>

            {/* UNLOCKED CONTACT DETAILS CARD (Displayed ONLY when mutual match or own profile) */}
            {profile.contact_unlocked && profile.contacts ? (
              <div className="bg-[#F4F9F4] border border-[#CDE4CD] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-green-900 font-serif font-bold text-base sm:text-lg">
                    <ShieldCheck className="w-5 h-5 text-green-700 shrink-0" />
                    <span>{isMarathi ? 'थेट संपर्क माहिती (अनलॉक)' : 'Unlocked Contact Details'}</span>
                  </div>
                  <span className="text-xs font-semibold px-3 py-0.5 bg-green-700 text-white rounded-full">
                    {isMarathi ? 'परस्पर पसंती' : 'Mutual Match'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                  {profile.contacts.phone && (
                    <div className="p-3.5 bg-white rounded-xl border border-green-200 shadow-2xs">
                      <span className="text-xs text-[#7A6E65] block mb-1">
                        {isMarathi ? 'प्राथमिक मोबाईल क्रमांक' : 'Primary Mobile Number'}
                      </span>
                      <div className="flex items-center justify-between">
                        <a href={`tel:${profile.contacts.phone}`} className="font-bold text-[#2B1B17] hover:text-green-800 text-sm sm:text-base">
                          {profile.contacts.phone}
                        </a>
                        <a
                          href={`tel:${profile.contacts.phone}`}
                          className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-lg transition"
                        >
                          {isMarathi ? 'कॉल करा' : 'Call'}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.contacts.alternate_phone && (
                    <div className="p-3.5 bg-white rounded-xl border border-green-200 shadow-2xs">
                      <span className="text-xs text-[#7A6E65] block mb-1">
                        {isMarathi ? 'पर्यायी / व्हॉट्सॲप क्रमांक' : 'Alternate / WhatsApp Number'}
                      </span>
                      <div className="flex items-center justify-between">
                        <a href={`tel:${profile.contacts.alternate_phone}`} className="font-bold text-[#2B1B17] hover:text-green-800 text-sm sm:text-base">
                          {profile.contacts.alternate_phone}
                        </a>
                        <a
                          href={`tel:${profile.contacts.alternate_phone}`}
                          className="px-3 py-1 bg-[#FAF7F2] border border-[#E2D8CC] text-[#2B1B17] hover:bg-white text-xs font-bold rounded-lg transition"
                        >
                          {isMarathi ? 'कॉल' : 'Call'}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.contacts.contact_email && (
                    <div className="p-3.5 bg-white rounded-xl border border-green-200 shadow-2xs sm:col-span-2">
                      <span className="text-xs text-[#7A6E65] block mb-1">
                        {isMarathi ? 'ईमेल पत्ता' : 'Email Address'}
                      </span>
                      <div className="flex items-center justify-between">
                        <a href={`mailto:${profile.contacts.contact_email}`} className="font-bold text-[#2B1B17] hover:text-green-800 truncate mr-2 text-sm sm:text-base">
                          {profile.contacts.contact_email}
                        </a>
                        <a
                          href={`mailto:${profile.contacts.contact_email}`}
                          className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-900 text-xs font-bold rounded-lg transition shrink-0"
                        >
                          {isMarathi ? 'ईमेल पाठवा' : 'Send Email'}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* PRIVACY-PROTECTED CONTACT CARD */
              <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0 mt-0.5">
                    <Lock className="w-5 h-5 text-[#7A1526]" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#2B1B17] mb-1">
                      {isMarathi ? 'संपर्क माहिती गोपनीयतेखाली संरक्षित' : 'Contact Information Protected'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
                      {isMarathi
                        ? 'सभासदांच्या गोपनीयतेसाठी थेट मोबाईल क्रमांक आणि ईमेल संरक्षित ठेवले आहेत. पसंतीची विनंती पाठवा; ती स्वीकारल्यानंतर दोन्ही बाजूंचे संपर्क अनलॉक होतात.'
                        : 'Direct contact numbers and email are protected for member privacy. Express interest to connect and unlock mutual contact details.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section: Personal Details */}
            <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17] mb-4 pb-3 border-b border-[#EAE0D2]/70">
                {isMarathi ? 'वैयक्तिक माहिती' : 'Personal Details'}
              </h2>
              
              <dl className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                  <dt className="text-[#7A6E65]">{isMarathi ? 'लिंग' : 'Gender'}</dt>
                  <dd className="font-semibold text-[#2B1B17] capitalize">
                    {profile.gender === 'male' ? (isMarathi ? 'वर (पुरुष)' : 'Male') : profile.gender === 'female' ? (isMarathi ? 'वधू (स्त्री)' : 'Female') : profile.gender}
                  </dd>
                </div>

                {dob && (
                  <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                    <dt className="text-[#7A6E65]">{isMarathi ? 'जन्मतारीख' : 'Date of Birth'}</dt>
                    <dd className="font-semibold text-[#2B1B17]">{dayjs(dob).format('DD MMMM YYYY')}</dd>
                  </div>
                )}

                {maritalStatus && (
                  <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                    <dt className="text-[#7A6E65]">{isMarathi ? 'वैवाहिक स्थिती' : 'Marital Status'}</dt>
                    <dd className="font-semibold text-[#2B1B17]">{formatMaritalStatus(maritalStatus)}</dd>
                  </div>
                )}

                {profile.height && (
                  <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                    <dt className="text-[#7A6E65]">{isMarathi ? 'उंची' : 'Height'}</dt>
                    <dd className="font-semibold text-[#2B1B17]">{profile.height}</dd>
                  </div>
                )}

                {caste && (
                  <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                    <dt className="text-[#7A6E65]">{isMarathi ? 'समाज' : 'Community'}</dt>
                    <dd className="font-semibold text-[#2B1B17]">{caste}</dd>
                  </div>
                )}

                {profile.gotra && (
                  <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                    <dt className="text-[#7A6E65]">{isMarathi ? 'गोत्र / देवक' : 'Gotra / Devak'}</dt>
                    <dd className="font-semibold text-[#2B1B17]">{profile.gotra}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Section: Education & Career */}
            <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17] mb-4 pb-3 border-b border-[#EAE0D2]/70">
                {isMarathi ? 'शिक्षण आणि व्यवसाय' : 'Education & Career'}
              </h2>

              <div className="space-y-4">
                {profile.education && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4 text-[#7A1526]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#7A6E65]">{isMarathi ? 'शैक्षणिक पात्रता' : 'Education / Qualification'}</p>
                      <p className="font-semibold text-[#2B1B17] text-sm sm:text-base mt-0.5">{profile.education}</p>
                    </div>
                  </div>
                )}

                {profile.occupation && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4 text-[#7A1526]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#7A6E65]">{isMarathi ? 'व्यवसाय / नोकरी' : 'Occupation / Profession'}</p>
                      <p className="font-semibold text-[#2B1B17] text-sm sm:text-base mt-0.5">{profile.occupation}</p>
                    </div>
                  </div>
                )}

                {profile.annualIncome && (
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0 mt-0.5">
                      <Award className="w-4 h-4 text-[#B88E4B]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#7A6E65]">{isMarathi ? 'वार्षिक उत्पन्न' : 'Annual Income / Package'}</p>
                      <p className="font-semibold text-[#2B1B17] text-sm sm:text-base mt-0.5">{profile.annualIncome}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Family Details */}
            {hasFamilyDetails && (
              <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17] mb-4 pb-3 border-b border-[#EAE0D2]/70 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#7A1526]" />
                  <span>{isMarathi ? 'कौटुंबिक माहिती' : 'Family Details'}</span>
                </h2>

                <dl className="space-y-3 text-xs sm:text-sm">
                  {fatherName && (
                    <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                      <dt className="text-[#7A6E65]">{isMarathi ? 'वडिलांचे नाव' : "Father's Name"}</dt>
                      <dd className="font-semibold text-[#2B1B17]">{fatherName}</dd>
                    </div>
                  )}
                  {motherName && (
                    <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                      <dt className="text-[#7A6E65]">{isMarathi ? 'आईचे नाव' : "Mother's Name"}</dt>
                      <dd className="font-semibold text-[#2B1B17]">{motherName}</dd>
                    </div>
                  )}
                  {siblings && (
                    <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                      <dt className="text-[#7A6E65]">{isMarathi ? 'भावंडे' : 'Siblings'}</dt>
                      <dd className="font-semibold text-[#2B1B17]">{siblings}</dd>
                    </div>
                  )}
                  {familyType && (
                    <div className="flex justify-between py-2 border-b border-[#EAE0D2]/50">
                      <dt className="text-[#7A6E65]">{isMarathi ? 'कुटुंब प्रकार' : 'Family Type'}</dt>
                      <dd className="font-semibold text-[#2B1B17] capitalize">
                        {familyType === 'nuclear' ? (isMarathi ? 'विभक्त' : 'Nuclear') : familyType === 'joint' ? (isMarathi ? 'एकत्र' : 'Joint') : familyType}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Section: Bio & Expectations */}
            {profile.bio && (
              <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17] mb-3 pb-3 border-b border-[#EAE0D2]/70">
                  {isMarathi ? 'उमेदवाराबद्दल व जोडीदाराकडून अपेक्षा' : 'About Candidate & Expectations'}
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Interest Modal */}
      {sendModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !sendLoading) {
              setSendModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#F8F3EA] border border-[#D9C39E] rounded-xl text-[#7A1526]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? 'पसंतीची विनंती पाठवा' : 'Send Interest'}
                </h3>
                <p className="text-xs text-[#7A6E65]">{fullName}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmSendInterest} className="space-y-4">
              <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
                {isMarathi ? (
                  <>
                    <strong className="text-[#2B1B17]">{fullName}</strong> यांच्या प्रोफाइलला पसंती कळवा. विनंती स्वीकारल्यानंतर थेट संपर्क क्रमांक व ईमेल दोन्ही बाजूंस अनलॉक होईल.
                  </>
                ) : (
                  <>
                    Express interest in connecting with <strong className="text-[#2B1B17]">{fullName}</strong>. Once accepted, contact details will be shared mutually.
                  </>
                )}
              </p>

              <div>
                <label htmlFor="interestMsg" className="block text-xs font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'संदेश (ऐच्छिक)' : 'Optional Message'}
                </label>
                <textarea
                  id="interestMsg"
                  rows={3}
                  placeholder={
                    isMarathi
                      ? 'उदा. नमस्ते! आम्हाला आपले प्रोफाइल योग्य वाटले असून आपल्या कुटुंबाशी चर्चा करण्याची इच्छा आहे.'
                      : 'e.g. Namaste! I found your profile very suitable and would like to connect with your family.'
                  }
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  maxLength={500}
                  className="w-full p-3 text-xs sm:text-sm border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                  disabled={sendLoading}
                />
                <span className="text-[11px] text-[#A89D91] block mt-1 text-right">
                  {interestMessage.length}/500
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSendModalOpen(false)}
                  disabled={sendLoading}
                  className="px-4 py-2 border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  {isMarathi ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={sendLoading}
                  className="px-5 py-2 bg-[#7A1526] hover:bg-[#8F1024] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {sendLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isMarathi ? 'पाठवत आहे...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isMarathi ? 'विनंती पाठवा' : 'Send Interest Request'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accept Interest Modal */}
      {acceptModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !acceptLoading) {
              setAcceptModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#F4F9F4] border border-[#CDE4CD] rounded-xl text-green-700">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? 'पसंतीची विनंती स्वीकारायची आहे का?' : 'Accept Interest Request?'}
                </h3>
                <p className="text-xs text-[#7A6E65]">{fullName}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5E55] mb-4 leading-relaxed">
              {isMarathi ? (
                <>
                  आपण <strong className="text-[#2B1B17]">{fullName}</strong> यांची पसंती विनंती स्वीकारत आहात.
                </>
              ) : (
                <>
                  You are about to accept the interest request from <strong className="text-[#2B1B17]">{fullName}</strong>.
                </>
              )}
            </p>

            <div className="p-3 bg-[#F4F9F4] border border-[#CDE4CD] rounded-xl text-xs text-green-900 mb-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
              <span>
                {isMarathi
                  ? 'स्वीकृतीनंतर दोन्ही बाजूंचे थेट संपर्क क्रमांक व ईमेल त्वरित दृश्यमान होतील.'
                  : 'Upon accepting, your mutual contact numbers and email will become immediately visible to each other.'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAcceptModalOpen(false)}
                disabled={acceptLoading}
                className="px-4 py-2 border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {isMarathi ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                disabled={acceptLoading}
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {acceptLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isMarathi ? 'स्वीकारत आहे...' : 'Accepting...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isMarathi ? 'होय, स्वीकारा' : 'Accept Interest'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Interest Modal */}
      {declineModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !declineLoading) {
              setDeclineModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#FDF2F2] border border-[#F5C2C7] rounded-xl text-[#9E1B32]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? 'विनंती नाकारायची आहे का?' : 'Decline Interest Request?'}
                </h3>
                <p className="text-xs text-[#7A6E65]">{fullName}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5E55] mb-4 leading-relaxed">
              {isMarathi ? (
                <>
                  आपण <strong className="text-[#2B1B17]">{fullName}</strong> यांची पसंती विनंती नाकारू इच्छिता का?
                </>
              ) : (
                <>
                  Are you sure you want to decline the interest request from <strong className="text-[#2B1B17]">{fullName}</strong>?
                </>
              )}
            </p>

            <p className="text-xs text-[#7A6E65] mb-6">
              {isMarathi
                ? 'आपली संपर्क माहिती पूर्णपणे सुरक्षित राहील आणि कोणालाही दिसणार नाही.'
                : 'Your contact details will remain private and will not be shared.'}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                disabled={declineLoading}
                className="px-4 py-2 border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {isMarathi ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={declineLoading}
                className="px-5 py-2 bg-[#9E1B32] hover:bg-[#7A1526] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {declineLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isMarathi ? 'नाकारत आहे...' : 'Declining...'}</span>
                  </>
                ) : (
                  <span>{isMarathi ? 'होय, नाकारा' : 'Decline Interest'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
