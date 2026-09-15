import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/Toast';
import { UserPlus, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

/**
 * Register Page - Comprehensive registration form
 * 
 * Collects all matrimonial profile data:
 * - Personal info (name, DOB, gender, contact)
 * - Location (city, state, pincode)
 * - Community (caste, sub-caste)
 * - Education & occupation
 * - Family details
 * - Bio
 * - Photos (placeholder)
 * - Terms acceptance
 */

export const Register = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, logout, register } = useAuth();
  const { showToast, ToastContainer } = useToast();
  
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
    acceptTerms: false,
    optInNewsletter: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
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
        message: 'Please enter a valid email address'
      });
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
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
      const errorMsg = err.response?.data?.message || err.data?.message || err.message || 'Email verification failed';
      setEmailAvailability({ available: false, reason: 'error', message: errorMsg });
      setErrors(prev => ({ ...prev, email: errorMsg }));
    } finally {
      setEmailChecking(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required text fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email normalization & validation
    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!normalizedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (emailAvailability && !emailAvailability.available) {
      newErrors.email = emailAvailability.message || 'Please provide an available email address';
    }

    // Phone normalization & Indian mobile validation
    let cleanPhone = formData.phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleanPhone.startsWith('+91') && cleanPhone.length === 13) cleanPhone = cleanPhone.slice(3);
    else if (cleanPhone.startsWith('91') && cleanPhone.length === 12) cleanPhone = cleanPhone.slice(2);
    else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) cleanPhone = cleanPhone.slice(1);

    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    } else if (/^(\d)\1{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid mobile number (repeated digit patterns are not allowed)';
    }

    // Password rules: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[^A-Za-z0-9]/.test(formData.password)
    ) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // DOB - must be 18+ and valid
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const birthDate = dayjs(formData.dob);
      if (!birthDate.isValid() || birthDate.isAfter(dayjs())) {
        newErrors.dob = 'Please enter a valid date of birth';
      } else {
        const age = dayjs().diff(birthDate, 'year');
        if (age < 18) {
          newErrors.dob = 'You must be at least 18 years old to register';
        } else if (age > 100) {
          newErrors.dob = 'Please enter a valid date of birth';
        }
      }
    }

    // Location
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // Community
    if (!formData.caste.trim()) newErrors.caste = 'Caste is required';

    // Education & occupation
    if (!formData.education.trim()) newErrors.education = 'Education is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';

    // Terms
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms and Conditions and Privacy Policy';
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
      showToast('You are already logged in. Please log out to register a new account.', 'error');
      return;
    }

    if (!validateForm()) {
      showToast('Please fix the highlighted errors in the form', 'error');
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
      showToast('Account created! Please upload your photo to complete profile submission.', 'success');
      setTimeout(() => {
        navigate('/my-profile?onboarding=1');
      }, 1200);
    } catch (error) {
      console.error('Registration failed:', error);
      const resData = error.response?.data;
      const field = resData?.errors?.field;
      const message = resData?.message || error.message || 'Registration failed. Please try again.';
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
      case 'Medium': return 'text-yellow-600';
      case 'Strong': return 'text-green-600';
      default: return '';
    }
  };

  if (!authLoading && isAuthenticated()) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <ToastContainer />
        <Card className="max-w-md w-full text-center p-6 border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Already Logged In</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-2">
              You are currently signed in as <strong className="text-foreground">{user?.email}</strong> ({user?.firstName || user?.first_name} {user?.lastName || user?.last_name}).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              To register a new profile or switch accounts, please log out of your current session first.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button onClick={() => navigate('/my-profile')} className="w-full sm:w-auto">
                Go to My Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  await logout();
                  showToast('Logged out. You can now register a new account.', 'info');
                }}
                className="w-full sm:w-auto"
              >
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent to-background py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Matrimonial Profile</h1>
          <p className="text-muted-foreground font-devanagari">आपले प्रोफाइल तयार करा</p>
          <p className="text-sm text-muted-foreground mt-2">
            100% Free of Cost • <span className="font-semibold text-primary">विनामूल्य नोंदणी</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Matrimonial Registration Form
            </CardTitle>
            <CardDescription>
              Fill in your details to create a free matrimonial biodata
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth * (Must be 18+)</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      max={dayjs().subtract(18, 'year').format('YYYY-MM-DD')}
                      className={errors.dob ? 'border-destructive' : ''}
                    />
                    {errors.dob && <p className="text-sm text-destructive">{errors.dob}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email">Email *</Label>
                      {emailChecking && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          Checking...
                        </span>
                      )}
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      placeholder="e.g. rahul@example.com"
                      className={
                        errors.email
                          ? 'border-destructive'
                          : emailAvailability?.available
                          ? 'border-green-600 focus-visible:ring-green-600'
                          : ''
                      }
                    />
                    {emailChecking ? null : emailAvailability?.available ? (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{emailAvailability.message || 'Email is available'}</span>
                      </p>
                    ) : emailAvailability?.reason === 'duplicate' ? (
                      <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-md border border-destructive/20 mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{emailAvailability.message || 'An account with this email already exists.'}</span>
                        </div>
                        <Link
                          to="/login"
                          className="inline-flex items-center font-semibold underline hover:text-destructive/80 text-xs shrink-0"
                        >
                          Log In &rarr;
                        </Link>
                      </div>
                    ) : errors.email ? (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number * (10 digits)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Create Password</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password * (min 8 characters)</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="e.g. Secret@123"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Must contain uppercase, lowercase, number & special character
                    </p>
                    {passwordStrength && (
                      <p className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                        Strength: {passwordStrength}
                      </p>
                    )}
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Location</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode * (6 digits)</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={errors.pincode ? 'border-destructive' : ''}
                    />
                    {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Community */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Community</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste *</Label>
                    <Input
                      id="caste"
                      name="caste"
                      value={formData.caste}
                      onChange={handleChange}
                      className={errors.caste ? 'border-destructive' : ''}
                    />
                    {errors.caste && <p className="text-sm text-destructive">{errors.caste}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subCaste">Sub-caste (optional)</Label>
                    <Input
                      id="subCaste"
                      name="subCaste"
                      value={formData.subCaste}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Education & Occupation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Education & Occupation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education *</Label>
                    <Input
                      id="education"
                      name="education"
                      placeholder="e.g. B.E., MBA, MBBS, Post Graduate"
                      value={formData.education}
                      onChange={handleChange}
                      className={errors.education ? 'border-destructive' : ''}
                    />
                    {errors.education && <p className="text-sm text-destructive">{errors.education}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      placeholder="e.g. Software Engineer, Govt Service, Business"
                      value={formData.occupation}
                      onChange={handleChange}
                      className={errors.occupation ? 'border-destructive' : ''}
                    />
                    {errors.occupation && <p className="text-sm text-destructive">{errors.occupation}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income / Package (optional)</Label>
                  <Input
                    id="annualIncome"
                    name="annualIncome"
                    placeholder="e.g. 10-12 LPA"
                    value={formData.annualIncome}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Family Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Family Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      placeholder="e.g. Suresh Kadam"
                      value={formData.fatherName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      name="motherName"
                      placeholder="e.g. Sunita Kadam"
                      value={formData.motherName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siblings">Siblings</Label>
                  <Input
                    id="siblings"
                    name="siblings"
                    placeholder="e.g. 1 Brother, 1 Sister"
                    value={formData.siblings}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">About Candidate & Expectations</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">About You & Partner Expectations</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Tell prospective matches about yourself, your family background, and your expectations for a life partner..."
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Photograph</h3>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Photo upload required in the next onboarding step
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You will upload your photograph and submit your completed profile for admin approval right after account creation.
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptTerms" className="font-normal cursor-pointer">
                    I accept the{' '}
                    <Link to="/terms" className="text-primary hover:underline" target="_blank">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                    *
                  </Label>
                </div>
                {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="optInNewsletter"
                    name="optInNewsletter"
                    checked={formData.optInNewsletter}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <Label htmlFor="optInNewsletter" className="font-normal cursor-pointer">
                    Send me updates and notifications (optional)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register Free Profile'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already registered?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
