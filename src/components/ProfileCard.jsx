import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Briefcase, CheckCircle2 } from 'lucide-react';
import { DEFAULT_AVATAR, handleImageError } from '../lib/avatarFallback';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

/**
 * ProfileCard - Displays a single approved matrimonial candidate card
 * 
 * Shows: photo, name, age, height, city, education, occupation, community
 * Uses responsive 4:5 aspect ratio with warm ivory and antique gold borders.
 */

export const ProfileCard = ({ profile }) => {
  const { i18n } = useTranslation();
  const isMarathi = (i18n.language || 'en').startsWith('mr');

  const calculateAge = (dob) => {
    if (!dob) return null;
    const years = dayjs().diff(dayjs(dob), 'year');
    return isNaN(years) ? null : years;
  };

  const dob = profile.dob || profile.date_of_birth;
  const age = calculateAge(dob);
  const firstName = profile.firstName || profile.first_name || '';
  const lastName = profile.lastName || profile.last_name || '';
  const height = profile.height;
  const photoUrl = profile.primary_photo || profile.photos?.[0] || DEFAULT_AVATAR;

  return (
    <Link to={`/profiles/${profile.id}`} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1526]">
      <div className="h-full bg-white border border-[#EAE0D2] rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#B88E4B] hover:-translate-y-1 transition-all duration-300 flex flex-col">
        {/* Consistent 4:5 aspect ratio image container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
            onError={handleImageError}
          />
          {/* Subtle bottom gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B0E]/80 via-[#1A0B0E]/20 to-transparent pointer-events-none" />
          
          {/* Top-Left Approved Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-full text-[11px] font-semibold text-[#7A1526] border border-[#E8DCB8] shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
            <span className={isMarathi ? 'font-devanagari font-bold' : 'font-sans font-semibold'}>
              {isMarathi ? 'मंजूर प्रोफाइल' : 'Approved Profile'}
            </span>
          </div>

          {/* Floating Bottom Candidate Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-base sm:text-lg font-bold drop-shadow-xs truncate text-white">
              {firstName} {lastName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#FAF7F2]/95 font-medium mt-0.5">
              {age !== null && <span>{age} {isMarathi ? 'वर्षे' : 'yrs'}</span>}
              {age !== null && height && <span className="text-[#D9C39E]">•</span>}
              {height && <span>{height}</span>}
              {(age !== null || height) && profile.city && <span className="text-[#D9C39E]">•</span>}
              {profile.city && <span className="truncate">{profile.city}</span>}
            </div>
          </div>
        </div>
        
        {/* Card Body Information */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
          <div className="space-y-2 text-xs text-[#4A3E39]">
            {profile.education && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
                <span className="truncate font-medium text-[#241C1A]">{profile.education}</span>
              </div>
            )}
            
            {profile.occupation && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
                <span className="truncate text-[#5A4D45]">{profile.occupation}</span>
              </div>
            )}

            {profile.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B88E4B] shrink-0" />
                <span className="truncate text-[#5A4D45]">{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="pt-2.5 border-t border-[#EAE0D2] flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#7A1526] truncate">
              {profile.caste || (isMarathi ? 'मराठा' : 'Maratha')}
            </span>
            <span className="text-[#9E7B42] font-semibold group-hover:text-[#7A1526] group-hover:translate-x-0.5 transition-all shrink-0 flex items-center gap-1">
              <span>{isMarathi ? 'प्रोफाइल पहा' : 'View Profile'}</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
