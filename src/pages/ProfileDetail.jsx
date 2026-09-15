import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  HeartHandshake,
  Clock,
  XCircle,
  Phone,
  Mail,
  Send,
  UserCheck,
  Edit,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_AVATAR, handleImageError } from '../lib/avatarFallback';
import api from '../lib/api';
import dayjs from 'dayjs';

/**
 * ProfileDetail Page - Full profile view with real interest matching & contact privacy.
 * Fetches approved matrimonial profile from PHP REST API.
 */
export const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, ToastContainer } = useToast();
  
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
        showToast(error.response?.data?.message || 'Failed to load profile details', 'error');
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
      const response = await api.post('/interests', {
        receiver_profile_id: parseInt(id, 10),
        message: interestMessage.trim() || undefined
      });

      showToast('Interest request sent successfully!', 'success');
      setSendModalOpen(false);
      setInterestMessage('');

      // Refresh profile data to reflect new interest status
      fetchProfile();
    } catch (error) {
      console.error('Failed to send interest:', error);
      showToast(error.response?.data?.message || 'Failed to send interest request', 'error');
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
      const response = await api.post(`/interests/${interestId}/accept`);
      showToast('Interest accepted! Contact details unlocked.', 'success');
      setAcceptModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to accept interest:', error);
      showToast(error.response?.data?.message || 'Failed to accept interest', 'error');
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
      showToast('Interest request declined.', 'success');
      setDeclineModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to decline interest:', error);
      showToast(error.response?.data?.message || 'Failed to decline interest', 'error');
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
    if (!status) return 'Not Specified';
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-[70vh] bg-background py-16 px-4">
        <ToastContainer />
        <div className="max-w-md mx-auto text-center">
          <Card className="py-12 px-6">
            <CardContent className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Profile Not Found</h2>
              <p className="text-muted-foreground text-sm">
                This profile is either unavailable, pending approval, or does not exist.
              </p>
              <div className="pt-4">
                <Button onClick={() => navigate('/profiles')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profiles
                </Button>
              </div>
            </CardContent>
          </Card>
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
  const subCaste = profile.subCaste || profile.sub_caste;
  const maritalStatus = profile.maritalStatus || profile.marital_status;
  const fatherName = profile.fatherName || profile.father_name || profile.familyDetails?.fatherName;
  const motherName = profile.motherName || profile.mother_name || profile.familyDetails?.motherName;
  const siblings = profile.siblings || profile.familyDetails?.siblings;
  const familyType = profile.familyType || profile.family_type || profile.familyDetails?.familyType;
  const hasFamilyDetails = fatherName || motherName || siblings || familyType;

  const isOwnProfile = profile.is_own_profile || (user?.profile_id && user?.profile_id === profile.id);
  const isAdmin = user?.role === 'admin';
  const interestStatus = profile.interest_status || {};
  const hasInterest = interestStatus.has_interest;
  const interestDirection = interestStatus.direction;
  const currentInterestStatus = interestStatus.status;
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
    <div className="min-h-screen bg-background py-8">
      <ToastContainer />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/profiles')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profiles
          </Button>

          {/* Quick Match Status Indicator */}
          {isMatched && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-800 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Mutual Match Connected</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Photo Carousel & Primary Interest Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden sticky top-24 shadow-sm">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={photos[currentPhotoIndex]}
                  alt={fullName}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                  onError={handleImageError}
                />

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      disabled={currentPhotoIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 transition-all"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={nextPhoto}
                      disabled={currentPhotoIndex === photos.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full disabled:opacity-30 transition-all"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentPhotoIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                          aria-label={`Go to photo ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Action Bar Beneath Photo */}
              <div className="p-4 bg-white border-t border-gray-100">
                {isOwnProfile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">This is your profile</span>
                    <Link to="/my-profile">
                      <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                        <Edit className="w-3.5 h-3.5" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                ) : isAdmin ? (
                  <div className="p-3 bg-muted/60 border border-border rounded-lg text-xs text-muted-foreground flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Administrator View</span>
                    </div>
                    <Link to="/admin">
                      <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs">
                        Admin Panel
                      </Button>
                    </Link>
                  </div>
                ) : isMatched ? (
                  <div className="w-full text-center py-2 px-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs font-semibold flex items-center justify-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-green-600" />
                    Matched & Connected!
                  </div>
                ) : isSentPending ? (
                  <div className="w-full text-center py-2.5 px-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Interest Sent (Awaiting Response)
                  </div>
                ) : isReceivedPending ? (
                  <div className="space-y-2">
                    <p className="text-xs text-center font-medium text-gray-700">
                      This member sent you an interest request:
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setAcceptModalOpen(true)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Accept Interest
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeclineModalOpen(true)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ) : isDeclined ? (
                  <div className="w-full text-center py-2 px-3 bg-gray-100 rounded-lg text-gray-600 text-xs font-medium">
                    Interest request was declined.
                  </div>
                ) : canSendInterest ? (
                  <Button
                    onClick={() => setSendModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    Send Interest
                  </Button>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>Your profile is currently awaiting admin approval. You will be able to send interest once approved.</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Profile Information (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-3xl font-bold text-foreground">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-700 dark:text-green-400 font-medium px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Profile
                </span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground mt-2 text-sm">
                {age !== null && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {age} years
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.city}{profile.state ? `, ${profile.state}` : ''}
                </span>
              </div>
            </div>

            {/* UNLOCKED CONTACT DETAILS CARD (Displayed ONLY when mutual match or own profile) */}
            {profile.contact_unlocked && profile.contacts ? (
              <Card className="border-green-300 bg-green-50/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 text-green-900 font-bold text-base">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Verified Contact Details
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 bg-green-600 text-white rounded-full">
                      Mutual Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {profile.contacts.phone && (
                      <div className="p-3 bg-white rounded-lg border border-green-200 shadow-2xs">
                        <span className="text-xs text-gray-500 block mb-1">Primary Mobile Number</span>
                        <div className="flex items-center justify-between">
                          <a href={`tel:${profile.contacts.phone}`} className="font-bold text-gray-900 hover:text-green-700">
                            {profile.contacts.phone}
                          </a>
                          <a
                            href={`tel:${profile.contacts.phone}`}
                            className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                          >
                            Call
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.contacts.alternate_phone && (
                      <div className="p-3 bg-white rounded-lg border border-green-200 shadow-2xs">
                        <span className="text-xs text-gray-500 block mb-1">Alternate / WhatsApp Number</span>
                        <div className="flex items-center justify-between">
                          <a href={`tel:${profile.contacts.alternate_phone}`} className="font-bold text-gray-900 hover:text-green-700">
                            {profile.contacts.alternate_phone}
                          </a>
                          <a
                            href={`tel:${profile.contacts.alternate_phone}`}
                            className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
                          >
                            Call
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.contacts.contact_email && (
                      <div className="p-3 bg-white rounded-lg border border-green-200 shadow-2xs sm:col-span-2">
                        <span className="text-xs text-gray-500 block mb-1">Email Address</span>
                        <div className="flex items-center justify-between">
                          <a href={`mailto:${profile.contacts.contact_email}`} className="font-bold text-gray-900 hover:text-green-700 truncate mr-2">
                            {profile.contacts.contact_email}
                          </a>
                          <a
                            href={`mailto:${profile.contacts.contact_email}`}
                            className="px-2.5 py-0.5 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-medium rounded transition-colors flex-shrink-0"
                          >
                            Send Email
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* PRIVACY-PROTECTED CONTACT CARD */
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        Contact Information Protected
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Direct contact numbers and email are protected for member privacy. Express interest to connect and unlock mutual contact details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Basic Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Gender</dt>
                    <dd className="font-medium capitalize">{profile.gender === 'male' ? 'Male (पुरुष)' : profile.gender === 'female' ? 'Female (स्त्री)' : profile.gender}</dd>
                  </div>
                  {dob && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Date of Birth</dt>
                      <dd className="font-medium">{dayjs(dob).format('DD MMM YYYY')}</dd>
                    </div>
                  )}
                  {maritalStatus && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Marital Status</dt>
                      <dd className="font-medium">{formatMaritalStatus(maritalStatus)}</dd>
                    </div>
                  )}
                  {profile.height && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Height</dt>
                      <dd className="font-medium">{profile.height}</dd>
                    </div>
                  )}
                  {caste && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Caste</dt>
                      <dd className="font-medium">
                        {caste}
                        {subCaste && ` • ${subCaste}`}
                      </dd>
                    </div>
                  )}
                  {profile.gotra && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <dt className="text-muted-foreground">Gotra / Devak</dt>
                      <dd className="font-medium">{profile.gotra}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Education & Career */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Education & Career</h2>
                <div className="space-y-3">
                  {profile.education && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Education / Qualification</p>
                        <p className="font-medium">{profile.education}</p>
                      </div>
                    </div>
                  )}
                  {profile.occupation && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Occupation / Profession</p>
                        <p className="font-medium">{profile.occupation}</p>
                      </div>
                    </div>
                  )}
                  {profile.annualIncome && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Annual Income / Package</p>
                        <p className="font-medium">{profile.annualIncome}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Family Details */}
            {hasFamilyDetails && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family Details
                  </h2>
                  <dl className="space-y-3 text-sm">
                    {fatherName && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <dt className="text-muted-foreground">Father's Name</dt>
                        <dd className="font-medium">{fatherName}</dd>
                      </div>
                    )}
                    {motherName && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <dt className="text-muted-foreground">Mother's Name</dt>
                        <dd className="font-medium">{motherName}</dd>
                      </div>
                    )}
                    {siblings && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <dt className="text-muted-foreground">Siblings</dt>
                        <dd className="font-medium">{siblings}</dd>
                      </div>
                    )}
                    {familyType && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <dt className="text-muted-foreground">Family Type</dt>
                        <dd className="font-medium capitalize">{familyType}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Bio */}
            {profile.bio && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About the Candidate & Expectations</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{profile.bio}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Send Interest Modal */}
      {/* ========================================================================= */}
      {sendModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !sendLoading) {
              setSendModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-primary mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Send Interest</h3>
                <p className="text-xs text-gray-500">Connect with {fullName}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmSendInterest} className="space-y-4">
              <p className="text-sm text-gray-600">
                Express interest in connecting with <strong className="text-gray-900">{fullName}</strong>. Once they accept, verified direct contact numbers and email will be shared mutually.
              </p>

              <div>
                <Label htmlFor="interestMsg" className="text-xs font-semibold text-gray-700">
                  Optional Message (संदेश)
                </Label>
                <Textarea
                  id="interestMsg"
                  rows={3}
                  placeholder="e.g. Namaste! I found your profile very suitable and would like to connect with your family."
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  maxLength={500}
                  className="mt-1"
                  disabled={sendLoading}
                />
                <span className="text-xs text-gray-400 block mt-1 text-right">
                  {interestMessage.length}/500
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSendModalOpen(false)}
                  disabled={sendLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sendLoading}
                  className="flex items-center gap-2 font-medium"
                >
                  {sendLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Interest Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Accept Interest Modal */}
      {/* ========================================================================= */}
      {acceptModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !acceptLoading) {
              setAcceptModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-green-600 mb-4">
              <div className="p-2.5 bg-green-50 rounded-xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Accept Interest Request?</h3>
                <p className="text-xs text-gray-500">Mutual Connection on KadamVivah</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              You are about to accept the interest request from{' '}
              <strong className="text-gray-900 font-semibold">{fullName}</strong>.
            </p>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 mb-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                Upon accepting, your mutual contact numbers and email will become immediately visible to each other.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAcceptModalOpen(false)}
                disabled={acceptLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmAccept}
                disabled={acceptLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2"
              >
                {acceptLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Interest
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Decline Interest Modal */}
      {/* ========================================================================= */}
      {declineModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !declineLoading) {
              setDeclineModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Decline Interest Request?</h3>
                <p className="text-xs text-gray-500">Decline Match Invitation</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to decline the interest request from{' '}
              <strong className="text-gray-900 font-semibold">{fullName}</strong>?
            </p>

            <p className="text-xs text-gray-500 mb-6">
              Your contact details will remain private and will not be shared.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeclineModalOpen(false)}
                disabled={declineLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDecline}
                disabled={declineLoading}
                className="flex items-center gap-2"
              >
                {declineLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Declining...
                  </>
                ) : (
                  'Decline Interest'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
