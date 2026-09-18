import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Camera,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import dayjs from 'dayjs';

/**
 * Admin Dashboard - Pending Profile Approval & Moderation
 * 
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) primary accents & actions
 * - Antique Gold (#B88E4B) badges & highlights
 * - Warm borders (#EAE0D2) & structured moderation tables
 * - Preserved all approval/rejection endpoints and session checks
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
      showToast(`Profile of ${candidateName} approved successfully!`, 'success');
      
      // Remove from list locally
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
      setApprovingProfile(null);
      
      // If review modal was open for this profile, close it
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
    if (!rejectingProfile || rejectLoading) return;

    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejecting this profile', 'error');
      return;
    }

    const profileId = rejectingProfile.id;
    const candidateName = `${rejectingProfile.first_name} ${rejectingProfile.last_name}`;

    setRejectLoading(true);
    try {
      await api.post(`/admin/profiles/${profileId}/reject`, {
        reason: rejectionReason.trim()
      });
      showToast(`Profile of ${candidateName} has been rejected.`, 'info');

      // Remove from list locally
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId));
      setRejectingProfile(null);

      // If review modal was open for this profile, close it
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

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-5 border-b border-[#EAE0D2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span>Administration Moderation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1B17]">
              Admin Moderation Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-0.5">
              Review, approve or reject incoming matrimonial profiles before they go live on search.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button 
              type="button"
              onClick={fetchPendingProfiles} 
              disabled={loading}
              className="px-3.5 py-2 bg-white border border-[#E2D8CC] hover:border-[#7A1526] text-[#2B1B17] text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#7A1526] ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="px-3 py-1.5 bg-[#FFFBF2] border border-[#E9D8B4] rounded-xl text-[#7A5416] text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B88E4B]" />
              <span>Pending: {pendingProfiles.length}</span>
            </div>
          </div>
        </div>

        {/* Pending Profiles Card Table */}
        <div className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs">
          <div className="p-5 sm:p-6 border-b border-[#EAE0D2]/70 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2B1B17]">
                Profiles Awaiting Approval
              </h2>
              <p className="text-xs text-[#7A6E65] mt-0.5">
                These profiles were recently registered and remain hidden from public search until approved.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-[#FFFBF2] border border-[#E9D8B4] text-[#7A5416] rounded-full">
              {pendingProfiles.length} Pending
            </span>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="p-16 text-center text-[#7A6E65] flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-[#7A1526] mb-3" />
                <p className="text-sm font-semibold text-[#2B1B17]">Loading pending profiles from database...</p>
              </div>
            ) : pendingProfiles.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-14 h-14 bg-[#F4F9F4] text-green-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#CDE4CD]">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17] mb-1">All Caught Up!</h3>
                <p className="text-xs sm:text-sm text-[#6B5E55] max-w-md mx-auto">
                  There are no pending profile approval requests at this moment. New registrations will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#EAE0D2] text-xs sm:text-sm">
                  <thead className="bg-[#FAF7F2]">
                    <tr>
                      <th className="px-5 py-3.5 text-left font-bold text-[#2B1B17]">Candidate</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#2B1B17]">Age / Gender</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#2B1B17]">Location</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#2B1B17]">Education & Job</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#2B1B17]">Contact</th>
                      <th className="px-5 py-3.5 text-left font-bold text-[#2B1B17]">Registered On</th>
                      <th className="px-5 py-3.5 text-right font-bold text-[#2B1B17]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#EAE0D2]/60">
                    {pendingProfiles.map((p) => {
                      const age = p.date_of_birth ? dayjs().diff(dayjs(p.date_of_birth), 'year') : 'N/A';
                      const candidateName = `${p.first_name} ${p.last_name}`;
                      const isApproving = approveLoading && approvingProfile?.id === p.id;
                      const isRejecting = rejectLoading && rejectingProfile?.id === p.id;
                      const isBusy = approveLoading || rejectLoading;

                      return (
                        <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#EAE0D2] shrink-0 flex items-center justify-center">
                                <img
                                  src={p.primary_photo || (p.photos && p.photos[0]) || '/placeholder-avatar.svg'}
                                  alt={candidateName}
                                  className="w-full h-full object-cover object-center"
                                  onError={handleImageError}
                                />
                              </div>
                              <div>
                                <div className="font-bold text-[#2B1B17]">{candidateName}</div>
                                {p.caste && (
                                  <div className="text-[11px] text-[#7A1526] font-medium mt-0.5">
                                    Community: {p.caste}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-[#6B5E55] capitalize">
                            {age} yrs • {p.gender}
                          </td>

                          <td className="px-5 py-4 text-[#6B5E55]">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#7A1526] shrink-0" />
                              <span>{p.city || 'Pune'}, {p.state || 'Maharashtra'}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-[#6B5E55]">
                            <div className="font-semibold text-[#2B1B17]">{p.education || 'Not specified'}</div>
                            <div className="text-[11px] text-[#7A6E65] mt-0.5">{p.occupation || 'Not specified'}</div>
                          </td>

                          <td className="px-5 py-4 text-[#6B5E55]">
                            <div className="text-xs flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#7A6E65]" />
                              <span>{p.phone}</span>
                            </div>
                            <div className="text-[11px] text-[#7A6E65] mt-0.5 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#7A6E65]" />
                              <span className="truncate max-w-[140px]">{p.user_email || p.contact_email}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-xs text-[#7A6E65]">
                            {dayjs(p.created_at).format('DD MMM YYYY, hh:mm A')}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Inspect Full Details */}
                              <button
                                type="button"
                                onClick={() => setReviewingProfile(p)}
                                title="Inspect Full Profile Details"
                                disabled={isBusy}
                                className="px-2.5 py-1.5 bg-white border border-[#E2D8CC] hover:border-[#7A1526] text-[#2B1B17] text-xs font-semibold rounded-lg transition cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 inline mr-1 text-[#7A1526]" />
                                Review
                              </button>

                              {/* Approve Button */}
                              <button
                                type="button"
                                onClick={() => openApproveModal(p)}
                                disabled={isBusy}
                                className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs"
                              >
                                {isApproving ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Approve
                                  </>
                                )}
                              </button>

                              {/* Reject Button */}
                              <button
                                type="button"
                                onClick={() => openRejectModal(p)}
                                disabled={isBusy}
                                className="px-2.5 py-1.5 bg-[#FDF2F2] border border-[#F5C2C7] hover:bg-red-100 text-[#9E1B32] text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer"
                              >
                                {isRejecting ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" />
                                    Reject
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingProfile && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !approveLoading && !rejectLoading) {
              setReviewingProfile(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#EAE0D2] flex items-center justify-between bg-[#FAF7F2]">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-[#FFFBF2] border border-[#E9D8B4] text-[#7A5416] rounded-full">
                  Pending Approval
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2B1B17] mt-1">
                  {reviewingProfile.first_name} {reviewingProfile.middle_name ? `${reviewingProfile.middle_name} ` : ''}{reviewingProfile.last_name}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setReviewingProfile(null)}
                className="p-1.5 rounded-lg text-[#7A6E65] hover:text-[#2B1B17] hover:bg-white transition cursor-pointer"
                disabled={approveLoading || rejectLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#6B5E55]">
              {/* Photos Gallery */}
              <div>
                <h4 className="font-bold text-[#2B1B17] mb-2 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#7A1526]" />
                  Uploaded Photos
                </h4>
                {reviewingProfile.photos && reviewingProfile.photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {reviewingProfile.photos.map((photoUrl, idx) => (
                      <div key={idx} className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE0D2]">
                        <img 
                          src={photoUrl} 
                          alt="Photo" 
                          className="w-full h-full object-cover" 
                          onError={handleImageError} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7A6E65] italic">No photos uploaded</p>
                )}
              </div>

              {/* Biodata Fields */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE0D2]">
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Gender:</span>
                  <span className="font-semibold text-[#2B1B17] capitalize">{reviewingProfile.gender}</span>
                </div>
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Date of Birth:</span>
                  <span className="font-semibold text-[#2B1B17]">{reviewingProfile.date_of_birth || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Community:</span>
                  <span className="font-semibold text-[#2B1B17]">{reviewingProfile.caste || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Location:</span>
                  <span className="font-semibold text-[#2B1B17]">{reviewingProfile.city}, {reviewingProfile.state}</span>
                </div>
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Education:</span>
                  <span className="font-semibold text-[#2B1B17]">{reviewingProfile.education || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Occupation:</span>
                  <span className="font-semibold text-[#2B1B17]">{reviewingProfile.occupation || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Annual Income:</span>
                  <span className="font-semibold text-[#2B1B17]">{reviewingProfile.annual_income || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#7A6E65] block text-[11px]">Phone:</span>
                  <span className="font-semibold text-[#2B1B17]">{reviewingProfile.phone}</span>
                </div>
              </div>

              {/* Bio */}
              {reviewingProfile.bio && (
                <div>
                  <h4 className="font-bold text-[#2B1B17] mb-1">About & Expectations:</h4>
                  <p className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE0D2] whitespace-pre-line text-xs leading-relaxed">
                    {reviewingProfile.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#EAE0D2] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewingProfile(null)}
                className="px-4 py-2 border border-[#E2D8CC] hover:bg-white text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
                disabled={approveLoading || rejectLoading}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => openRejectModal(reviewingProfile)}
                className="px-4 py-2 bg-[#FDF2F2] border border-[#F5C2C7] hover:bg-red-100 text-[#9E1B32] text-xs font-bold rounded-xl transition cursor-pointer"
                disabled={approveLoading || rejectLoading}
              >
                Reject Profile
              </button>
              <button
                type="button"
                onClick={() => openApproveModal(reviewingProfile)}
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                disabled={approveLoading || rejectLoading}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approvingProfile && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !approveLoading) {
              setApprovingProfile(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17]">Approve Profile?</h3>
                <p className="text-xs text-[#7A6E65]">Publish to Matrimonial Search</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5E55] mb-4 leading-relaxed">
              Are you sure you want to approve the profile for <strong className="text-[#2B1B17] font-semibold">{approvingProfile.first_name} {approvingProfile.last_name}</strong>?
            </p>

            <p className="text-xs text-[#7A6E65] mb-6">
              This will make the candidate immediately visible on the public Browse Profiles page.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setApprovingProfile(null)}
                disabled={approveLoading}
                className="px-4 py-2 border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={approveLoading}
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {approveLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Yes, Approve Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingProfile && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !rejectLoading) {
              setRejectingProfile(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#FDF2F2] border border-[#F5C2C7] rounded-xl text-[#9E1B32]">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17]">Reject Profile</h3>
                <p className="text-xs text-[#7A6E65]">Request Profile Corrections</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <p className="text-xs sm:text-sm text-[#6B5E55] leading-relaxed">
                Provide feedback explaining why the profile of <strong className="text-[#2B1B17] font-semibold">{rejectingProfile.first_name} {rejectingProfile.last_name}</strong> requires revision.
              </p>

              <div>
                <label htmlFor="rejectReason" className="block text-xs font-bold text-[#2B1B17] mb-1.5">
                  Reason for Rejection *
                </label>
                <textarea
                  id="rejectReason"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Please upload a clearer face photograph, or fill in proper education details."
                  className="w-full p-3 text-xs sm:text-sm border border-[#E2D8CC] rounded-xl bg-white text-[#2B1B17] placeholder:text-[#A89D91] focus:outline-none focus:border-[#7A1526] focus:ring-2 focus:ring-[#7A1526]/15 transition"
                  required
                  disabled={rejectLoading}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingProfile(null)}
                  disabled={rejectLoading}
                  className="px-4 py-2 border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectLoading}
                  className="px-5 py-2 bg-[#9E1B32] hover:bg-[#7A1526] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {rejectLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    'Confirm Rejection'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
