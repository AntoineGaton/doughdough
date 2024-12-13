import { User } from 'firebase/auth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileData } from './UserProfile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const formatPhoneNumber = (phoneNumber: string | null | undefined) => {
  if (!phoneNumber) return 'Not set';
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber;
};

interface ProfileDisplayProps {
  profile: any;
  isAdmin: boolean;
  isLoading: boolean;
  onEditClick: () => void;
  onPhotoClick: () => void;
}

export function ProfileDisplay({ profile, isAdmin, isLoading, onEditClick, onPhotoClick }: ProfileDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 px-2 bg-white rounded-lg animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-secondary">Profile Information</h3>
          {isAdmin && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
        <button onClick={onEditClick} className="text-secondary hover:text-secondary/80">
          Edit Profile
        </button>
      </div>

      <div className="space-y-4">
        {/* Basic Info - Always Visible */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{profile.email || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-medium">{profile.displayName || 'Not set'}</p>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Regular User Fields */}
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="font-medium">{formatPhoneNumber(profile.phoneNumber)}</p>
                </div>
                
                {/* Admin-Only Fields */}
                {isAdmin ? (
                  <>
                    <div>
                      <label className="text-sm text-gray-500">Account Status</label>
                      <p className="font-medium">Administrator</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Access Level</label>
                      <p className="font-medium">Full Access</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Dashboard Access</label>
                      <p className="font-medium">Enabled</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm text-gray-500">Email Verified</label>
                      <p className="font-medium">{profile.emailVerified ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Created At</label>
                      <p className="font-medium">
                        {profile.metadata?.creationTime 
                          ? new Date(profile.metadata.creationTime).toLocaleDateString() 
                          : 'Not available'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Last Sign In</label>
                      <p className="font-medium">
                        {profile.metadata?.lastSignInTime
                          ? new Date(profile.metadata.lastSignInTime).toLocaleDateString()
                          : 'Not available'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
        >
          <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isExpanded && "transform rotate-180"
          )} />
        </button>
      </div>

      <div className="relative cursor-pointer" onClick={onPhotoClick}>
      </div>
    </div>
  );
} 