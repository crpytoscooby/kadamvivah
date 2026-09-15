import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { DEFAULT_AVATAR, handleImageError } from '../lib/avatarFallback';
import dayjs from 'dayjs';

/**
 * ProfileCard - Displays a single profile in the grid
 * 
 * Shows: photo, name, age, city, education, occupation
 * Uses responsive 4:5 aspect ratio container with object-cover object-center.
 */

export const ProfileCard = ({ profile }) => {
  const calculateAge = (dob) => {
    if (!dob) return null;
    const years = dayjs().diff(dayjs(dob), 'year');
    return isNaN(years) ? null : years;
  };

  const dob = profile.dob || profile.date_of_birth;
  const age = calculateAge(dob);
  const firstName = profile.firstName || profile.first_name || '';
  const lastName = profile.lastName || profile.last_name || '';
  const subCaste = profile.subCaste || profile.sub_caste;
  const photoUrl = profile.primary_photo || profile.photos?.[0] || DEFAULT_AVATAR;

  return (
    <Link to={`/profiles/${profile.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group flex flex-col h-full">
        {/* Consistent 4:5 aspect ratio image container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted flex items-center justify-center">
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-foreground">
              {firstName} {lastName}
            </h3>
            
            {age !== null && (
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4 mr-1 text-primary flex-shrink-0" />
                <span>{age} years</span>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{profile.city}, {profile.state}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{profile.education || 'Not specified'}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Briefcase className="w-4 h-4 mr-2 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{profile.occupation || 'Not specified'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground truncate block">
              {profile.caste || 'Caste not specified'}
              {subCaste ? ` • ${subCaste}` : ''}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfileCard;
