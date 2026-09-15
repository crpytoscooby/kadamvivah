import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
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
  CheckCircle
} from 'lucide-react';

export const MyProfile = () => {
  const { user, verifySession } = useAuth();
  const { showToast, ToastContainer } = useToast();
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
      showToast(error.response?.data?.message || 'Failed to load profile details', 'error');
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
      showToast('Your session has expired. Please log in again.', 'error');
      return false;
    }
    if (loadedUserId && currentActiveUser.id !== loadedUserId) {
      showToast('Your active account changed in another tab. Please refresh before continuing.', 'error');
      return false;
    }
    return true;
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrors({});

    if (!await verifyCurrentSession()) {
      setSaving(false);
      return false;
    }

    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      showToast('Please fix the highlighted errors before saving.', 'error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }

    try {
      const response = await api.put('/profile/me', formData);
      const updated = response.data?.data;
      if (updated) {
        setProfileData(updated);
        setLoadedUserId(updated.user_id || updated.userId || user?.id);
        setPhotos(updated.photos || []);
      }
      const isApproved = (updated?.status === 'approved' || updated?.is_approved_once);
      showToast(
        isApproved 
          ? 'Profile updated successfully! Changes are live.' 
          : 'Profile details saved successfully.',
        'success'
      );
      return true;
    } catch (error) {
      console.error('Save profile error:', error);
      const resData = error.response?.data;
      if (resData?.errors?.field) {
        setErrors({ [resData.errors.field]: resData.message });
      }
      showToast(resData?.message || 'Failed to save profile changes', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!await verifyCurrentSession()) return;

    // 1. Client-side validation of all mandatory fields
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.caste.trim()) newErrors.caste = 'Caste is required';
    if (!formData.education.trim()) newErrors.education = 'Education is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please complete all required fields before submitting for admin review.', 'error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (photos.length === 0) {
      showToast('Please upload at least one profile photo before submitting for review.', 'error');
      fileInputRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSubmittingForReview(true);
    try {
      // First persist any unsaved form edits
      await api.put('/profile/me', formData);

      // Then submit for review
      const response = await api.post('/profile/submit', { acceptTerms: true });
      const updated = response.data?.data;
      if (updated) {
        setProfileData(updated);
        setLoadedUserId(updated.user_id || updated.userId || user?.id);
        setPhotos(updated.photos || []);
      }
      showToast('Profile successfully submitted for Admin Review!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submit for review error:', error);
      const resData = error.response?.data;
      if (resData?.errors?.field) {
        setErrors({ [resData.errors.field]: resData.message });
      }
      showToast(resData?.message || 'Failed to submit profile for admin review.', 'error');
    } finally {
      setSubmittingForReview(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    if (!await verifyCurrentSession()) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only JPEG, PNG, and WebP images are allowed.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size cannot exceed 5MB.', 'error');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('photo', file);
    uploadFormData.append('is_primary', photos.length === 0 ? '1' : '0');

    setUploadingPhoto(true);
    try {
      const response = await api.post('/profile/photos', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newPhoto = response.data?.data;
      if (newPhoto) {
        setPhotos((prev) => {
          if (newPhoto.is_primary || newPhoto.isPrimary) {
            return [newPhoto, ...prev.map((p) => ({ ...p, is_primary: false, isPrimary: false }))];
          }
          return [...prev, newPhoto];
        });
        showToast('Photo uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Upload photo error:', error);
      showToast(error.response?.data?.message || 'Failed to upload photo', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!await verifyCurrentSession()) return;

    if (!window.confirm('Are you sure you want to delete this photo?')) return;

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
      showToast('Photo deleted successfully.', 'success');
    } catch (error) {
      console.error('Delete photo error:', error);
      showToast(error.response?.data?.message || 'Failed to delete photo', 'error');
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
      showToast('Primary profile photo updated.', 'success');
    } catch (error) {
      console.error('Set primary photo error:', error);
      showToast(error.response?.data?.message || 'Failed to update primary photo', 'error');
    } finally {
      setSettingPrimaryId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const status = profileData?.status || 'pending_approval';

  return (
    <div className="min-h-screen bg-background py-8">
      <ToastContainer />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground font-devanagari">माझे प्रोफाइल व माहिती</p>
          </div>
          {profileData?.id && status === 'approved' && (
            <Link to={`/profiles/${profileData.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                View Public Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Status / Onboarding Banners */}
        <div className="mb-8">
          {status === 'draft' && (
            <Card className="border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-background shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                        Step 1: First-Time Onboarding
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        Profile Draft
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Complete Your Profile & Submit for Admin Review
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                      To ensure trust and authenticity in the community, new profiles are reviewed and approved once by our administration before becoming visible on search.
                    </p>

                    {/* Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                        formData.firstName && formData.lastName && formData.phone && formData.dob
                          ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300 font-medium'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}>
                        {formData.firstName && formData.lastName && formData.phone && formData.dob ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-dashed border-muted-foreground flex-shrink-0" />
                        )}
                        <span>1. Personal & Contact Details</span>
                      </div>

                      <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                        formData.city && formData.state && formData.caste && formData.education && formData.occupation
                          ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300 font-medium'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}>
                        {formData.city && formData.state && formData.caste && formData.education && formData.occupation ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-dashed border-muted-foreground flex-shrink-0" />
                        )}
                        <span>2. Location & Background</span>
                      </div>

                      <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                        photos.length > 0
                          ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300 font-medium'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}>
                        {photos.length > 0 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-dashed border-muted-foreground flex-shrink-0" />
                        )}
                        <span>3. Profile Photo ({photos.length > 0 ? `${photos.length} uploaded` : 'Required'})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleSubmitForReview}
                      disabled={submittingForReview || saving}
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
                    >
                      {submittingForReview ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Profile for Admin Review
                        </>
                      )}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Admin reviews completed profiles once
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {status === 'pending_approval' && (
            <Card className="border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/20">
              <CardContent className="p-4 sm:p-6 flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 mt-0.5">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
                    Profile Pending Admin Approval
                    <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      Under Review
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your complete profile and photograph have been submitted and are currently awaiting manual admin review.
                    You will become visible on Browse Profiles as soon as your profile is approved. You can still make updates below anytime.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {status === 'approved' && (
            <Card className="border-green-500/40 bg-green-500/10 dark:bg-green-950/20">
              <CardContent className="p-4 sm:p-6 flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground text-base flex items-center gap-2">
                    Profile Approved
                    <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                      Live on Search
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your profile is active and visible to approved members on KadamVivah.
                    You can freely update your profile details and photos anytime — routine edits stay live immediately without going back to pending approval.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {status === 'rejected' && (
            <Card className="border-destructive/40 bg-destructive/10">
              <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-full bg-destructive/20 text-destructive mt-0.5">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-destructive text-base">
                      Profile Requires Revision
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {profileData?.rejection_reason
                        ? `Admin Feedback: "${profileData.rejection_reason}"`
                        : 'Your profile was not approved. Please review your details and photos below, update the required information, and resubmit for review.'}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSubmitForReview}
                  disabled={submittingForReview || saving}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-shrink-0"
                >
                  {submittingForReview ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Resubmitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Resubmit for Admin Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-border gap-4">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Profile Photos
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Add clear photographs. The primary photo is displayed in search results.
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
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingPhoto ? 'Uploading Image...' : 'Upload New Photo'}
                </Button>
              </div>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-xl bg-muted/20">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-60" />
                <p className="text-foreground font-medium mb-1">No profile photos uploaded yet</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                  Profiles with clear photos receive more responses. Supports JPEG, PNG, WebP up to 5MB.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  Select Photo to Upload
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => {
                  const isPrimary = photo.is_primary || photo.isPrimary;
                  return (
                    <div
                      key={photo.id}
                      className={`relative group rounded-xl overflow-hidden border bg-muted aspect-[4/5] w-full flex items-center justify-center ${
                        isPrimary ? 'ring-2 ring-primary ring-offset-2' : ''
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
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Primary
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeletePhoto(photo.id)}
                            disabled={deletingPhotoId === photo.id}
                            title="Delete Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {!isPrimary && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs font-medium gap-1"
                            onClick={() => handleSetPrimaryPhoto(photo.id)}
                            disabled={settingPrimaryId === photo.id}
                          >
                            <Star className="w-3.5 h-3.5" />
                            Set Primary
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Basic Information (वैयक्तिक माहिती)
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Core demographic information of the candidate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rohan"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="e.g. Suresh"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Kadam"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="male">Male (पुरुष)</option>
                    <option value="female">Female (स्त्री)</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="never_married">Never Married (अविवाहित)</option>
                    <option value="divorced">Divorced (घटस्फोटित)</option>
                    <option value="widowed">Widowed (विधुर / विधवा)</option>
                    <option value="separated">Separated (विभक्त)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height (उंची)</Label>
                  <Input
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="e.g. 5'8'' or 172 cm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Community & Location (जात व पत्ता)
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Caste details and current place of residence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="caste">Caste (जात)</Label>
                  <Input
                    id="caste"
                    name="caste"
                    value={formData.caste}
                    onChange={handleInputChange}
                    placeholder="e.g. Maratha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCaste">Sub-Caste (पोटजात)</Label>
                  <Input
                    id="subCaste"
                    name="subCaste"
                    value={formData.subCaste}
                    onChange={handleInputChange}
                    placeholder="e.g. 96 Kuli"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gotra">Gotra / Devak (गोत्र / देवक)</Label>
                  <Input
                    id="gotra"
                    name="gotra"
                    value={formData.gotra}
                    onChange={handleInputChange}
                    placeholder="e.g. Kadam"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City (शहर) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Pune"
                    required
                  />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District (जिल्हा)</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g. Pune"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State (राज्य)</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Maharashtra"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode (पिनकोड)</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 411038"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education & Career (शिक्षण व व्यवसाय)
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Professional background and educational qualifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Highest Education (शिक्षण)</Label>
                  <Input
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    placeholder="e.g. B.E. Computer Engineering / MBA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation / Profession (व्यवसाय / नोकरी)</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Software Engineer / Business"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (वार्षिक उत्पन्न)</Label>
                  <Input
                    id="annualIncome"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    placeholder="e.g. 12-15 LPA"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Family Details (कौटुंबिक माहिती)
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Parents, siblings and family background.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="familyType">Family Type</Label>
                  <select
                    id="familyType"
                    name="familyType"
                    value={formData.familyType}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Not Specified</option>
                    <option value="nuclear">Nuclear Family (विभक्त कुटुंब)</option>
                    <option value="joint">Joint Family (एकत्र कुटुंब)</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name (वडिलांचे नाव)</Label>
                  <Input
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="e.g. Suresh Kadam"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Name (आईचे नाव)</Label>
                  <Input
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sunita Kadam"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siblings">Siblings (भाऊ / बहीण)</Label>
                  <Input
                    id="siblings"
                    name="siblings"
                    value={formData.siblings}
                    onChange={handleInputChange}
                    placeholder="e.g. 1 Brother, 1 Sister"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    Contact Details (संपर्क माहिती)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Direct phone and email information for approved match proposals.
                  </p>
                </div>
                <span className="text-xs bg-primary/15 text-primary px-2.5 py-1 rounded-full font-medium">
                  Protected & Private
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Primary Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    required
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9123456780"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="e.g. rohan@example.com"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                * Note: Contact information is protected and will be shared with other candidates only when mutual interest is accepted.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                About & Interests (माहिती व छंद)
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Tell prospective matches about your personality and expectations.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">About Candidate / Expectations (थोडक्यात माहिती)</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Describe yourself, your values, lifestyle, and what you are looking for in a life partner..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hobbies">Hobbies & Interests (छंद)</Label>
                  <Input
                    id="hobbies"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    placeholder="e.g. Reading, Traveling, Trekking, Classical Music"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={fetchMyProfile}
              disabled={saving || submittingForReview}
            >
              Discard Unsaved Changes
            </Button>

            <Button
              type="submit"
              variant={status === 'draft' || status === 'rejected' ? 'outline' : 'default'}
              disabled={saving || submittingForReview}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving 
                ? 'Saving...' 
                : status === 'draft' || status === 'rejected'
                ? 'Save Draft'
                : 'Save Profile Changes'}
            </Button>

            {(status === 'draft' || status === 'rejected') && (
              <Button
                type="button"
                onClick={handleSubmitForReview}
                disabled={submittingForReview || saving}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-w-[200px]"
              >
                {submittingForReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {status === 'rejected' ? 'Resubmit for Admin Review' : 'Submit for Admin Review'}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
