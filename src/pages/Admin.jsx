import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useToast } from '../components/Toast';
import { handleImageError } from '../lib/avatarFallback';
import api from '../lib/api';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck, 
  Eye, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar,
  AlertTriangle,
  X,
  Camera
} from 'lucide-react';
import dayjs from 'dayjs';

/**
 * Admin Dashboard - Pending Profile Approval & Moderation
 * 
 * Secure Admin-only page connected to real PHP/MySQL API endpoints:
 * - GET  /api/admin/profiles/pending
 * - POST /api/admin/profiles/{id}/approve
 * - POST /api/admin/profiles/{id}/reject
 */

export const Admin = () => {
  const { showToast, ToastContainer } = useToast();
  
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewingProfile, setReviewingProfile] = useState(null);

  // Approve Confirmation Modal State
  const [approvingProfile, setApprovingProfile] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);

  // Reject Modal State
  const [rejectingProfile, setRejectingProfile] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  // Keyboard shortcut listener to close active modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!approveLoading && !rejectLoading) {
          if (approvingProfile) setApprovingProfile(null);
          else if (rejectingProfile) setRejectingProfile(null);
          else if (reviewingProfile) setReviewingProfile(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [approvingProfile, rejectingProfile, reviewingProfile, approveLoading, rejectLoading]);

  const fetchPendingProfiles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/profiles/pending');
      const profiles = response.data?.data?.profiles || [];
      setPendingProfiles(profiles);
    } catch (err) {
      console.error('Failed to fetch pending profiles:', err);
      showToast(err.message || 'Failed to load pending profiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openApproveModal = (profile) => {
    setApprovingProfile(profile);
  };

  const handleConfirmApprove = async () => {
    if (!approvingProfile || approveLoading) return;

    const profileId = approvingProfile.id;
    const candidateName = `${approvingProfile.first_name} ${approvingProfile.last_name}`;

    setApproveLoading(true);
    try {
      await api.post(`/admin/profiles/${profileId}/approve`);
      showToast(`Profile of ${candidateName} has been approved!`, 'success');
      
      // Remove approved profile from pending list immediately
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));

      // Close modals
      setApprovingProfile(null);
      if (reviewingProfile?.id === profileId) {
        setReviewingProfile(null);
      }
    } catch (err) {
      console.error('Approval failed:', err);
      showToast(err.message || 'Failed to approve profile', 'error');
    } finally {
      setApproveLoading(false);
    }
  };

  const openRejectModal = (profile) => {
    setRejectingProfile(profile);
    setRejectionReason('');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejection.', 'error');
      return;
    }

    const profileId = rejectingProfile.id;
    const candidateName = `${rejectingProfile.first_name} ${rejectingProfile.last_name}`;

    setRejectLoading(true);
    try {
      await api.post(`/admin/profiles/${profileId}/reject`, {
        rejection_reason: rejectionReason.trim()
      });

      showToast(`Profile of ${candidateName} marked as rejected.`, 'success');

      // Remove from list
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
      
      // Close modals
      setRejectingProfile(null);
      setRejectionReason('');
      if (reviewingProfile?.id === profileId) {
        setReviewingProfile(null);
      }
    } catch (err) {
      console.error('Rejection failed:', err);
      showToast(err.message || 'Failed to reject profile', 'error');
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Moderation Dashboard</h1>
                <p className="text-sm text-gray-500">Review, approve or reject incoming matrimonial profiles</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchPendingProfiles} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Review: {pendingProfiles.length}
            </div>
          </div>
        </div>

        {/* Pending Profiles List */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-gray-900">Profiles Awaiting Approval</CardTitle>
                <CardDescription>
                  These profiles were recently registered and are hidden from public view until approved.
                </CardDescription>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full">
                {pendingProfiles.length} Pending
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3" />
                <p className="text-sm font-medium">Loading pending profiles from database...</p>
              </div>
            ) : pendingProfiles.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">All Caught Up!</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  There are no pending profile approval requests at this moment. New registrations will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Candidate</th>
                      <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Age / Gender</th>
                      <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Location</th>
                      <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Education & Job</th>
                      <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Contact</th>
                      <th className="px-6 py-3.5 text-left font-semibold text-gray-700">Registered On</th>
                      <th className="px-6 py-3.5 text-right font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {pendingProfiles.map((p) => {
                      const age = p.date_of_birth ? dayjs().diff(dayjs(p.date_of_birth), 'year') : 'N/A';
                      const candidateName = `${p.first_name} ${p.last_name}`;
                      const isApproving = approveLoading && approvingProfile?.id === p.id;
                      const isRejecting = rejectLoading && rejectingProfile?.id === p.id;
                      const isBusy = approveLoading || rejectLoading;

                      return (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-gray-200 aspect-[4/5] flex items-center justify-center">
                                <img
                                  src={p.primary_photo || (p.photos && p.photos[0]) || '/placeholder-avatar.svg'}
                                  alt={candidateName}
                                  className="w-full h-full object-cover object-center"
                                  onError={handleImageError}
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{candidateName}</div>
                                {p.caste && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Caste: {p.caste} {p.sub_caste ? `(${p.sub_caste})` : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-gray-600 capitalize">
                            {age} yrs • {p.gender}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span>{p.city || 'Pune'}, {p.state || 'Maharashtra'}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            <div className="font-medium text-gray-800">{p.education || 'Not specified'}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{p.occupation || 'Not specified'}</div>
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            <div className="text-xs flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              {p.phone}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              {p.user_email || p.contact_email}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-xs text-gray-500">
                            {dayjs(p.created_at).format('DD MMM YYYY, hh:mm A')}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Inspect Full Details */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReviewingProfile(p)}
                                title="Inspect Full Profile Details"
                                disabled={isBusy}
                                className="h-8 px-2.5 text-xs text-gray-700"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                Review
                              </Button>

                              {/* Approve Button */}
                              <Button
                                size="sm"
                                onClick={() => openApproveModal(p)}
                                disabled={isBusy}
                                className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white font-medium"
                              >
                                {isApproving ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                    Approve
                                  </>
                                )}
                              </Button>

                              {/* Reject Button */}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openRejectModal(p)}
                                disabled={isBusy}
                                className="h-8 px-2.5 text-xs font-medium"
                              >
                                {isRejecting ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5 mr-1" />
                                    Reject
                                  </>
                                )}
                              </Button>
                            </div>
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
      </div>

      {/* ========================================================================= */}
      {/* Profile Review Modal */}
      {/* ========================================================================= */}
      {reviewingProfile && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !approveLoading && !rejectLoading) {
              setReviewingProfile(null);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                  Pending Approval
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {reviewingProfile.first_name} {reviewingProfile.middle_name ? `${reviewingProfile.middle_name} ` : ''}{reviewingProfile.last_name}
                </h3>
              </div>
              <button 
                onClick={() => setReviewingProfile(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                disabled={approveLoading || rejectLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
              {/* Profile Photographs */}
              <div>
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Candidate Photographs ({reviewingProfile.photos?.length || (reviewingProfile.primary_photo ? 1 : 0)})
                </h4>
                {(!reviewingProfile.photos || reviewingProfile.photos.length === 0) && !reviewingProfile.primary_photo ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>No photos uploaded for this profile yet.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(reviewingProfile.photos && reviewingProfile.photos.length > 0 
                      ? reviewingProfile.photos 
                      : [reviewingProfile.primary_photo]
                    ).map((photoUrl, idx) => (
                      <div 
                        key={idx} 
                        className="relative rounded-lg overflow-hidden border border-gray-200 bg-muted aspect-[4/5] w-full flex items-center justify-center shadow-sm"
                      >
                        <img
                          src={photoUrl}
                          alt={`Candidate Photo ${idx + 1}`}
                          className="w-full h-full object-cover object-center"
                          onError={handleImageError}
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Personal Details */}
              <div>
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-primary mb-3">
                  Personal & Location
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-xs text-gray-500 block">Gender:</span>
                    <span className="font-medium capitalize">{reviewingProfile.gender}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Date of Birth:</span>
                    <span className="font-medium">{reviewingProfile.date_of_birth}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Marital Status:</span>
                    <span className="font-medium capitalize">{reviewingProfile.marital_status?.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">City & State:</span>
                    <span className="font-medium">{reviewingProfile.city}, {reviewingProfile.state}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Pincode:</span>
                    <span className="font-medium">{reviewingProfile.pincode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Height:</span>
                    <span className="font-medium">{reviewingProfile.height || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Community & Career */}
              <div>
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-primary mb-3">
                  Community, Education & Career
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-xs text-gray-500 block">Caste:</span>
                    <span className="font-medium">{reviewingProfile.caste || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Sub-Caste:</span>
                    <span className="font-medium">{reviewingProfile.sub_caste || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Gotra:</span>
                    <span className="font-medium">{reviewingProfile.gotra || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Education:</span>
                    <span className="font-medium">{reviewingProfile.education || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Occupation:</span>
                    <span className="font-medium">{reviewingProfile.occupation || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Annual Income:</span>
                    <span className="font-medium">{reviewingProfile.annual_income || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Family Details */}
              <div>
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-primary mb-3">
                  Family Background
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-xs text-gray-500 block">Father's Name:</span>
                    <span className="font-medium">{reviewingProfile.father_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Mother's Name:</span>
                    <span className="font-medium">{reviewingProfile.mother_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Siblings:</span>
                    <span className="font-medium">{reviewingProfile.siblings || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-primary mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-xs text-gray-500 block">Phone:</span>
                    <span className="font-medium text-gray-900">{reviewingProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">User Email:</span>
                    <span className="font-medium text-gray-900">{reviewingProfile.user_email}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Hobbies */}
              {reviewingProfile.bio && (
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-primary mb-2">
                    About / Bio
                  </h4>
                  <p className="bg-gray-50 p-3 rounded-lg text-gray-700 italic">
                    "{reviewingProfile.bio}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setReviewingProfile(null)}
                disabled={approveLoading || rejectLoading}
              >
                Close
              </Button>
              <Button 
                variant="destructive"
                onClick={() => openRejectModal(reviewingProfile)}
                disabled={approveLoading || rejectLoading}
              >
                Reject Profile
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => openApproveModal(reviewingProfile)}
                disabled={approveLoading || rejectLoading}
              >
                Approve Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Approve Confirmation Modal */}
      {/* ========================================================================= */}
      {approvingProfile && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !approveLoading) {
              setApprovingProfile(null);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-green-600 mb-4">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Approve Profile?</h3>
                <p className="text-xs text-gray-500">KadamVivah Profile Moderation</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to approve the profile for{' '}
              <strong className="text-gray-900 font-semibold">
                {approvingProfile.first_name} {approvingProfile.last_name}
              </strong>
              ? This profile will immediately become visible to approved members on KadamVivah.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setApprovingProfile(null)}
                disabled={approveLoading}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleConfirmApprove}
                disabled={approveLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2"
              >
                {approveLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Approve Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Rejection Reason Modal */}
      {/* ========================================================================= */}
      {rejectingProfile && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !rejectLoading) {
              setRejectingProfile(null);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reject Profile</h3>
                <p className="text-xs text-gray-500">Provide feedback reason for rejection</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Please specify the reason for rejecting the profile of{' '}
              <strong className="text-gray-900 font-semibold">
                {rejectingProfile.first_name} {rejectingProfile.last_name}
              </strong>.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <Label htmlFor="rejectionReason" className="text-xs font-semibold text-gray-700">
                  Rejection Reason *
                </Label>
                <Textarea
                  id="rejectionReason"
                  rows={3}
                  placeholder="e.g. Incomplete profile information or invalid contact details."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                  disabled={rejectLoading}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setRejectingProfile(null)}
                  disabled={rejectLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="destructive"
                  disabled={rejectLoading}
                  className="flex items-center gap-2"
                >
                  {rejectLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    'Confirm Rejection'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
