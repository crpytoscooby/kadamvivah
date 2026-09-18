import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
 * Styled with KadamVivah premium design system:
 * - Warm Ivory (#FAF7F2) background
 * - Deep Maroon (#7A1526) primary tabs, badges & buttons
 * - Antique Gold (#B88E4B) accents & highlight counts
 * - Warm borders (#EAE0D2) & structured matrimonial cards
 * - Strict Marathi & English single-language support
 * - Preserved real PHP REST API and MariaDB matching logic
 */

export const Interests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');
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
      showToast(error.response?.data?.message || (isMarathi ? 'माहिती लोड करण्यात त्रुटी आली' : 'Failed to load interest requests'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAccept = async () => {
    if (!acceptingInterest || acceptLoading) return;

    const interestId = acceptingInterest.id;
    const candidateName = `${acceptingInterest.candidate?.firstName || acceptingInterest.candidate?.first_name || (isMarathi ? 'उमेदवार' : 'Candidate')}`;

    setAcceptLoading(true);
    try {
      const response = await api.post(`/interests/${interestId}/accept`);
      const unlockedData = response.data?.data;

      showToast(
        isMarathi 
          ? `${candidateName} यांची पसंती विनंती स्वीकारली! संपर्क अनलॉक झाला.` 
          : `Interest from ${candidateName} accepted! Contact details unlocked.`, 
        'success'
      );

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

      setAcceptingInterest(null);
      fetchAllData();
    } catch (error) {
      console.error('Failed to accept interest:', error);
      showToast(error.response?.data?.message || (isMarathi ? 'विनंती स्वीकारण्यात त्रुटी आली' : 'Failed to accept interest request'), 'error');
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleConfirmDecline = async () => {
    if (!decliningInterest || declineLoading) return;

    const interestId = decliningInterest.id;
    const candidateName = `${decliningInterest.candidate?.firstName || decliningInterest.candidate?.first_name || (isMarathi ? 'उमेदवार' : 'Candidate')}`;

    setDeclineLoading(true);
    try {
      await api.post(`/interests/${interestId}/reject`);
      showToast(
        isMarathi 
          ? `${candidateName} यांची पसंती विनंती नाकारली.` 
          : `Interest request from ${candidateName} declined.`, 
        'success'
      );

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
      showToast(error.response?.data?.message || (isMarathi ? 'विनंती नाकारण्यात त्रुटी आली' : 'Failed to decline interest request'), 'error');
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
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-5 border-b border-[#EAE0D2]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#F8F3EA] border border-[#D9C39E] rounded-full text-xs font-semibold text-[#7A1526] shadow-2xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
              <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
                {isMarathi ? 'पसंती व जुळणी केंद्र' : 'Matches & Connections'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2B1B17]">
              {isMarathi ? 'पसंती विनंत्या आणि जुळलेली स्थळे' : 'Matches & Interest Requests'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-0.5">
              {isMarathi 
                ? 'आलेल्या विनंत्या, पाठवलेली पसंती आणि परस्पर जुळलेल्या स्थळांचे व्यवस्थापन करा.'
                : 'Manage incoming connection requests, outbound interests, and mutual matches.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={fetchAllData}
              disabled={loading}
              className="px-3.5 py-2 bg-white border border-[#E2D8CC] hover:border-[#7A1526] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1B17] transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#7A1526] ${loading ? 'animate-spin' : ''}`} />
              <span>{isMarathi ? 'रीफ्रेश' : 'Refresh'}</span>
            </button>
            <Link
              to="/profiles"
              className="px-4 py-2 bg-[#7A1526] hover:bg-[#8F1024] text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[#D9C39E]" />
              <span>{isMarathi ? 'स्थळे शोधा' : 'Browse Profiles'}</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EAE0D2] mb-8 overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => handleTabChange('received')}
            className={`flex items-center gap-2 py-3 px-4 sm:px-6 font-semibold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer rounded-t-xl ${
              activeTab === 'received'
                ? 'border-[#7A1526] text-[#7A1526] bg-[#F8F3EA]/70'
                : 'border-transparent text-[#7A6E65] hover:text-[#2B1B17] hover:border-[#EAE0D2]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>{isMarathi ? 'आलेल्या विनंत्या' : 'Received Requests'}</span>
            {counts.pending_received > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-[#7A1526] text-white rounded-full">
                {counts.pending_received}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('matches')}
            className={`flex items-center gap-2 py-3 px-4 sm:px-6 font-semibold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer rounded-t-xl ${
              activeTab === 'matches'
                ? 'border-[#7A1526] text-[#7A1526] bg-[#F8F3EA]/70'
                : 'border-transparent text-[#7A6E65] hover:text-[#2B1B17] hover:border-[#EAE0D2]'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{isMarathi ? 'जुळलेली स्थळे' : 'Mutual Matches'}</span>
            {counts.matches > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-green-700 text-white rounded-full">
                {counts.matches}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('sent')}
            className={`flex items-center gap-2 py-3 px-4 sm:px-6 font-semibold text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer rounded-t-xl ${
              activeTab === 'sent'
                ? 'border-[#7A1526] text-[#7A1526] bg-[#F8F3EA]/70'
                : 'border-transparent text-[#7A6E65] hover:text-[#2B1B17] hover:border-[#EAE0D2]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isMarathi ? 'पाठवलेली पसंती' : 'Sent Interests'}</span>
            {counts.sent_pending > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-[#B88E4B] text-white rounded-full">
                {counts.sent_pending}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Received Interests */}
        {activeTab === 'received' && (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#7A1526] border-t-transparent mx-auto mb-3"></div>
                <p className="text-xs sm:text-sm text-[#7A6E65]">{isMarathi ? 'विनंत्या लोड होत आहेत...' : 'Loading received requests...'}</p>
              </div>
            ) : receivedInterests.length === 0 ? (
              <div className="text-center py-16 bg-white/95 border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-8 shadow-xs">
                <div className="w-14 h-14 bg-[#F8F3EA] border border-[#D9C39E] rounded-full flex items-center justify-center mx-auto text-[#7A1526] mb-3 shadow-2xs">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17] mb-1">
                  {isMarathi ? 'सध्या कोणतीही पसंती विनंती आलेली नाही' : 'No Received Requests Yet'}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E55] max-w-md mx-auto mb-6">
                  {isMarathi 
                    ? 'इतर सभासदांकडून पसंती आल्यास त्या येथे दिसतील. आपणही शोध सूचीमधून योग्य स्थळांना पसंती पाठवू शकता.'
                    : 'When other members express interest in your profile, their requests will appear here.'}
                </p>
                <Link
                  to="/profiles"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A1526] hover:bg-[#8F1024] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs"
                >
                  <Heart className="w-4 h-4 fill-current text-[#D9C39E]" />
                  <span>{isMarathi ? 'स्थळे शोधा' : 'Browse Profiles'}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {receivedInterests.map((interest) => {
                  const candidate = interest.candidate || {};
                  const candAge = calculateAge(candidate.dob || candidate.date_of_birth);
                  const candName = `${candidate.firstName || candidate.first_name || ''} ${candidate.lastName || candidate.last_name || ''}`.trim() || (isMarathi ? 'उमेदवार' : 'Candidate');
                  const candPhoto = candidate.primary_photo || candidate.photos?.[0] || DEFAULT_AVATAR;
                  const isAccepted = interest.status === 'accepted';
                  const isDeclined = interest.status === 'declined';
                  const isPending = interest.status === 'pending';

                  return (
                    <div
                      key={interest.id}
                      className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition hover:border-[#D9C39E]"
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE0D2] shrink-0">
                            <img
                              src={candPhoto}
                              alt={candName}
                              className="w-full h-full object-cover object-center"
                              onError={handleImageError}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-bold text-[#2B1B17] text-base truncate mb-0.5">
                              {candName}
                            </h3>
                            <div className="text-xs text-[#7A6E65] space-y-0.5">
                              {candAge && <p>{candAge} {isMarathi ? 'वर्षे' : 'yrs'}</p>}
                              {candidate.city && <p className="truncate">{candidate.city}{candidate.state ? `, ${candidate.state}` : ''}</p>}
                              {candidate.caste && <p className="truncate font-medium text-[#7A1526]">{candidate.caste}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-3">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFFBF2] border border-[#E9D8B4] text-[#7A5416]">
                              <Clock className="w-3 h-3 text-[#B88E4B]" />
                              <span>{isMarathi ? 'प्रतिसादाची प्रतीक्षा' : 'Pending Your Response'}</span>
                            </span>
                          )}
                          {isAccepted && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F4F9F4] border border-[#CDE4CD] text-green-800">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              <span>{isMarathi ? 'स्वीकारले • परस्पर जुळणी' : 'Accepted • Mutual Match'}</span>
                            </span>
                          )}
                          {isDeclined && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              <XCircle className="w-3 h-3" />
                              <span>{isMarathi ? 'नाकारले' : 'Declined'}</span>
                            </span>
                          )}
                        </div>

                        {/* Candidate Message if any */}
                        {interest.message && (
                          <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE0D2] text-xs text-[#6B5E55] mb-3 flex items-start gap-2 italic">
                            <MessageSquare className="w-3.5 h-3.5 text-[#B88E4B] shrink-0 mt-0.5 not-italic" />
                            <span>"{interest.message}"</span>
                          </div>
                        )}

                        <p className="text-[11px] text-[#A89D91]">
                          {isMarathi ? 'तारीख:' : 'Received:'} {dayjs(interest.created_at).format('DD MMM YYYY')}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE0D2]/70 flex items-center justify-between gap-2">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setAcceptingInterest(interest)}
                              className="flex-1 py-2 px-3 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isMarathi ? 'स्वीकारा' : 'Accept'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDecliningInterest(interest)}
                              className="py-2 px-3 bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                            >
                              <span>{isMarathi ? 'नाकारा' : 'Decline'}</span>
                            </button>
                          </>
                        ) : (
                          <Link
                            to={`/profiles/${candidate.id || interest.sender_profile_id}`}
                            className="w-full py-2 px-3 bg-white border border-[#E2D8CC] hover:border-[#7A1526] text-[#7A1526] text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isMarathi ? 'संपूर्ण प्रोफाइल पहा' : 'View Full Profile'}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Mutual Matches */}
        {activeTab === 'matches' && (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#7A1526] border-t-transparent mx-auto mb-3"></div>
                <p className="text-xs sm:text-sm text-[#7A6E65]">{isMarathi ? 'जुळलेली स्थळे लोड होत आहेत...' : 'Loading matches...'}</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-16 bg-white/95 border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-8 shadow-xs">
                <div className="w-14 h-14 bg-[#F8F3EA] border border-[#D9C39E] rounded-full flex items-center justify-center mx-auto text-[#7A1526] mb-3 shadow-2xs">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17] mb-1">
                  {isMarathi ? 'अद्याप कोणतेही जुळलेले स्थळ नाही' : 'No Mutual Matches Yet'}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E55] max-w-md mx-auto mb-6">
                  {isMarathi 
                    ? 'जेव्हा आपण पाठवलेली पसंती दुसऱ्या सभासदाने स्वीकारली असेल किंवा आपण दुसऱ्यांची पसंती स्वीकारली असेल, तेव्हा परस्पर संपर्क अनलॉक होतो.'
                    : 'When you accept an interest request or another member accepts yours, mutual contact details are unlocked here.'}
                </p>
                <Link
                  to="/profiles"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A1526] hover:bg-[#8F1024] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs"
                >
                  <Heart className="w-4 h-4 fill-current text-[#D9C39E]" />
                  <span>{isMarathi ? 'स्थळे शोधा' : 'Browse Profiles'}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match) => {
                  const candidate = match.candidate || {};
                  const candAge = calculateAge(candidate.dob || candidate.date_of_birth);
                  const candName = `${candidate.firstName || candidate.first_name || ''} ${candidate.lastName || candidate.last_name || ''}`.trim() || (isMarathi ? 'उमेदवार' : 'Candidate');
                  const candPhoto = candidate.primary_photo || candidate.photos?.[0] || DEFAULT_AVATAR;
                  const contacts = match.contacts || candidate.contacts || {};

                  return (
                    <div
                      key={match.id}
                      className="bg-white/95 backdrop-blur-xs border border-[#CDE4CD] rounded-2xl overflow-hidden shadow-xs"
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE0D2] shrink-0">
                            <img
                              src={candPhoto}
                              alt={candName}
                              className="w-full h-full object-cover object-center"
                              onError={handleImageError}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-serif font-bold text-[#2B1B17] text-lg truncate">
                                {candName}
                              </h3>
                              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[11px] font-bold rounded-full">
                                {isMarathi ? 'परस्पर पसंती' : 'Mutual Match'}
                              </span>
                            </div>

                            <div className="text-xs text-[#7A6E65] space-y-0.5">
                              {candAge && <p>{candAge} {isMarathi ? 'वर्षे' : 'years'}</p>}
                              {candidate.city && <p>{candidate.city}{candidate.state ? `, ${candidate.state}` : ''}</p>}
                              {candidate.caste && <p className="font-medium text-[#7A1526]">{candidate.caste}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Unlocked Contact Details Box */}
                        <div className="p-4 bg-[#F4F9F4] border border-green-200 rounded-xl space-y-2.5 mb-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-green-900">
                            <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
                            <span>{isMarathi ? 'थेट संपर्क माहिती (अनलॉक)' : 'Unlocked Contact Details'}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {contacts.phone && (
                              <div className="p-2.5 bg-white rounded-lg border border-green-200">
                                <span className="text-[11px] text-[#7A6E65] block">{isMarathi ? 'मोबाईल क्रमांक:' : 'Phone:'}</span>
                                <a href={`tel:${contacts.phone}`} className="font-bold text-[#2B1B17] hover:text-green-800">
                                  {contacts.phone}
                                </a>
                              </div>
                            )}
                            {contacts.alternate_phone && (
                              <div className="p-2.5 bg-white rounded-lg border border-green-200">
                                <span className="text-[11px] text-[#7A6E65] block">{isMarathi ? 'पर्यायी क्रमांक:' : 'Alt Phone:'}</span>
                                <a href={`tel:${contacts.alternate_phone}`} className="font-bold text-[#2B1B17] hover:text-green-800">
                                  {contacts.alternate_phone}
                                </a>
                              </div>
                            )}
                            {contacts.contact_email && (
                              <div className="p-2.5 bg-white rounded-lg border border-green-200 sm:col-span-2">
                                <span className="text-[11px] text-[#7A6E65] block">{isMarathi ? 'ईमेल पत्ता:' : 'Email:'}</span>
                                <a href={`mailto:${contacts.contact_email}`} className="font-bold text-[#2B1B17] hover:text-green-800 truncate block">
                                  {contacts.contact_email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-[#A89D91]">
                            {isMarathi ? 'जुळल्याची तारीख:' : 'Connected:'} {dayjs(match.updated_at || match.created_at).format('DD MMM YYYY')}
                          </span>
                          <Link
                            to={`/profiles/${candidate.id}`}
                            className="px-4 py-2 bg-white border border-[#E2D8CC] hover:border-[#7A1526] text-[#7A1526] text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isMarathi ? 'बायोडाटा पहा' : 'View Biodata'}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Sent Interests */}
        {activeTab === 'sent' && (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#7A1526] border-t-transparent mx-auto mb-3"></div>
                <p className="text-xs sm:text-sm text-[#7A6E65]">{isMarathi ? 'पाठवलेली पसंती लोड होत आहे...' : 'Loading sent requests...'}</p>
              </div>
            ) : sentInterests.length === 0 ? (
              <div className="text-center py-16 bg-white/95 border border-[#EAE0D2] rounded-2xl sm:rounded-3xl p-8 shadow-xs">
                <div className="w-14 h-14 bg-[#F8F3EA] border border-[#D9C39E] rounded-full flex items-center justify-center mx-auto text-[#7A1526] mb-3 shadow-2xs">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17] mb-1">
                  {isMarathi ? 'अद्याप कोणत्याही स्थळास पसंती पाठवलेली नाही' : 'No Sent Interests Yet'}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5E55] max-w-md mx-auto mb-6">
                  {isMarathi 
                    ? 'शोध सूचीमधील योग्य प्रोफाइल निवडून आपण पसंती पाठवू शकता.'
                    : 'Browse through matrimonial profiles and click "Send Interest" to connect.'}
                </p>
                <Link
                  to="/profiles"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A1526] hover:bg-[#8F1024] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs"
                >
                  <Heart className="w-4 h-4 fill-current text-[#D9C39E]" />
                  <span>{isMarathi ? 'स्थळे शोधा' : 'Browse Profiles'}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sentInterests.map((interest) => {
                  const candidate = interest.candidate || {};
                  const candAge = calculateAge(candidate.dob || candidate.date_of_birth);
                  const candName = `${candidate.firstName || candidate.first_name || ''} ${candidate.lastName || candidate.last_name || ''}`.trim() || (isMarathi ? 'उमेदवार' : 'Candidate');
                  const candPhoto = candidate.primary_photo || candidate.photos?.[0] || DEFAULT_AVATAR;
                  const isAccepted = interest.status === 'accepted';
                  const isDeclined = interest.status === 'declined';
                  const isPending = interest.status === 'pending';

                  return (
                    <div
                      key={interest.id}
                      className="bg-white/95 backdrop-blur-xs border border-[#EAE0D2] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE0D2] shrink-0">
                            <img
                              src={candPhoto}
                              alt={candName}
                              className="w-full h-full object-cover object-center"
                              onError={handleImageError}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-bold text-[#2B1B17] text-base truncate mb-0.5">
                              {candName}
                            </h3>
                            <div className="text-xs text-[#7A6E65] space-y-0.5">
                              {candAge && <p>{candAge} {isMarathi ? 'वर्षे' : 'yrs'}</p>}
                              {candidate.city && <p className="truncate">{candidate.city}{candidate.state ? `, ${candidate.state}` : ''}</p>}
                              {candidate.caste && <p className="truncate font-medium text-[#7A1526]">{candidate.caste}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-3">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFFBF2] border border-[#E9D8B4] text-[#7A5416]">
                              <Clock className="w-3 h-3 text-[#B88E4B]" />
                              <span>{isMarathi ? 'प्रतिसादाची प्रतीक्षा' : 'Awaiting Response'}</span>
                            </span>
                          )}
                          {isAccepted && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F4F9F4] border border-[#CDE4CD] text-green-800">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              <span>{isMarathi ? 'स्वीकारले • जुळणी झाली' : 'Accepted • Matched'}</span>
                            </span>
                          )}
                          {isDeclined && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              <XCircle className="w-3 h-3" />
                              <span>{isMarathi ? 'नाकारले' : 'Declined'}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#A89D91]">
                          {isMarathi ? 'पाठवल्याची तारीख:' : 'Sent:'} {dayjs(interest.created_at).format('DD MMM YYYY')}
                        </p>
                      </div>

                      <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE0D2]/70">
                        <Link
                          to={`/profiles/${candidate.id || interest.receiver_profile_id}`}
                          className="w-full py-2 px-3 bg-white border border-[#E2D8CC] hover:border-[#7A1526] text-[#7A1526] text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isMarathi ? 'प्रोफाइल पहा' : 'View Profile'}</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accept Modal */}
      {acceptingInterest && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !acceptLoading) {
              setAcceptingInterest(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#F4F9F4] border border-[#CDE4CD] rounded-xl text-green-700">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? 'पसंतीची विनंती स्वीकारायची आहे का?' : 'Accept Interest Request?'}
                </h3>
                <p className="text-xs text-[#7A6E65]">
                  {acceptingInterest.candidate?.firstName || acceptingInterest.candidate?.first_name} {acceptingInterest.candidate?.lastName || acceptingInterest.candidate?.last_name}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5E55] mb-4 leading-relaxed">
              {isMarathi 
                ? 'ही विनंती स्वीकारल्यास आपले थेट संपर्क क्रमांक व ईमेल एकमेकांना दृश्यमान होतील.'
                : 'Upon accepting, your mutual contact numbers and email will become immediately unlocked.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAcceptingInterest(null)}
                disabled={acceptLoading}
                className="px-4 py-2 border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {isMarathi ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                disabled={acceptLoading}
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {acceptLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isMarathi ? 'स्वीकारत आहे...' : 'Accepting...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isMarathi ? 'होय, स्वीकारा' : 'Accept Interest'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {decliningInterest && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget && !declineLoading) {
              setDecliningInterest(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#EAE0D2] animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#FDF2F2] border border-[#F5C2C7] rounded-xl text-[#9E1B32]">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2B1B17]">
                  {isMarathi ? 'विनंती नाकारायची आहे का?' : 'Decline Interest Request?'}
                </h3>
                <p className="text-xs text-[#7A6E65]">
                  {decliningInterest.candidate?.firstName || decliningInterest.candidate?.first_name} {decliningInterest.candidate?.lastName || decliningInterest.candidate?.last_name}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6B5E55] mb-4 leading-relaxed">
              {isMarathi 
                ? 'आपली संपर्क माहिती पूर्णपणे गोपनीय राहील.'
                : 'Your contact details will remain private and will not be shared.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDecliningInterest(null)}
                disabled={declineLoading}
                className="px-4 py-2 border border-[#E2D8CC] hover:bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {isMarathi ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={declineLoading}
                className="px-5 py-2 bg-[#9E1B32] hover:bg-[#7A1526] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {declineLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isMarathi ? 'नाकारत आहे...' : 'Declining...'}</span>
                  </>
                ) : (
                  <span>{isMarathi ? 'होय, नाकारा' : 'Decline Interest'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interests;
