import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '../components/Toast';
import dayjs from 'dayjs';

/**
 * Admin Page - Profile management interface
 * 
 * Features:
 * - Protected route (admin only)
 * - List all profiles
 * - Add new profile
 * - Edit existing profile
 * - Delete profile
 * 
 * Note: This is a UI skeleton. Backend integration required for actual CRUD operations.
 */

export const Admin = () => {
  const { showToast, ToastContainer } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState(getEmptyFormData());

  useEffect(() => {
    loadProfiles();
  }, []);

  function getEmptyFormData() {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
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
      bio: ''
    };
  }

  const loadProfiles = () => {
    const mockProfiles = JSON.parse(localStorage.getItem('mockProfiles') || '[]');
    setProfiles(mockProfiles);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Replace with actual API call
    // if (editingProfile) {
    //   await api.put(`/profiles/${editingProfile.id}`, formData);
    // } else {
    //   await api.post('/profiles', formData);
    // }

    // Mock implementation
    const mockProfiles = JSON.parse(localStorage.getItem('mockProfiles') || '[]');
    
    if (editingProfile) {
      const index = mockProfiles.findIndex(p => p.id === editingProfile.id);
      if (index !== -1) {
        mockProfiles[index] = { ...editingProfile, ...formData };
      }
      showToast('Profile updated successfully', 'success');
    } else {
      const newProfile = {
        id: 'profile-' + Date.now(),
        ...formData,
        familyDetails: {
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          siblings: formData.siblings
        },
        photos: [],
        createdAt: new Date().toISOString()
      };
      mockProfiles.push(newProfile);
      showToast('Profile added successfully', 'success');
    }
    
    localStorage.setItem('mockProfiles', JSON.stringify(mockProfiles));
    loadProfiles();
    closeForm();
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      firstName: profile.firstName,
      middleName: profile.middleName || '',
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      dob: profile.dob,
      gender: profile.gender,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      caste: profile.caste,
      subCaste: profile.subCaste || '',
      education: profile.education,
      occupation: profile.occupation,
      annualIncome: profile.annualIncome || '',
      fatherName: profile.familyDetails?.fatherName || '',
      motherName: profile.familyDetails?.motherName || '',
      siblings: profile.familyDetails?.siblings || '',
      bio: profile.bio || ''
    });
    setShowForm(true);
  };

  const handleDelete = (profileId) => {
    if (!confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    // TODO: Replace with actual API call
    // await api.delete(`/profiles/${profileId}`);

    // Mock implementation
    const mockProfiles = JSON.parse(localStorage.getItem('mockProfiles') || '[]');
    const filtered = mockProfiles.filter(p => p.id !== profileId);
    localStorage.setItem('mockProfiles', JSON.stringify(filtered));
    loadProfiles();
    showToast('Profile deleted successfully', 'success');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProfile(null);
    setFormData(getEmptyFormData());
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage matrimonial profiles</p>
          </div>
          
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {editingProfile ? 'Edit Profile' : 'Add New Profile'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={closeForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
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
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste *</Label>
                    <Input
                      id="caste"
                      name="caste"
                      value={formData.caste}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subCaste">Sub-caste</Label>
                    <Input
                      id="subCaste"
                      name="subCaste"
                      value={formData.subCaste}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education *</Label>
                    <Input
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    {editingProfile ? 'Update Profile' : 'Add Profile'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Profiles List */}
        <Card>
          <CardHeader>
            <CardTitle>All Profiles ({profiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No profiles yet. Add your first profile above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Age</th>
                      <th className="text-left py-3 px-2">City</th>
                      <th className="text-left py-3 px-2">Education</th>
                      <th className="text-left py-3 px-2">Occupation</th>
                      <th className="text-right py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => {
                      const age = dayjs().diff(dayjs(profile.dob), 'year');
                      return (
                        <tr key={profile.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-2">
                            {profile.firstName} {profile.lastName}
                          </td>
                          <td className="py-3 px-2">{age}</td>
                          <td className="py-3 px-2">{profile.city}</td>
                          <td className="py-3 px-2">{profile.education}</td>
                          <td className="py-3 px-2">{profile.occupation}</td>
                          <td className="py-3 px-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(profile)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(profile.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Integration Note */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-1">Backend Integration Required</p>
            <p>
              This is a UI skeleton. Replace mock localStorage operations with actual API calls:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>POST /api/profiles - Create new profile</li>
              <li>PUT /api/profiles/:id - Update profile</li>
              <li>DELETE /api/profiles/:id - Delete profile</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
