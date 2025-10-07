import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/Toast';
import { UserPlus, Upload } from 'lucide-react';
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
  const { register } = useAuth();
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

  const validateForm = () => {
    const newErrors = {};

    // Required text fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // DOB - must be 18+
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const age = dayjs().diff(dayjs(formData.dob), 'year');
      if (age < 18) {
        newErrors.dob = 'You must be at least 18 years old';
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
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return 'Strong';
    }
    return 'Medium';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Password strength indicator
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const familyDetails = {
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        siblings: formData.siblings
      };

      const registrationData = {
        ...formData,
        familyDetails,
        photos: [] // Placeholder - will be handled by backend
      };

      await register(registrationData);
      showToast('Registration successful! Redirecting to profiles...', 'success');
      setTimeout(() => {
        navigate('/profiles');
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Registration failed. Please try again.', 'error');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent to-background py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Profile</h1>
          <p className="text-muted-foreground font-devanagari">आपले प्रोफाइल तयार करा</p>
          <p className="text-sm text-muted-foreground mt-2">
            It's completely <span className="font-semibold text-primary">free</span> • विनामूल्य
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Registration Form
            </CardTitle>
            <CardDescription>
              Fill in your details to create a matrimonial profile
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
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
                    <Label htmlFor="password">Password * (min 6 characters)</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? 'border-destructive' : ''}
                    />
                    {passwordStrength && (
                      <p className={`text-sm ${getPasswordStrengthColor()}`}>
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
                      placeholder="e.g., Bachelor's in Engineering"
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
                      placeholder="e.g., Software Engineer"
                      value={formData.occupation}
                      onChange={handleChange}
                      className={errors.occupation ? 'border-destructive' : ''}
                    />
                    {errors.occupation && <p className="text-sm text-destructive">{errors.occupation}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income (optional)</Label>
                  <Input
                    id="annualIncome"
                    name="annualIncome"
                    placeholder="e.g., 5-7 Lakhs"
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
                      value={formData.fatherName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      name="motherName"
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
                    placeholder="e.g., 1 brother, 1 sister"
                    value={formData.siblings}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">About You</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / About Yourself</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="Tell us about yourself, your interests, and what you're looking for in a partner..."
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Photos</h3>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Photo upload will be available after registration
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Note: Image upload uses cloud storage in production
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
                    Send me updates and newsletters (optional)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Free Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
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
