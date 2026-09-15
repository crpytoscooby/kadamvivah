import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  Heart, 
  HeartHandshake, 
  Send, 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Eye, 
  RefreshCw, 
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_AVATAR, handleImageError } from '../lib/avatarFallback';
import api from '../lib/api';
import dayjs from 'dayjs';

/**
 * Interests Page - Complete Matrimonial Match & Interest Hub
 * 
 * Features:
 * - Tab 1: Received Interests (Accept / Decline with custom confirmation modals)
 * - Tab 2: Sent Interests (Live status tracking)
 * - Tab 3: Matches / Accepted (Unlocked direct contact cards)
 * - Connected strictly to real PHP REST API and MariaDB backend.
 */
export const Interests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab state: 'received' | 'sent' | 'matches'
  const initialTab = searchParams.get('tab') || 'received';
  const [activeTab, setActiveTab] = useState(
    ['received', 'sent', 'matches'].includes(initialTab) ? initialTab : 'received'
  );

  // Data states
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [sentInterests, setSentInterests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [counts, setCounts] = useState({ pending_received: 0, matches: 0, sent_pending: 0 });
  const [loading, setLoading] = useState(true);

  // Modal Action States
  const [acceptingInterest, setAcceptingInterest] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const [decliningInterest, setDecliningInterest] = useState(null);
  const [declineLoading, setDeclineLoading] = useState(false);

  // Sync active tab with URL search params
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Keyboard shortcut: Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!acceptLoading && !declineLoading) {
          if (acceptingInterest) setAcceptingInterest(null);
          if (decliningInterest) setDecliningInterest(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [acceptingInterest, decliningInterest, acceptLoading, declineLoading]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes, matchesRes, countsRes] = await Promise.all([
        api.get('/interests/received'),
        api.get('/interests/sent'),
        api.get('/interests/matches'),
        api.get('/interests/counts')
      ]);

      setReceivedInterests(receivedRes.data?.data?.interests || []);
      setSentInterests(sentRes.data?.data?.interests || []);
      setMatches(matchesRes.data?.data?.matches || []);
      setCounts(countsRes.data?.data || { pending_received: 0, matches: 0, sent_pending: 0 });
    } catch (error) {
      console.error('Failed to load interests:', error);
      showToast(error.response?.data?.message || 'Failed to load interest requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAccept = async () => {
    if (!acceptingInterest || acceptLoading) return;

    const interestId = acceptingInterest.id;
    const candidateName = `${acceptingInterest.candidate?.firstName || acceptingInterest.candidate?.first_name || 'Candidate'}`;

    setAcceptLoading(true);
    try {
      const response = await api.post(`/interests/${interestId}/accept`);
      const unlockedData = response.data?.data;

      showToast(`Interest from ${candidateName} accepted! Contact details unlocked.`, 'success');

      // Update received interest list locally
      setReceivedInterests(prev => prev.map(item => {
        if (item.id === interestId) {
          return {
            ...item,
            status: 'accepted',
            contact_unlocked: true,
            contacts: unlockedData?.contacts || item.contacts
          };
        }
        return item;
      }));

      // Update counts
      setCounts(prev => ({
        ...prev,
        pending_received: Math.max(0, prev.pending_received - 1),
        matches: prev.matches + 1
      }));

      // Close modal and refresh all data in background
      setAcceptingInterest(null);
      fetchAllData();
    } catch (error) {
      console.error('Failed to accept interest:', error);
      showToast(error.response?.data?.message || 'Failed to accept interest request', 'error');
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleConfirmDecline = async () => {
    if (!decliningInterest || declineLoading) return;

    const interestId = decliningInterest.id;
    const candidateName = `${decliningInterest.candidate?.firstName || decliningInterest.candidate?.first_name || 'Candidate'}`;

    setDeclineLoading(true);
    try {
      await api.post(`/interests/${interestId}/reject`);
      showToast(`Interest request from ${candidateName} declined.`, 'success');

      // Update received list locally
      setReceivedInterests(prev => prev.map(item => {
        if (item.id === interestId) {
          return { ...item, status: 'declined' };
        }
        return item;
      }));

      // Update counts
      setCounts(prev => ({
        ...prev,
        pending_received: Math.max(0, prev.pending_received - 1)
      }));

      setDecliningInterest(null);
    } catch (error) {
      console.error('Failed to decline interest:', error);
      showToast(error.response?.data?.message || 'Failed to decline interest request', 'error');
    } finally {
      setDeclineLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const years = dayjs().diff(dayjs(dob), 'year');
    return isNaN(years) ? null : years;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Matches & Interest Requests</h1>
                <p className="text-sm text-gray-500">Manage incoming connection requests, outbound interests, and mutual matches</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/profiles">
              <Button size="sm" className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                Browse Profiles
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
          <button
            onClick={() => handleTabChange('received')}
            className={`flex items-center gap-2 py-3 px-4 sm:px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'received'
                ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Received Requests</span>
            {counts.pending_received > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                {counts.pending_received}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('sent')}
            className={`flex items-center gap-2 py-3 px-4 sm:px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'sent'
                ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Requests</span>
            {counts.sent_pending > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {counts.sent_pending}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('matches')}
            className={`flex items-center gap-2 py-3 px-4 sm:px-6 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'matches'
                ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Mutual Matches</span>
            {counts.matches > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-green-600 text-white rounded-full">
                {counts.matches}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* Loading State */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium text-gray-500">Loading your interests and matches...</p>
          </div>
        ) : (
          <div>
            {/* ===================================================================== */}
            {/* TAB 1: RECEIVED INTERESTS */}
            {/* ===================================================================== */}
            {activeTab === 'received' && (
              <div>
                {receivedInterests.length === 0 ? (
                  <Card className="py-16 text-center border-dashed">
                    <CardContent className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                        <Inbox className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">No Interests Received Yet</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        When other approved members express interest in your profile, their requests will appear here for you to accept or decline.
                      </p>
                      <div className="pt-2">
                        <Link to="/profiles">
                          <Button>Browse Profiles</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {receivedInterests.map((interest) => {
                      const c = interest.candidate;
                      const fullName = `${c?.firstName || c?.first_name || ''} ${c?.lastName || c?.last_name || ''}`.trim();
                      const age = calculateAge(c?.dob || c?.date_of_birth);
                      const photo = c?.primary_photo || c?.photos?.[0] || DEFAULT_AVATAR;
                      const isPending = interest.status === 'pending';
                      const isAccepted = interest.status === 'accepted';
                      const isDeclined = interest.status === 'declined';

                      return (
                        <Card key={interest.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow group flex flex-col h-full">
                          {/* Photo and Status Badge */}
                          <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden flex items-center justify-center">
                            <img
                              src={photo}
                              alt={fullName}
                              loading="lazy"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              onError={handleImageError}
                            />
                            <div className="absolute top-3 right-3">
                              {isPending && (
                                <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white rounded-full shadow-sm flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending Response
                                </span>
                              )}
                              {isAccepted && (
                                <span className="px-2.5 py-1 text-xs font-semibold bg-green-600 text-white rounded-full shadow-sm flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Matched
                                </span>
                              )}
                              {isDeclined && (
                                <span className="px-2.5 py-1 text-xs font-semibold bg-gray-600 text-white rounded-full shadow-sm flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Declined
                                </span>
                              )}
                            </div>
                            <div className="absolute bottom-3 left-3 text-white text-xs bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                              Received {dayjs(interest.created_at).format('DD MMM YYYY')}
                            </div>
                          </div>

                          <CardContent className="p-5 space-y-4">
                            {/* Candidate Info */}
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {fullName}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {age !== null && <span>{age} yrs</span>}
                                {c?.gender && <span className="capitalize">• {c.gender}</span>}
                                {c?.city && (
                                  <span className="flex items-center gap-1">
                                    • <MapPin className="w-3 h-3 text-gray-400" />
                                    {c.city}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Community & Career details */}
                            <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {c?.caste && (
                                <div>
                                  <span className="text-gray-400">Caste:</span> {c.caste} {c.sub_caste || c.subCaste ? `(${c.sub_caste || c.subCaste})` : ''}
                                </div>
                              )}
                              {c?.education && (
                                <div className="flex items-center gap-1.5 truncate">
                                  <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{c.education}</span>
                                </div>
                              )}
                              {c?.occupation && (
                                <div className="flex items-center gap-1.5 truncate">
                                  <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{c.occupation}</span>
                                </div>
                              )}
                            </div>

                            {/* Custom Message if any */}
                            {interest.message && (
                              <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-lg text-xs text-gray-700 italic flex items-start gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                <span>"{interest.message}"</span>
                              </div>
                            )}

                            {/* Unlocked Contact Details if accepted */}
                            {isAccepted && interest.contacts && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-900 space-y-1.5">
                                <div className="font-semibold text-green-800 flex items-center gap-1 mb-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Contact Details Unlocked:
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-green-700" />
                                  <a href={`tel:${interest.contacts.phone}`} className="font-medium hover:underline">
                                    {interest.contacts.phone}
                                  </a>
                                </div>
                                {interest.contacts.contact_email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-green-700" />
                                    <a href={`mailto:${interest.contacts.contact_email}`} className="font-medium hover:underline">
                                      {interest.contacts.contact_email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="pt-2 flex items-center gap-2">
                              <Link to={`/profiles/${c?.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                  View Profile
                                </Button>
                              </Link>

                              {isPending && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => setAcceptingInterest(interest)}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 font-medium"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDecliningInterest(interest)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2.5"
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB 2: SENT INTERESTS */}
            {/* ===================================================================== */}
            {activeTab === 'sent' && (
              <div>
                {sentInterests.length === 0 ? (
                  <Card className="py-16 text-center border-dashed">
                    <CardContent className="space-y-4">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                        <Send className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">No Sent Interests</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Browse approved matrimonial profiles on KadamVivah and send interest to connect with compatible matches.
                      </p>
                      <div className="pt-2">
                        <Link to="/profiles">
                          <Button>Browse Profiles</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sentInterests.map((interest) => {
                      const c = interest.candidate;
                      const fullName = `${c?.firstName || c?.first_name || ''} ${c?.lastName || c?.last_name || ''}`.trim();
                      const age = calculateAge(c?.dob || c?.date_of_birth);
                      const photo = c?.primary_photo || c?.photos?.[0] || DEFAULT_AVATAR;
                      const isPending = interest.status === 'pending';
                      const isAccepted = interest.status === 'accepted';
                      const isDeclined = interest.status === 'declined';

                      return (
                        <Card key={interest.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow group flex flex-col h-full">
                          <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden flex items-center justify-center">
                            <img
                              src={photo}
                              alt={fullName}
                              loading="lazy"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              onError={handleImageError}
                            />
                            <div className="absolute top-3 right-3">
                              {isPending && (
                                <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white rounded-full shadow-sm flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending Response
                                </span>
                              )}
                              {isAccepted && (
                                <span className="px-2.5 py-1 text-xs font-semibold bg-green-600 text-white rounded-full shadow-sm flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Accepted
                                </span>
                              )}
                              {isDeclined && (
                                <span className="px-2.5 py-1 text-xs font-semibold bg-gray-500 text-white rounded-full shadow-sm flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Declined
                                </span>
                              )}
                            </div>
                            <div className="absolute bottom-3 left-3 text-white text-xs bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                              Sent {dayjs(interest.created_at).format('DD MMM YYYY')}
                            </div>
                          </div>

                          <CardContent className="p-5 space-y-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {fullName}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {age !== null && <span>{age} yrs</span>}
                                {c?.gender && <span className="capitalize">• {c.gender}</span>}
                                {c?.city && (
                                  <span className="flex items-center gap-1">
                                    • <MapPin className="w-3 h-3 text-gray-400" />
                                    {c.city}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {c?.caste && (
                                <div>
                                  <span className="text-gray-400">Caste:</span> {c.caste}
                                </div>
                              )}
                              {c?.education && (
                                <div className="flex items-center gap-1.5 truncate">
                                  <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{c.education}</span>
                                </div>
                              )}
                              {c?.occupation && (
                                <div className="flex items-center gap-1.5 truncate">
                                  <Briefcase className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{c.occupation}</span>
                                </div>
                              )}
                            </div>

                            {/* Unlocked Contact Details if accepted */}
                            {isAccepted && interest.contacts && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-900 space-y-1.5">
                                <div className="font-semibold text-green-800 flex items-center gap-1 mb-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Contact Details Unlocked:
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-green-700" />
                                  <a href={`tel:${interest.contacts.phone}`} className="font-medium hover:underline">
                                    {interest.contacts.phone}
                                  </a>
                                </div>
                                {interest.contacts.contact_email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-green-700" />
                                    <a href={`mailto:${interest.contacts.contact_email}`} className="font-medium hover:underline">
                                      {interest.contacts.contact_email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="pt-2">
                              <Link to={`/profiles/${c?.id}`}>
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                  View Profile
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================================== */}
            {/* TAB 3: MUTUAL MATCHES / ACCEPTED */}
            {/* ===================================================================== */}
            {activeTab === 'matches' && (
              <div>
                {matches.length === 0 ? (
                  <Card className="py-16 text-center border-dashed">
                    <CardContent className="space-y-4">
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">No Mutual Matches Yet</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        When an interest request is mutually accepted, candidate contact details unlock automatically and the match will appear here.
                      </p>
                      <div className="pt-2">
                        <Link to="/profiles">
                          <Button>Browse Approved Profiles</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-green-600 text-white rounded-lg">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-green-900">Mutual Matches & Contact Directory</h4>
                        <p className="text-xs text-green-700">
                          These members have mutually accepted connections with you. Verified contact details are available below.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {matches.map((match) => {
                        const c = match.candidate;
                        const fullName = `${c?.firstName || c?.first_name || ''} ${c?.lastName || c?.last_name || ''}`.trim();
                        const age = calculateAge(c?.dob || c?.date_of_birth);
                        const photo = c?.primary_photo || c?.photos?.[0] || DEFAULT_AVATAR;
                        const contacts = match.contacts || {};

                        return (
                          <Card key={match.interest_id} className="overflow-hidden border-green-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                            <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden flex items-center justify-center">
                              <img
                                src={photo}
                                alt={fullName}
                                loading="lazy"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                onError={handleImageError}
                              />
                              <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-full shadow flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Mutual Match
                                </span>
                              </div>
                              <div className="absolute bottom-3 left-3 text-white text-xs bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                                Matched {dayjs(match.matched_at).format('DD MMM YYYY')}
                              </div>
                            </div>

                            <CardContent className="p-5 space-y-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{fullName}</h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  {age !== null && <span>{age} yrs</span>}
                                  {c?.gender && <span className="capitalize">• {c.gender}</span>}
                                  {c?.city && <span>• {c.city}, {c.state}</span>}
                                </div>
                              </div>

                              {/* Unlocked Contacts Box */}
                              <div className="p-4 bg-green-50/80 border border-green-200 rounded-xl space-y-3">
                                <div className="text-xs font-bold text-green-900 uppercase tracking-wider flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4 text-green-600" />
                                  Verified Contact Details
                                </div>

                                {contacts.phone && (
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <Phone className="w-4 h-4 text-green-600" />
                                      <span className="font-semibold text-gray-900">{contacts.phone}</span>
                                    </div>
                                    <a
                                      href={`tel:${contacts.phone}`}
                                      className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-medium transition-colors"
                                    >
                                      Call
                                    </a>
                                  </div>
                                )}

                                {contacts.alternate_phone && (
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-gray-700">
                                      <Phone className="w-4 h-4 text-gray-400" />
                                      <span>Alt / WhatsApp: {contacts.alternate_phone}</span>
                                    </div>
                                    <a
                                      href={`tel:${contacts.alternate_phone}`}
                                      className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
                                    >
                                      Call
                                    </a>
                                  </div>
                                )}

                                {contacts.contact_email && (
                                  <div className="flex items-center justify-between text-xs pt-1 border-t border-green-200/60">
                                    <div className="flex items-center gap-2 text-gray-700 truncate mr-2">
                                      <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                                      <span className="truncate">{contacts.contact_email}</span>
                                    </div>
                                    <a
                                      href={`mailto:${contacts.contact_email}`}
                                      className="px-2.5 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs rounded font-medium transition-colors flex-shrink-0"
                                    >
                                      Email
                                    </a>
                                  </div>
                                )}
                              </div>

                              <div className="pt-1">
                                <Link to={`/profiles/${c?.id}`}>
                                  <Button variant="outline" size="sm" className="w-full text-xs">
                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                    View Full Profile
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Accept Interest Confirmation Modal */}
      {/* ========================================================================= */}
      {acceptingInterest && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !acceptLoading) {
              setAcceptingInterest(null);
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
              <strong className="text-gray-900 font-semibold">
                {acceptingInterest.candidate?.firstName || acceptingInterest.candidate?.first_name} {acceptingInterest.candidate?.lastName || acceptingInterest.candidate?.last_name}
              </strong>.
            </p>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 mb-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>
                Upon accepting, your contact details (phone and email) will become visible to each other under <strong>Mutual Matches</strong>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAcceptingInterest(null)}
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
      {/* Decline Interest Confirmation Modal */}
      {/* ========================================================================= */}
      {decliningInterest && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !declineLoading) {
              setDecliningInterest(null);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Decline Interest Request?</h3>
                <p className="text-xs text-gray-500">Decline Match Invitation</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to decline the interest request from{' '}
              <strong className="text-gray-900 font-semibold">
                {decliningInterest.candidate?.firstName || decliningInterest.candidate?.first_name} {decliningInterest.candidate?.lastName || decliningInterest.candidate?.last_name}
              </strong>?
            </p>

            <p className="text-xs text-gray-500 mb-6">
              Your contact details will remain private and will not be shared.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDecliningInterest(null)}
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

export default Interests;
