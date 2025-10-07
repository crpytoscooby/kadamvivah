import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import dayjs from 'dayjs';

/**
 * ProfileCard - Displays a single profile in the grid
 * 
 * Shows: photo, name, age, city, education, occupation
 * Clicking opens the full profile detail page
 */

export const ProfileCard = ({ profile }) => {
  const calculateAge = (dob) => {
    return dayjs().diff(dayjs(dob), 'year');
  };

  const age = calculateAge(profile.dob);
  const photoUrl = profile.photos?.[0] || '/placeholder-avatar.png';

  return (
    <Link to={`/profiles/${profile.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        <div className="relative h-64 overflow-hidden bg-muted">
          <img
            src={photoUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-avatar.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1">
            {profile.firstName} {profile.lastName}
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{age} years</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{profile.city}, {profile.state}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{profile.education}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{profile.occupation}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {profile.caste}
              {profile.subCaste && ` • ${profile.subCaste}`}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
