import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { 
  UserPlus, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  User, 
  Lock, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Users, 
  FileText, 
  ShieldCheck,
  Phone,
  ChevronDown
} from 'lucide-react';
import dayjs from 'dayjs';

/**
 * Register Page - Comprehensive Matrimonial Registration
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) primary buttons & accents
 * - Antique Gold (#B88E4B) badges & highlights
 * - Warm borders (#EAE0D2) & structured visual section cards
 * - Strict Marathi & English single-language support
 * - Preserved all validation, duplicate email check, API payloads, and password toggles
 */

export const Register = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, logout, register } = useAuth();
  const { showToast, ToastContainer } = useToast();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'male',
    city: '',
    state: '',
    pincode: '',
    caste: '',
    subCaste: '',
    education: '',
    occupation: '',
    annualIncome: '',
    fatherName: '',
    motherName: '',
    siblings: '',
    bio: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState(null); // { available: boolean, reason?: string, message: string } | null

  const handleEmailBlur = async (e) => {
    const rawValue = (e?.target?.value !== undefined ? e.target.value : formData.email) || '';
    const normalizedEmail = rawValue.trim().toLowerCase();
    if (!normalizedEmail) {
      setEmailAvailability(null);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
      setEmailAvailability({
        available: false,
        reason: 'invalid',
        message: isMarathi ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा' : 'Please enter a valid email address'
      });
      setErrors(prev => ({ 
        ...prev, 
        email: isMarathi ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा' : 'Please enter a valid email address' 
      }));
      return;
    }

    setEmailChecking(true);
    try {
      const response = await api.post('/auth/check-email', { email: normalizedEmail });
      const data = response.data?.data;
      if (data) {
        setEmailAvailability(data);
        if (!data.available) {
          setErrors(prev => ({ ...prev, email: data.message }));
        } else {
          setErrors(prev => {
            const next = { ...prev };
            delete next.email;
            return next;
          });
        }
      }
    } catch (err) {
      console.error('Email check failed:', err);
      const errorMsg = err.response?.data?.message || err.data?.message || err.message || (isMarathi ? 'ईमेल पडताळणी अयशस्वी' : 'Email verification failed');
      setEmailAvailability({ available: false, reason: 'error', message: errorMsg });
      setErrors(prev => ({ ...prev, email: errorMsg }));
    } finally {
      setEmailChecking(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required text fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = isMarathi ? 'पहिले नाव आवश्यक आहे' : 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = isMarathi ? 'आडनाव आवश्यक आहे' : 'Last name is required';
    }
    
    // Email normalization & validation
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!normalizedEmail) {
      newErrors.email = isMarathi ? 'ईमेल आवश्यक आहे' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
      newErrors.email = isMarathi ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा' : 'Please enter a valid email address';
    } else if (emailAvailability && !emailAvailability.available) {
      newErrors.email = emailAvailability.message || (isMarathi ? 'कृपया उपलब्ध ईमेल पत्ता द्या' : 'Please provide an available email address');
    }

    // Phone normalization & Indian mobile validation
    let cleanPhone = formData.phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleanPhone.startsWith('+91') && cleanPhone.length === 13) cleanPhone = cleanPhone.slice(3);
    else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
    else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);

    if (!cleanPhone) {
      newErrors.phone = isMarathi ? 'मोबाईल नंबर आवश्यक आहे' : 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = isMarathi ? 'कृपया वैध १० अंकी भारतीय मोबाईल नंबर प्रविष्ट करा' : 'Please enter a valid 10-digit Indian mobile number';
    } else if (/^(\d)\1{9}$/.test(cleanPhone)) {
      newErrors.phone = isMarathi ? 'अवैध मोबाईल नंबर (समान अंक चालणार नाहीत)' : 'Please enter a valid mobile number (repeated digit patterns are not allowed)';
    }

    // Password rules: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    if (!formData.password) {
      newErrors.password = isMarathi ? 'पासवर्ड आवश्यक आहे' : 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = isMarathi ? 'पासवर्ड किमान ८ वर्णांचा असावा' : 'Password must be at least 8 characters';
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[^A-Za-z0-9]/.test(formData.password)
    ) {
      newErrors.password = isMarathi 
        ? 'पासवर्डमध्ये कॅपिटल अक्षर, स्मॉल अक्षर, अंक आणि विशेष चिन्ह असणे आवश्यक आहे' 
        : 'Password must include uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = isMarathi ? 'पासवर्ड जुळत नाहीत' : 'Passwords do not match';
    }

    // DOB - must be 18+ and valid
    if (!formData.dob) {
      newErrors.dob = isMarathi ? 'जन्मतारीख आवश्यक आहे' : 'Date of birth is required';
    } else {
      const birthDate = dayjs(formData.dob);
      if (!birthDate.isValid() || birthDate.isAfter(dayjs())) {
        newErrors.dob = isMarathi ? 'कृपया वैध जन्मतारीख प्रविष्ट करा' : 'Please enter a valid date of birth';
      } else {
        const age = dayjs().diff(birthDate, 'year');
        if (age < 18) {
          newErrors.dob = isMarathi ? 'नोंदणीसाठी वय किमान १८ वर्षे असणे आवश्यक आहे' : 'You must be at least 18 years old to register';
        } else if (age > 100) {
          newErrors.dob = isMarathi ? 'कृपया वैध जन्मतारीख प्रविष्ट करा' : 'Please enter a valid date of birth';
        }
      }
    }

    // Location
    if (!formData.city.trim()) newErrors.city = isMarathi ? 'शहर आवश्यक आहे' : 'City is required';
    if (!formData.state.trim()) newErrors.state = isMarathi ? 'राज्य आवश्यक आहे' : 'State is required';
    if (!formData.pincode) {
      newErrors.pincode = isMarathi ? 'पिनकोड आवश्यक आहे' : 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = isMarathi ? 'कृपया वैध ६ अंकी पिनकोड प्रविष्ट करा' : 'Please enter a valid 6-digit pincode';
    }

    // Community
    if (!formData.caste.trim()) newErrors.caste = isMarathi ? 'जात आवश्यक आहे' : 'Caste is required';

    // Education & occupation
    if (!formData.education.trim()) newErrors.education = isMarathi ? 'शिक्षण आवश्यक आहे' : 'Education is required';
    if (!formData.occupation.trim()) newErrors.occupation = isMarathi ? 'व्यवसाय / नोकरी आवश्यक आहे' : 'Occupation is required';

    // Terms
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = isMarathi 
        ? 'कृपया अटी व शर्ती आणि गोपनीयता धोरण मान्य करा' 
        : 'You must accept the Terms and Conditions and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    if (!password) return '';
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 4) return 'Weak';
    if (score < 6) return 'Medium';
    return 'Strong';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Password strength indicator
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Reset email availability check on email change
    if (name === 'email') {
      setEmailAvailability(null);
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isAuthenticated()) {
      showToast(
        isMarathi 
          ? 'आपण आधीच लॉगिन आहात. नवीन खाते तयार करण्यासाठी कृपया आधी लॉग आउट करा.'
          : 'You are already logged in. Please log out to register a new account.', 
        'error'
      );
      return;
    }

    if (!validateForm()) {
      showToast(
        isMarathi 
          ? 'कृपया फॉर्ममधील त्रुटी तपासा आणि दुरुस्त करा.'
          : 'Please fix the highlighted errors in the form', 
        'error'
      );
      return;
    }

    setLoading(true);
    
    try {
      const normalizedEmail = formData.email.trim().toLowerCase();
      let cleanPhone = formData.phone.replace(/[\s\-\(\)\.]/g, '');
      if (cleanPhone.startsWith('+91') && cleanPhone.length === 13) cleanPhone = cleanPhone.slice(3);
      else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
      else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);

      const familyDetails = {
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        siblings: formData.siblings
      };

      const registrationData = {
        ...formData,
        email: normalizedEmail,
        phone: cleanPhone,
        familyDetails,
        photos: [] // Handled in subsequent onboarding step
      };

      await register(registrationData);
      showToast(
        isMarathi 
          ? 'खाते यशस्वीरित्या तयार झाले! प्रोफाइल पूर्ण करण्यासाठी कृपया फोटो अपलोड करा.'
          : 'Account created! Please upload your photo to complete profile submission.', 
        'success'
      );
      setTimeout(() => {
        navigate('/my-profile?onboarding=1');
      }, 1200);
    } catch (error) {
      console.error('Registration failed:', error);
      const resData = error.response?.data;
      const field = resData?.errors?.field;
      const message = resData?.message || error.message || (isMarathi ? 'नोंदणी अयशस्वी. कृपया पुन्हा प्रयत्न करा.' : 'Registration failed. Please try again.');
      if (field) {
        setErrors(prev => ({ ...prev, [field]: message }));
      }
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak': return 'text-red-600';
      case 'Medium': return 'text-amber-600';
      case 'Strong': return 'text-green-600';
      default: return '';
    }
  };

  const getPasswordStrengthLabel = () => {
    if (!passwordStrength) return '';
    if (isMarathi) {
      if (passwordStrength === 'Weak') return 'कमकुवत';
      if (passwordStrength === 'Medium') return 'मध्यम';
      if (passwordStrength === 'Strong') return 'मजबूत';
    }
    return passwordStrength;
  };

  if (!authLoading && isAuthenticated()) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2] flex items-center justify-center px-4 py-12 relative overflow-hidden">
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

        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-sm relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'सध्या सक्रिय सत्र' : 'Active Session'}
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-[#2B1B17] mb-2">
            {isMarathi ? 'आपण आधीच लॉगिन आहात' : 'Already Logged In'}
          </h2>

          <p className="text-xs sm:text-sm text-[#6B5E55] mb-6 leading-relaxed">
            {isMarathi ? (
              <>
                आपण <strong className="text-[#2B1B17]">{user?.email}</strong> ({user?.firstName || user?.first_name} {user?.lastName || user?.last_name}) म्हणून लॉगिन आहात. नवीन प्रोफाइल नोंदणीसाठी कृपया आधी लॉग आउट करा.
              </>
            ) : (
              <>
                You are currently signed in as <strong className="text-[#2B1B17]">{user?.email}</strong> ({user?.firstName || user?.first_name} {user?.lastName || user?.last_name}). To register a new profile, please log out of your current session first.
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate('/my-profile')}
              className="bg-[#7A1526] hover:bg-[#8F1024] text-white font-semibold py-2.5 px-5 rounded-xl transition duration-200 cursor-pointer text-sm"
            >
              {isMarathi ? 'माझे प्रोफाइल पहा' : 'Go to My Profile'}
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
                showToast(isMarathi ? 'लॉग आउट केले. आपण आता नवीन खाते तयार करू शकता.' : 'Logged out. You can now register a new account.', 'info');
              }}
              className="border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] font-semibold py-2.5 px-5 rounded-xl transition duration-200 cursor-pointer text-sm"
            >
              {isMarathi ? 'लॉग आउट करा' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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

      {/* Ambient warm glow */}
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-[#B88E4B]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/4 w-96 h-96 rounded-full bg-[#7A1526]/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'नव्या प्रवासाची सुरुवात' : 'Begin Your Journey'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2B1B17] tracking-tight mb-2">
            {isMarathi ? 'आपले विवाह प्रोफाइल तयार करा' : 'Create Your Matrimonial Profile'}
          </h1>

          <p className="text-xs sm:text-base text-[#6B5E55] max-w-2xl mx-auto leading-relaxed">
            {isMarathi
              ? 'कदम विवाहमध्ये नोंदणी करा आणि मराठा व देशमुख समाजातील योग्य जीवनसाथीचा शोध सुरू करा.'
              : 'Join KadamVivah and begin your search for a suitable life partner within the Maratha & Deshmukh community.'}
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* Section 1: Basic / Personal Information */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <User className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '१. वैयक्तिक माहिती' : '1. Personal Information'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'उमेदवाराचे नाव, जन्मतारीख आणि लिंग' : "Candidate's full name, date of birth and gender"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'पहिले नाव *' : 'First Name *'}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. राहुल' : 'e.g. Rahul'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.firstName
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.firstName}</span>
                  </p>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label htmlFor="middleName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'मधले नाव (वडिलांचे / पतीचे)' : 'Middle Name'}
                </label>
                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. सुरेश' : 'e.g. Suresh'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition duration-150"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'आडनाव *' : 'Last Name *'}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. कदम' : 'e.g. Kadam'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.lastName
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.lastName}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'जन्मतारीख * (वय १८+ आवश्यक)' : 'Date of Birth * (Must be 18+)'}
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  max={dayjs().subtract(18, 'year').format('YYYY-MM-DD')}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] focus:outline-none transition duration-150 ${
                    errors.dob
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.dob && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.dob}</span>
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'लिंग *' : 'Gender *'}
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full h-11 sm:h-12 pl-3.5 pr-10 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 appearance-none cursor-pointer transition duration-150"
                  >
                    <option value="male">{isMarathi ? 'वर (पुरुष / Male)' : 'Male'}</option>
                    <option value="female">{isMarathi ? 'वधू (स्त्री / Female)' : 'Female'}</option>
                    <option value="other">{isMarathi ? 'इतर (Other)' : 'Other'}</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#7A1526] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Account & Contact Information */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <Lock className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '२. खाते आणि संपर्क माहिती' : '2. Account & Contact Information'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'लॉगिन क्रेडेन्शियल्स आणि संपर्क माहिती' : 'Login credentials and contact information'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Email Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#2B1B17]">
                    {isMarathi ? 'ईमेल पत्ता *' : 'Email Address *'}
                  </label>
                  {emailChecking && (
                    <span className="text-xs text-[#7A6E65] flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin text-[#7A1526]" />
                      <span>{isMarathi ? 'पडताळणी होत आहे...' : 'Checking...'}</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8E81]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    placeholder={isMarathi ? 'उदा. rahul@example.com' : 'e.g. rahul@example.com'}
                    className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                      errors.email
                        ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                        : emailAvailability?.available
                        ? 'border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/15'
                        : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                    }`}
                  />
                </div>

                {emailChecking ? null : emailAvailability?.available ? (
                  <p className="text-xs text-green-700 font-medium flex items-center gap-1 mt-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                    <span>{emailAvailability.message || (isMarathi ? 'ईमेल उपलब्ध आहे' : 'Email is available')}</span>
                  </p>
                ) : emailAvailability?.reason === 'duplicate' ? (
                  <div className="text-xs text-[#7A1526] bg-[#FDF2F2] p-2.5 rounded-xl border border-[#F5C2C7] mt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#9E1B32]" />
                      <span>{emailAvailability.message || (isMarathi ? 'या ईमेल पत्त्यासह आधीच खाते अस्तित्वात आहे.' : 'An account with this email already exists.')}</span>
                    </div>
                    <Link
                      to="/login"
                      className="inline-flex items-center font-bold text-[#7A1526] underline hover:text-[#8F1024] text-xs shrink-0"
                    >
                      {isMarathi ? 'लॉगिन करा →' : 'Log In →'}
                    </Link>
                  </div>
                ) : errors.email ? (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                ) : null}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'मोबाईल नंबर * (१० अंक)' : 'Phone Number * (10 digits)'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E8E81]" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                      errors.phone
                        ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                        : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'पासवर्ड तयार करा * (किमान ८ वर्ण)' : 'Password * (min 8 characters)'}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="e.g. Secret@123"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full h-11 sm:h-12 pl-3.5 pr-11 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                      errors.password
                        ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                        : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? (isMarathi ? 'पासवर्ड लपवा' : 'Hide password') : (isMarathi ? 'पासवर्ड दाखवा' : 'Show password')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E8E81] hover:text-[#2B1B17] focus:outline-none p-1 rounded transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[11px] text-[#7A6E65]">
                    {isMarathi ? 'मोठे व लहान अक्षर, अंक व चिन्ह आवश्यक' : 'Must contain upper, lower, number & symbol'}
                  </p>
                  {passwordStrength && (
                    <p className={`text-xs font-semibold ${getPasswordStrengthColor()}`}>
                      {isMarathi ? `क्षमता: ${getPasswordStrengthLabel()}` : `Strength: ${passwordStrength}`}
                    </p>
                  )}
                </div>

                {errors.password && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'पासवर्डची पुष्टी करा *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full h-11 sm:h-12 pl-3.5 pr-11 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                      errors.confirmPassword
                        ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                        : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-label={showConfirmPassword ? (isMarathi ? 'पासवर्ड लपवा' : 'Hide password') : (isMarathi ? 'पासवर्ड दाखवा' : 'Show password')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E8E81] hover:text-[#2B1B17] focus:outline-none p-1 rounded transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Community & Location */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <MapPin className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '३. समाज आणि पत्ता' : '3. Community & Location'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'मराठा समाज तपशील आणि सध्याचे शहर' : 'Maratha & Deshmukh community background and location'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {/* Caste / Community */}
              <div>
                <label htmlFor="caste" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'जात / समाज *' : 'Community / Caste *'}
                </label>
                <input
                  id="caste"
                  name="caste"
                  type="text"
                  value={formData.caste}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. मराठा / देशमुख' : 'e.g. Maratha / Deshmukh'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.caste
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.caste && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.caste}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'शहर *' : 'City *'}
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. पुणे' : 'e.g. Pune'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.city
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.city}</span>
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'राज्य *' : 'State *'}
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. महाराष्ट्र' : 'e.g. Maharashtra'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.state
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.state && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.state}</span>
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="pincode" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'पिनकोड * (६ अंक)' : 'Pincode * (6 digits)'}
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="411001"
                  maxLength={6}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.pincode
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.pincode}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Education & Occupation */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <GraduationCap className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '४. शिक्षण आणि व्यवसाय' : '4. Education & Occupation'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'शैक्षणिक पात्रता आणि नोकरी / व्यवसाय माहिती' : 'Academic qualifications and professional career'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Education */}
              <div>
                <label htmlFor="education" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'शिक्षण *' : 'Education *'}
                </label>
                <input
                  id="education"
                  name="education"
                  type="text"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. B.E., MBA, MBBS, M.Sc.' : 'e.g. B.E., MBA, MBBS, Post Graduate'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.education
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.education && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.education}</span>
                  </p>
                )}
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'व्यवसाय / नोकरी *' : 'Occupation *'}
                </label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. Software Engineer, सरकारी सेवा, व्यवसाय' : 'e.g. Software Engineer, Govt Service, Business'}
                  className={`w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none transition duration-150 ${
                    errors.occupation
                      ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-2 focus:ring-[#E53E3E]/15'
                      : 'border-[#E2D8CC] focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15'
                  }`}
                />
                {errors.occupation && (
                  <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.occupation}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Annual Income */}
            <div>
              <label htmlFor="annualIncome" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                {isMarathi ? 'वार्षिक उत्पन्न / पॅकेज (ऐच्छिक)' : 'Annual Income / Package (Optional)'}
              </label>
              <input
                id="annualIncome"
                name="annualIncome"
                type="text"
                value={formData.annualIncome}
                onChange={handleChange}
                placeholder={isMarathi ? 'उदा. १०-१२ लाख प्रति वर्ष' : 'e.g. 10-12 LPA'}
                className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition duration-150"
              />
            </div>
          </div>

          {/* Section 5: Family Details */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <Users className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '५. कौटुंबिक माहिती' : '5. Family Details'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'पालक आणि कौटुंबिक पार्श्वभूमी' : 'Parents and family background'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Father Name */}
              <div>
                <label htmlFor="fatherName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'वडिलांचे नाव' : "Father's Name"}
                </label>
                <input
                  id="fatherName"
                  name="fatherName"
                  type="text"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. सुरेश कदम' : 'e.g. Suresh Kadam'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition duration-150"
                />
              </div>

              {/* Mother Name */}
              <div>
                <label htmlFor="motherName" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                  {isMarathi ? 'आईचे नाव' : "Mother's Name"}
                </label>
                <input
                  id="motherName"
                  name="motherName"
                  type="text"
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder={isMarathi ? 'उदा. सुनिता कदम' : 'e.g. Sunita Kadam'}
                  className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition duration-150"
                />
              </div>
            </div>

            {/* Siblings */}
            <div>
              <label htmlFor="siblings" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                {isMarathi ? 'भावंडे' : 'Siblings'}
              </label>
              <input
                id="siblings"
                name="siblings"
                type="text"
                value={formData.siblings}
                onChange={handleChange}
                placeholder={isMarathi ? 'उदा. १ भाऊ, १ बहीण' : 'e.g. 1 Brother, 1 Sister'}
                className="w-full h-11 sm:h-12 px-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition duration-150"
              />
            </div>
          </div>

          {/* Section 6: About Candidate & Expectations */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#EAE0D2]/70 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8F3EA] border border-[#D9C39E]/60 flex items-center justify-center text-[#7A1526] shrink-0">
                <FileText className="w-5 h-5 text-[#7A1526]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? '६. उमेदवाराबद्दल व अपेक्षा' : '6. About Candidate & Partner Expectations'}
                </h2>
                <p className="text-xs text-[#7A6E65]">
                  {isMarathi ? 'स्वतःबद्दल थोडक्यात माहिती आणि अपेक्षित जोडीदाराबद्दल' : 'Brief introduction and expectations from life partner'}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-xs sm:text-sm font-semibold text-[#2B1B17] mb-1.5">
                {isMarathi ? 'बायोडाटा / जोडीदाराकडून अपेक्षा' : 'About You & Partner Expectations'}
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder={
                  isMarathi
                    ? 'आपल्याबद्दल, कौटुंबिक मूल्यांबद्दल आणि अपेक्षित जोडीदाराबद्दल थोडक्यात लिहा...'
                    : 'Tell prospective matches about yourself, your family background, and your expectations for a life partner...'
                }
                className="w-full p-3.5 text-sm sm:text-base border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition duration-150 leading-relaxed"
              />
            </div>
          </div>

          {/* Section 7: Photograph Notice */}
          <div className="bg-[#FAF6EE] border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-white border border-[#D9C39E] mx-auto flex items-center justify-center text-[#7A1526] shadow-2xs">
              <Upload className="w-5 h-5 text-[#7A1526]" />
            </div>
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#2B1B17]">
              {isMarathi ? 'छायाचित्र अपलोड (पुढील टप्प्यात)' : 'Photograph Upload (Next Step)'}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5E55] max-w-lg mx-auto leading-relaxed">
              {isMarathi
                ? 'खाते तयार झाल्यानंतर लगेचच आपण प्रोफाइल फोटो अपलोड करू शकाल आणि प्रोफाइल मंजुरीसाठी सबमिट करू शकाल.'
                : 'You will upload your photograph and complete final profile submission immediately after creating your account.'}
            </p>
          </div>

          {/* Section 8: Terms, Consent & Submit CTA */}
          <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div>
              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-4.5 h-4.5 rounded border border-[#E2D8CC] text-[#7A1526] accent-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/20 cursor-pointer shrink-0"
                />
                <label htmlFor="acceptTerms" className="text-xs sm:text-sm text-[#2B1B17] cursor-pointer leading-relaxed select-none">
                  {isMarathi ? (
                    <>
                      मी कदम विवाहच्या{' '}
                      <Link to="/terms" className="text-[#7A1526] font-semibold underline hover:text-[#8F1024]" target="_blank">
                        नियम व अटी
                      </Link>{' '}
                      आणि{' '}
                      <Link to="/privacy" className="text-[#7A1526] font-semibold underline hover:text-[#8F1024]" target="_blank">
                        गोपनीयता धोरण
                      </Link>{' '}
                      मान्य करतो/करते. *
                    </>
                  ) : (
                    <>
                      I accept the{' '}
                      <Link to="/terms" className="text-[#7A1526] font-semibold underline hover:text-[#8F1024]" target="_blank">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-[#7A1526] font-semibold underline hover:text-[#8F1024]" target="_blank">
                        Privacy Policy
                      </Link>
                      . *
                    </>
                  )}
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-xs sm:text-sm text-[#9E1B32] font-medium flex items-center gap-1 pl-7.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.acceptTerms}</span>
                </p>
              )}
            </div>

            {/* Primary Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-14 bg-[#7A1526] hover:bg-[#8F1024] disabled:bg-gray-400 text-white font-bold text-base sm:text-lg rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isMarathi ? 'नोंदणी होत आहे...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 shrink-0" />
                    <span>{isMarathi ? 'विनामूल्य प्रोफाइल तयार करा' : 'Create Free Profile'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Existing Member Prompt */}
            <div className="pt-3 border-t border-[#EAE0D2]/60 text-center text-xs sm:text-sm text-[#6B5E55]">
              {isMarathi ? 'आधीच खाते आहे? ' : 'Already have an account? '}
              <Link 
                to="/login" 
                className="font-semibold text-[#7A1526] hover:text-[#8F1024] hover:underline transition-colors"
              >
                {isMarathi ? 'लॉगिन करा' : 'Sign in'}
              </Link>
            </div>
          </div>
        </form>

        {/* Trust Line */}
        <p className="text-center text-xs sm:text-sm text-[#7A6E65] mt-6 sm:mt-8 flex items-center justify-center gap-1.5">
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

export default Register;
