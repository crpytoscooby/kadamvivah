import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  DollarSign,
  Users,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '../components/Toast';
import dayjs from 'dayjs';

/**
 * ProfileDetail Page - Full profile view with all details
 * 
 * Features:
 * - Photo carousel
 * - Complete profile information
 * - Contact details (visible when logged in)
 * - Family details
 * - Bio
 * - Back navigation
 */

export const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/profiles/${id}`);
      // setProfile(response.data);
      
      // Mock implementation
      const mockProfiles = JSON.parse(localStorage.getItem('mockProfiles') || '[]');
      const foundProfile = mockProfiles.find(p => p.id === id);
      
      if (!foundProfile) {
        showToast('Profile not found', 'error');
        navigate('/profiles');
        return;
      }
      
      setProfile(foundProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Failed to load profile', 'error');
      navigate('/profiles');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    return dayjs().diff(dayjs(dob), 'year');
  };

  const nextPhoto = () => {
    if (profile?.photos && currentPhotoIndex < profile.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const age = calculateAge(profile.dob);
  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : ['/placeholder-avatar.png'];

  return (
    <div className="min-h-screen bg-background py-8">
      <ToastContainer />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/profiles')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profiles
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Carousel */}
          <div>
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="aspect-[3/4] bg-muted">
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-avatar.png';
                    }}
                  />
                </div>

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
            </Card>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {profile.firstName} {profile.middleName} {profile.lastName}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {age} years
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.city}, {profile.state}
                </span>
              </div>
            </div>

            {/* Basic Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
                <dl className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Gender</dt>
                    <dd className="font-medium capitalize">{profile.gender}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Date of Birth</dt>
                    <dd className="font-medium">{dayjs(profile.dob).format('DD MMM YYYY')}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Caste</dt>
                    <dd className="font-medium">
                      {profile.caste}
                      {profile.subCaste && ` • ${profile.subCaste}`}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Education & Career */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Education & Career</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Education</p>
                      <p className="font-medium">{profile.education}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Occupation</p>
                      <p className="font-medium">{profile.occupation}</p>
                    </div>
                  </div>
                  {profile.annualIncome && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Income</p>
                        <p className="font-medium">{profile.annualIncome}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Family Details */}
            {profile.familyDetails && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family Details
                  </h2>
                  <dl className="space-y-3">
                    {profile.familyDetails.fatherName && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <dt className="text-muted-foreground">Father's Name</dt>
                        <dd className="font-medium">{profile.familyDetails.fatherName}</dd>
                      </div>
                    )}
                    {profile.familyDetails.motherName && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <dt className="text-muted-foreground">Mother's Name</dt>
                        <dd className="font-medium">{profile.familyDetails.motherName}</dd>
                      </div>
                    )}
                    {profile.familyDetails.siblings && (
                      <div className="flex justify-between py-2 border-b border-border">
                        <dt className="text-muted-foreground">Siblings</dt>
                        <dd className="font-medium">{profile.familyDetails.siblings}</dd>
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
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Details */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a 
                        href={`mailto:${profile.email}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a 
                        href={`tel:${profile.phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Contact details are visible to all registered users
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
