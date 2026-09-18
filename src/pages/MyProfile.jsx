import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { handleImageError } from '../lib/avatarFallback';
import api from '../lib/api';
import {
  User,
  Camera,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  Star,
  Upload,
  Save,
  Phone,
  MapPin,
  GraduationCap,
  Users,
  Heart,
  ExternalLink,
  Send,
  Sparkles,
  ShieldCheck,
  FileText,
  ChevronDown
} from 'lucide-react';

/**
 * MyProfile Page - Authenticated Matrimonial Profile Management & Onboarding
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) primary buttons & accents
 * - Antique Gold (#B88E4B) badges & highlights
 * - Warm borders (#EAE0D2) & structured section cards
 * - Strict Marathi & English single-language support
 * - Preserved all profile status, approval, photo upload, and validation workflows
 */

export const MyProfile = () => {
  const { user, verifySession } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittingForReview, setSubmittingForReview] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState(null);
  const [loadedUserId, setLoadedUserId] = useState(null);

  const [profileData, setProfileData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'male',
    dob: '',
    maritalStatus: 'never_married',
    height: '',
    city: '',
    district: '',
    state: 'Maharashtra',
    pincode: '',
    caste: '',
    subCaste: '',
    gotra: '',
    education: '',
    occupation: '',
    annualIncome: '',
    familyType: '',
    fatherName: '',
    motherName: '',
    siblings: '',
    phone: '',
    alternatePhone: '',
    contactEmail: '',
    bio: '',
    hobbies: ''
  });

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/profile/me');
      const data = response.data?.data;
      if (data) {
        setProfileData(data);
        setLoadedUserId(data.user_id || data.userId || user?.id);
        setPhotos(data.photos || []);

        setFormData({
          firstName: data.firstName || data.first_name || '',
          middleName: data.middleName || data.middle_name || '',
          lastName: data.lastName || data.last_name || '',
          gender: data.gender || 'male',
          dob: data.dob || data.date_of_birth || '',
          maritalStatus: data.maritalStatus || data.marital_status || 'never_married',
          height: data.height || '',
          city: data.city || '',
          district: data.district || '',
          state: data.state || 'Maharashtra',
          pincode: data.pincode || '',
          caste: data.caste || '',
          subCaste: data.subCaste || data.sub_caste || '',
          gotra: data.gotra || '',
          education: data.education || '',
          occupation: data.occupation || '',
          annualIncome: data.annualIncome || data.annual_income || '',
          familyType: data.familyType || data.family_type || '',
          fatherName: data.fatherName || data.father_name || data.familyDetails?.fatherName || '',
          motherName: data.motherName || data.mother_name || data.familyDetails?.motherName || '',
          siblings: data.siblings || data.familyDetails?.siblings || '',
          phone: data.phone || '',
          alternatePhone: data.alternatePhone || data.alternate_phone || '',
          contactEmail: data.contactEmail || data.contact_email || '',
          bio: data.bio || '',
          hobbies: data.hobbies || ''
        });
      }
    } catch (error) {
      console.error('Failed to load my profile:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'प्रोफाइल लोड करण्यात त्रुटी आली' : 'Failed to load profile details'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const verifyCurrentSession = async () => {
    const currentActiveUser = await verifySession();
    if (!currentActiveUser) {
      showToast(isMarathi ? 'आपले सत्र संपले आहे. कृपया पुन्हा लॉगिन करा.' : 'Your session has expired. Please log in again.', 'error');
      return false;
    }
    if (loadedUserId && currentActiveUser.id !== loadedUserId) {
      showToast(isMarathi ? 'खाते दुसऱ्या टॅबमध्ये बदलले आहे. कृपया रीफ्रेश करा.' : 'Your active account changed in another tab. Please refresh before continuing.', 'error');
      return false;
    }
    return true;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = isMarathi ? 'पहिले नाव आवश्यक आहे' : 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = isMarathi ? 'आडनाव आवश्यक आहे' : 'Last name is required';
    if (!formData.dob) newErrors.dob = isMarathi ? 'जन्मतारीख आवश्यक आहे' : 'Date of birth is required';
    if (!formData.city.trim()) newErrors.city = isMarathi ? 'शहर आवश्यक आहे' : 'City is required';
    if (!formData.caste.trim()) newErrors.caste = isMarathi ? 'जात आवश्यक आहे' : 'Caste is required';
    if (!formData.education.trim()) newErrors.education = isMarathi ? 'शिक्षण आवश्यक आहे' : 'Education is required';
    if (!formData.occupation.trim()) newErrors.occupation = isMarathi ? 'व्यवसाय आवश्यक आहे' : 'Occupation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!await verifyCurrentSession()) return;

    if (!validate()) {
      showToast(isMarathi ? 'कृपया आवश्यक फील्ड भरा' : 'Please fill all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const familyDetails = {
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        siblings: formData.siblings
      };

      const payload = {
        ...formData,
        familyDetails
      };

      const response = await api.put('/profile/me', payload);
      const updatedData = response.data?.data;
      if (updatedData) {
        setProfileData(updatedData);
      }
      showToast(isMarathi ? 'प्रोफाइल यशस्वीरित्या सेव्ह केले!' : 'Profile details saved successfully!', 'success');
    } catch (error) {
      console.error('Save profile error:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'प्रोफाइल सेव्ह करण्यात त्रुटी आली' : 'Failed to save profile changes'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!await verifyCurrentSession()) return;

    if (!validate()) {
      showToast(isMarathi ? 'कृपया रिव्ह्यूसाठी सबमिट करण्यापूर्वी आवश्यक माहिती भरा.' : 'Please complete all required fields before submitting for review.', 'error');
      return;
    }

    if (photos.length === 0) {
      showToast(isMarathi ? 'कृपया ॲडमिन मंजुरीसाठी प्रोफाइल सबमिट करण्यापूर्वी किमान एक फोटो अपलोड करा.' : 'Please upload at least one profile photo before submitting for admin review.', 'error');
      return;
    }

    setSubmittingForReview(true);
    try {
      // Save any pending changes first
      const familyDetails = {
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        siblings: formData.siblings
      };

      await api.put('/profile/me', { ...formData, familyDetails });

      // Submit for review
      const response = await api.post('/profile/submit-review');
      const updatedData = response.data?.data;
      if (updatedData) {
        setProfileData(updatedData);
      } else {
        setProfileData((prev) => ({ ...prev, status: 'pending_approval' }));
      }
      showToast(isMarathi ? 'प्रोफाइल ॲडमिन रिव्ह्यूसाठी सबमिट झाले!' : 'Profile submitted for admin review successfully!', 'success');
    } catch (error) {
      console.error('Submit for review error:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'रिव्ह्यू सबमिशन अयशस्वी' : 'Failed to submit profile for review'), 'error');
    } finally {
      setSubmittingForReview(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    if (!await verifyCurrentSession()) return;

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast(isMarathi ? 'फोटोचा आकार ५MB पेक्षा कमी असावा.' : 'Photo size should be less than 5MB.', 'error');
      return;
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast(isMarathi ? 'कृपया JPEG, PNG किंवा WebP फॉरमॅटमधील फोटो अपलोड करा.' : 'Please upload a JPEG, PNG, or WebP image.', 'error');
      return;
    }

    setUploadingPhoto(true);
    const uploadFormData = new FormData();
    uploadFormData.append('photo', file);

    try {
      const response = await api.post('/profile/photos', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newPhoto = response.data?.data;
      if (newPhoto) {
        setPhotos((prev) => [...prev, newPhoto]);
        showToast(isMarathi ? 'फोटो यशस्वीरित्या अपलोड झाला!' : 'Photo uploaded successfully!', 'success');
      } else {
        await fetchMyProfile();
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Upload photo error:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'फोटो अपलोड अयशस्वी' : 'Failed to upload photo'), 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!await verifyCurrentSession()) return;

    if (!window.confirm(isMarathi ? 'तुम्हाला हा फोटो नक्की हटवायचा आहे का?' : 'Are you sure you want to delete this photo?')) return;

    setDeletingPhotoId(photoId);
    try {
      await api.delete(`/profile/photos/${photoId}`);
      setPhotos((prev) => {
        const filtered = prev.filter((p) => p.id !== photoId);
        const hadPrimary = filtered.some((p) => p.is_primary || p.isPrimary);
        if (!hadPrimary && filtered.length > 0) {
          filtered[0].is_primary = true;
          filtered[0].isPrimary = true;
        }
        return filtered;
      });
      showToast(isMarathi ? 'फोटो हटवला.' : 'Photo deleted successfully.', 'success');
    } catch (error) {
      console.error('Delete photo error:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'फोटो हटवण्यात त्रुटी आली' : 'Failed to delete photo'), 'error');
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handleSetPrimaryPhoto = async (photoId) => {
    if (!await verifyCurrentSession()) return;

    setSettingPrimaryId(photoId);
    try {
      await api.post(`/profile/photos/${photoId}/primary`);
      setPhotos((prev) =>
        prev.map((p) => ({
          ...p,
          is_primary: p.id === photoId,
          isPrimary: p.id === photoId
        }))
      );
      showToast(isMarathi ? 'मुख्य प्रोफाइल फोटो बदलला.' : 'Primary profile photo updated.', 'success');
    } catch (error) {
      console.error('Set primary photo error:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'मुख्य फोटो बदलण्यात त्रुटी आली' : 'Failed to update primary photo'), 'error');
    } finally {
      setSettingPrimaryId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#7A1526] border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-[#7A6E65] font-medium">
            {isMarathi ? 'आपले प्रोफाइल लोड होत आहे...' : 'Loading your profile...'}
          </p>
        </div>
      </div>
    );
  }

  const status = profileData?.status || 'pending_approval';

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

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Top Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EAE0D2] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                {isMarathi ? 'माझे प्रोफाइल व्यवस्थापन' : 'Profile Management'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? 'माझे प्रोफाइल व माहिती' : 'My Matrimonial Profile'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-0.5">
              {isMarathi 
                ? 'आपली वैयक्तिक, शैक्षणिक आणि कौटुंबिक माहिती अद्ययावत ठेवा.'
                : 'Keep your matrimonial biodata, photos, and partner expectations up to date.'}
            </p>
          </div>

          {profileData?.id && status === 'approved' && (
            <Link 
              to={`/profiles/${profileData.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E2D8CC] hover:border-[#7A1526] rounded-xl text-xs sm:text-sm font-semibold text-[#7A1526] transition shadow-2xs shrink-0 self-start sm:self-auto"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{isMarathi ? 'सार्वजनिक प्रोफाइल पहा' : 'View Public Profile'}</span>
            </Link>
          )}
        </div>

        {/* Status / Onboarding Banners */}
        <div className="mb-8">
          {status === 'draft' && (
            <div className="bg-white/95 backdrop-blur-xs border border-[#D9C39E] rounded-2xl p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#7A1526] text-white">
                      {isMarathi ? 'टप्पा १: ऑनबोर्डिंग' : 'Step 1: First-Time Onboarding'}
                    </span>
                    <span className="text-xs text-[#7A6E65] font-semibold">
                      {isMarathi ? 'मसुदा (Draft)' : 'Profile Draft'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2B1B17]">
                    {isMarathi 
                      ? 'आपले प्रोफाइल पूर्ण करा आणि ॲडमिन मंजुरीसाठी सबमिट करा'
                      : 'Complete Your Profile & Submit for Admin Review'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5E55] max-w-2xl leading-relaxed">
                    {isMarathi
                      ? 'समाजातील सत्यता आणि विश्वासार्हता राखण्यासाठी, नवीन प्रोफाइल शोध सूचीमध्ये दिसण्यापूर्वी प्रशासनाकडून एकदा तपासले जातात.'
                      : 'To ensure trust and authenticity in the community, new profiles are reviewed once by administration before becoming visible on search.'}
                  </p>

                  {/* Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      formData.firstName && formData.lastName && formData.phone && formData.dob
                        ? 'bg-green-50/80 border-green-200 text-green-800 font-semibold'
                        : 'bg-[#FAF7F2] border-[#EAE0D2] text-[#7A6E65]'
                    }`}>
                      {formData.firstName && formData.lastName && formData.phone && formData.dob ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-dashed border-[#A89D91] shrink-0" />
                      )}
                      <span>{isMarathi ? '१. वैयक्तिक व संपर्क माहिती' : '1. Personal & Contact Details'}</span>
                    </div>

                    <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      formData.city && formData.state && formData.caste && formData.education && formData.occupation
                        ? 'bg-green-50/80 border-green-200 text-green-800 font-semibold'
                        : 'bg-[#FAF7F2] border-[#EAE0D2] text-[#7A6E65]'
                    }`}>
                      {formData.city && formData.state && formData.caste && formData.education && formData.occupation ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-dashed border-[#A89D91] shrink-0" />
                      )}
                      <span>{isMarathi ? '२. समाज व शैक्षणिक माहिती' : '2. Location & Background'}</span>
                    </div>

                    <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      photos.length > 0
                        ? 'bg-green-50/80 border-green-200 text-green-800 font-semibold'
                        : 'bg-[#FAF7F2] border-[#EAE0D2] text-[#7A6E65]'
                    }`}>
                      {photos.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-dashed border-[#A89D91] shrink-0" />
                      )}
                      <span>
                        {isMarathi 
                          ? `३. प्रोफाइल फोटो (${photos.length > 0 ? `${photos.length} अपलोड` : 'आवश्यक'})`
                          : `3. Profile Photo (${photos.length > 0 ? `${photos.length} uploaded` : 'Required'})`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={submittingForReview || saving}
                    className="px-6 py-3.5 bg-[#7A1526] hover:bg-[#8F1024] disabled:bg-gray-400 text-white font-bold text-sm sm:text-base rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    {submittingForReview ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>{isMarathi ? 'सबमिट होत आहे...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isMarathi ? 'मंजुरीसाठी सबमिट करा' : 'Submit for Admin Review'}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-[#7A6E65] text-center">
                    {isMarathi ? 'ॲडमिन मंजुरीनंतर प्रोफाइल लाइव्ह होईल' : 'Admin reviews completed profiles once'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'pending_approval' && (
            <div className="bg-[#FFFBF2] border border-[#E9D8B4] rounded-2xl p-4 sm:p-6 flex items-start gap-4 shadow-xs">
              <div className="p-2.5 rounded-full bg-[#F5E8CB] text-[#976D25] shrink-0 mt-0.5">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-[#2B1B17] text-base sm:text-lg flex items-center gap-2">
                  <span>{isMarathi ? 'प्रोफाइल ॲडमिन मंजुरीच्या प्रतीक्षेत आहे' : 'Profile Pending Admin Approval'}</span>
                  <span className="text-xs bg-[#F5E8CB] text-[#7A5416] px-2.5 py-0.5 rounded-full font-semibold">
                    {isMarathi ? 'तपासणी सुरू आहे' : 'Under Review'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
                  {isMarathi
                    ? 'आपले संपूर्ण प्रोफाइल आणि फोटो सबमिट झाले असून प्रशासनाकडून तपासणी सुरू आहे. मंजुरी मिळताच आपले प्रोफाइल शोध सूचीमध्ये दिसेल. आपण खालील माहिती कधीही अद्ययावत करू शकता.'
                    : 'Your complete profile and photograph have been submitted and are currently awaiting manual admin review. You will become visible on Browse Profiles as soon as your profile is approved. You can still make updates below anytime.'}
                </p>
              </div>
            </div>
          )}

          {status === 'approved' && (
            <div className="bg-[#F4F9F4] border border-[#CDE4CD] rounded-2xl p-4 sm:p-6 flex items-start gap-4 shadow-xs">
              <div className="p-2.5 rounded-full bg-[#DCECDC] text-green-700 shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-[#2B1B17] text-base sm:text-lg flex items-center gap-2">
                  <span>{isMarathi ? 'प्रोफाइल मंजूर झाले आहे' : 'Profile Approved'}</span>
                  <span className="text-xs bg-[#DCECDC] text-green-800 px-2.5 py-0.5 rounded-full font-semibold">
                    {isMarathi ? 'शोध सूचीमध्ये सक्रिय' : 'Live on Search'}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
                  {isMarathi
                    ? 'आपले प्रोफाइल सक्रिय असून इतर मंजूर सभासदांना दिसत आहे. आपण केव्हाही आपली माहिती व फोटो बदलू शकता — नियमित बदलांनंतर प्रोफाइल पुन्हा पेंडिंगमध्ये जात नाही.'
                    : 'Your profile is active and visible to approved members on KadamVivah. You can freely update your profile details and photos anytime — routine edits stay live immediately without going back to pending approval.'}
                </p>
              </div>
            </div>
          )}

          {status === 'rejected' && (
            <div className="bg-[#FDF2F2] border border-[#F5C2C7] rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-[#FCE8E8] text-[#9E1B32] shrink-0 mt-0.5">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-[#7A1526] text-base sm:text-lg">
                    {isMarathi ? 'प्रोफाइलमध्ये सुधारणा आवश्यक आहे' : 'Profile Requires Revision'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5E55]">
                    {profileData?.rejection_reason
                      ? `${isMarathi ? 'ॲडमिन अभिप्राय:' : 'Admin Feedback:'} "${profileData.rejection_reason}"`
                      : (isMarathi 
                          ? 'आपल्या प्रोफाइलमध्ये काही त्रुटी आढळल्या आहेत. कृपया खालील माहिती व फोटो तपासा, दुरुस्त करा आणि पुन्हा सबमिट करा.'
                          : 'Your profile was not approved. Please review your details and photos below, update the required information, and resubmit for review.')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={submittingForReview || saving}
                className="px-5 py-2.5 bg-[#7A1526] hover:bg-[#8F1024] disabled:bg-gray-400 text-white font-bold text-xs sm:text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
              >
                {submittingForReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>{isMarathi ? 'सबमिट होत आहे...' : 'Resubmitting...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isMarathi ? 'पुन्हा मंजुरीसाठी पाठवा' : 'Resubmit for Admin Review'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section: Profile Photos */}
        <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#EAE0D2]/70 gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#7A1526]" />
                <span>{isMarathi ? 'प्रोफाइल छायाचित्रे' : 'Profile Photographs'}</span>
              </h2>
              <p className="text-xs text-[#7A6E65] mt-0.5">
                {isMarathi 
                  ? 'स्पष्ट फोटो जोडा. मुख्य (Primary) फोटो शोध परिणामांमध्ये प्रथम दिसेल.'
                  : 'Add clear photographs. The primary photo is displayed in search results.'}
              </p>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="px-4 py-2.5 bg-[#7A1526] hover:bg-[#8F1024] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadingPhoto ? (isMarathi ? 'अपलोड होत आहे...' : 'Uploading Image...') : (isMarathi ? 'नवीन फोटो जोडा' : 'Upload New Photo')}</span>
              </button>
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-[#D9C39E]/80 rounded-2xl bg-[#FAF7F2]">
              <Camera className="w-12 h-12 text-[#B88E4B] mx-auto mb-2 opacity-80" />
              <p className="text-[#2B1B17] font-semibold text-sm mb-1">
                {isMarathi ? 'अद्याप कोणतेही फोटो जोडलेले नाहीत' : 'No profile photos uploaded yet'}
              </p>
              <p className="text-xs text-[#7A6E65] max-w-sm mx-auto mb-4">
                {isMarathi
                  ? 'स्पष्ट फोटो असणाऱ्या प्रोफाइलला अधिक प्रतिसाद मिळतात. JPEG, PNG, WebP (५MB पर्यंत).'
                  : 'Profiles with clear photos receive more responses. Supports JPEG, PNG, WebP up to 5MB.'}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="px-4 py-2 bg-white border border-[#E2D8CC] hover:border-[#7A1526] rounded-xl text-xs font-semibold text-[#7A1526] transition cursor-pointer"
              >
                {isMarathi ? 'फोटो निवडा' : 'Select Photo to Upload'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => {
                const isPrimary = photo.is_primary || photo.isPrimary;
                return (
                  <div
                    key={photo.id}
                    className={`relative group rounded-2xl overflow-hidden border bg-[#FAF7F2] aspect-[4/5] w-full flex items-center justify-center transition-all ${
                      isPrimary ? 'ring-2 ring-[#7A1526] ring-offset-2 border-[#7A1526]' : 'border-[#EAE0D2]'
                    }`}
                  >
                    <img
                      src={photo.file_path || photo.filePath}
                      alt="Profile Photo"
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      onError={handleImageError}
                    />

                    {isPrimary && (
                      <div className="absolute top-2 left-2 bg-[#7A1526] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1 z-10">
                        <Star className="w-3 h-3 fill-current text-[#B88E4B]" />
                        <span>{isMarathi ? 'मुख्य फोटो' : 'Primary'}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 z-20">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition cursor-pointer"
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={deletingPhotoId === photo.id}
                          title={isMarathi ? 'फोटो हटवा' : 'Delete Photo'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {!isPrimary && (
                        <button
                          type="button"
                          className="w-full py-1.5 px-2 bg-white/95 hover:bg-white text-[#2B1B17] text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                          onClick={() => handleSetPrimaryPhoto(photo.id)}
                          disabled={settingPrimaryId === photo.id}
                        >
                          <Star className="w-3.5 h-3.5 text-[#B88E4B]" />
                          <span>{isMarathi ? 'मुख्य फोटो बनवा' : 'Set Primary'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6 sm:space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <User className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '१. वैयक्तिक माहिती' : '1. Basic Information'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'उमेदवाराची प्राथमिक वैयक्तिक माहिती' : 'Core demographic information of candidate'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'पहिले नाव *' : 'First Name *'}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. रोहन' : 'e.g. Rohan'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition ${
                    errors.firstName
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                  required
                />
                {errors.firstName && <p className="text-xs text-[#9E1B32] font-medium mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="middleName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'मधले नाव' : 'Middle Name'}
                </label>
                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. सुरेश' : 'e.g. Suresh'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'आडनाव *' : 'Last Name *'}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. कदम' : 'e.g. Kadam'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition ${
                    errors.lastName
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                  required
                />
                {errors.lastName && <p className="text-xs text-[#9E1B32] font-medium mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              <div>
                <label htmlFor="gender" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'लिंग *' : 'Gender *'}
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-10 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 appearance-none transition cursor-pointer"
                  >
                    <option value="male">{isMarathi ? 'वर (पुरुष)' : 'Male'}</option>
                    <option value="female">{isMarathi ? 'वधू (स्त्री)' : 'Female'}</option>
                    <option value="other">{isMarathi ? 'इतर' : 'Other'}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="dob" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'जन्मतारीख *' : 'Date of Birth *'}
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] focus:outline-none transition ${
                    errors.dob
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                  required
                />
                {errors.dob && <p className="text-xs text-[#9E1B32] font-medium mt-1">{errors.dob}</p>}
              </div>

              <div>
                <label htmlFor="maritalStatus" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'वैवाहिक स्थिती' : 'Marital Status'}
                </label>
                <div className="relative">
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-10 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 appearance-none transition cursor-pointer"
                  >
                    <option value="never_married">{isMarathi ? 'अविवाहित (Never Married)' : 'Never Married'}</option>
                    <option value="divorced">{isMarathi ? 'घटस्फोटित (Divorced)' : 'Divorced'}</option>
                    <option value="widowed">{isMarathi ? 'विधुर / विधवा (Widowed)' : 'Widowed'}</option>
                    <option value="separated">{isMarathi ? 'विभक्त (Separated)' : 'Separated'}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="height" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'उंची' : 'Height'}
                </label>
                <input
                  id="height"
                  name="height"
                  type="text"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? "उदा. 5'8'' किंवा 172 cm" : "e.g. 5'8'' or 172 cm"}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Community & Location */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <MapPin className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '२. समाज आणि पत्ता' : '2. Community & Location'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'मराठा समाज, गोत्र आणि वास्तव्याचे शहर' : 'Maratha community details, gotra, and location'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label htmlFor="caste" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'जात / समाज *' : 'Community / Caste *'}
                </label>
                <input
                  id="caste"
                  name="caste"
                  type="text"
                  value={formData.caste}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. मराठा / देशमुख' : 'e.g. Maratha / Deshmukh'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition ${
                    errors.caste
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                  required
                />
                {errors.caste && <p className="text-xs text-[#9E1B32] font-medium mt-1">{errors.caste}</p>}
              </div>

              <div>
                <label htmlFor="gotra" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'गोत्र / देवक' : 'Gotra / Devak'}
                </label>
                <input
                  id="gotra"
                  name="gotra"
                  type="text"
                  value={formData.gotra}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. कश्यप / वाघ' : 'e.g. Kashyap'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              <div>
                <label htmlFor="city" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'शहर *' : 'City *'}
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. पुणे' : 'e.g. Pune'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition ${
                    errors.city
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                  required
                />
                {errors.city && <p className="text-xs text-[#9E1B32] font-medium mt-1">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="district" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'जिल्हा' : 'District'}
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. पुणे / सातारा' : 'e.g. Pune / Satara'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'राज्य' : 'State'}
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>

              <div>
                <label htmlFor="pincode" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'पिनकोड' : 'Pincode'}
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="411001"
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Education & Profession */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <GraduationCap className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '३. शिक्षण आणि व्यवसाय' : '3. Education & Profession'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'शैक्षणिक पात्रता आणि नोकरी / व्यवसाय माहिती' : 'Academic qualifications and current career details'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label htmlFor="education" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'शिक्षण *' : 'Education *'}
                </label>
                <input
                  id="education"
                  name="education"
                  type="text"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. B.E. (Comp), MBA' : 'e.g. B.E. (Computer), MBA'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition ${
                    errors.education
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                  required
                />
                {errors.education && <p className="text-xs text-[#9E1B32] font-medium mt-1">{errors.education}</p>}
              </div>

              <div>
                <label htmlFor="occupation" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'व्यवसाय / नोकरी *' : 'Occupation *'}
                </label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. Software Engineer, सरकारी सेवा' : 'e.g. Software Engineer, Govt Service'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition ${
                    errors.occupation
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                  required
                />
                {errors.occupation && <p className="text-xs text-[#9E1B32] font-medium mt-1">{errors.occupation}</p>}
              </div>

              <div>
                <label htmlFor="annualIncome" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'वार्षिक उत्पन्न' : 'Annual Income'}
                </label>
                <input
                  id="annualIncome"
                  name="annualIncome"
                  type="text"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. १२ लाख प्रति वर्ष' : 'e.g. 12 LPA'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Family Background */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <Users className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '४. कौटुंबिक माहिती' : '4. Family Background'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'पालक, भावंडे आणि कौटुंबिक पार्श्वभूमी' : 'Parents, siblings, and family values'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              <div>
                <label htmlFor="familyType" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'कुटुंब प्रकार' : 'Family Type'}
                </label>
                <div className="relative">
                  <select
                    id="familyType"
                    name="familyType"
                    value={formData.familyType}
                    onChange={handleInputChange}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-10 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 appearance-none transition cursor-pointer"
                  >
                    <option value="">{isMarathi ? 'निवडा...' : 'Select...'}</option>
                    <option value="nuclear">{isMarathi ? 'विभक्त (Nuclear)' : 'Nuclear'}</option>
                    <option value="joint">{isMarathi ? 'एकत्र (Joint)' : 'Joint'}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="fatherName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'वडिलांचे नाव' : "Father's Name"}
                </label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. सुरेश कदम' : 'e.g. Suresh Kadam'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>

              <div>
                <label htmlFor="motherName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'आईचे नाव' : "Mother's Name"}
                </label>
                <input
                  id="motherName"
                  name="motherName"
                  type="text"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. सुनिता कदम' : 'e.g. Sunita Kadam'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>

              <div>
                <label htmlFor="siblings" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'भावंडे' : 'Siblings'}
                </label>
                <input
                  id="siblings"
                  name="siblings"
                  type="text"
                  value={formData.siblings}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. १ भाऊ, १ बहीण' : 'e.g. 1 Brother, 1 Sister'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Contact Details */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#EAE0D2]/70 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                  <Phone className="w-5 h-5 text-[#7A1526]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                    {isMarathi ? '५. संपर्क तपशील' : '5. Contact Details'}
                  </h2>
                  <p className="text-xs text-[#7A6E65]">
                    {isMarathi ? 'आपला अधिकृत संपर्क क्रमांक व ईमेल' : 'Official communication numbers and email'}
                  </p>
                </div>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-[#F4F9F4] border border-[#CDE4CD] rounded-full text-xs font-semibold text-green-800">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>{isMarathi ? 'गोपनीयतेचे संरक्षण' : 'Privacy-Protected'}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#EAE0D2] rounded-xl text-xs text-[#7A6E65] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B88E4B] shrink-0" />
              <span>
                {isMarathi
                  ? 'आपला संपर्क क्रमांक व ईमेल फक्त परस्पर स्वीकृती (Mutual Match) झाल्यानंतरच दुसऱ्या सभासदाला दिसतो.'
                  : 'Your phone number and email are kept private and only unlocked mutually once interest is accepted.'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'प्राथमिक मोबाईल क्रमांक *' : 'Primary Phone *'}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>

              <div>
                <label htmlFor="alternatePhone" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'पर्यायी मोबाईल क्रमांक' : 'Alternate Phone'}
                </label>
                <input
                  id="alternatePhone"
                  name="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  placeholder="9876543211"
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'संपर्क ईमेल' : 'Contact Email'}
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="rahul@example.com"
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 6: About & Hobbies */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <FileText className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '६. उमेदवाराबद्दल व जोडीदाराकडून अपेक्षा' : '6. About You & Expectations'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'स्वतःची व्यक्तिमत्त्व माहिती, छंद आणि अपेक्षा' : 'Personal description, hobbies, and partner preferences'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="bio" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'बायोडाटा / जोडीदाराकडून अपेक्षा' : 'About You & Partner Expectations'}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder={
                    isMarathi
                      ? 'आपल्याबद्दल, कौटुंबिक मूल्यांबद्दल आणि अपेक्षित जोडीदाराबद्दल थोडक्यात लिहा...'
                      : 'Tell prospective matches about yourself, your family background, and your expectations for a life partner...'
                  }
                  className="w-full p-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition leading-relaxed"
                />
              </div>

              <div>
                <label htmlFor="hobbies" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'छंद आणि आवडीनिवडी' : 'Hobbies & Interests'}
                </label>
                <input
                  id="hobbies"
                  name="hobbies"
                  type="text"
                  value={formData.hobbies}
                  onChange={handleInputChange}
                  placeholder={isMarathi ? 'उदा. वाचन, संगीत, प्रवास, ट्रेकिंग' : 'e.g. Reading, Traveling, Music, Trekking'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                />
              </div>
            </div>
          </div>

          {/* Sticky Save CTA */}
          <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-[#D9C39E] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-[#6B5E55] text-center sm:text-left">
              {isMarathi 
                ? 'केलेले बदल सेव्ह करण्यासाठी खालील बटणावर क्लिक करा.'
                : 'Click save to keep your profile information updated.'}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-[#7A1526] hover:bg-[#8F1024] disabled:bg-gray-400 text-white font-bold text-sm sm:text-base rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.99]"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? (isMarathi ? 'सेव्ह होत आहे...' : 'Saving Changes...') : (isMarathi ? 'बदल सेव्ह करा' : 'Save Profile Details')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
