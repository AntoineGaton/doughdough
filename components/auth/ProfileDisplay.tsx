import { User } from 'firebase/auth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfileData } from './UserProfile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  profile: UserProfileData;
  isAdmin: boolean;
  isLoading: boolean;
  onPhotoClick: () => void;
  onLogout: () => void;
  OrderHistory: React.ComponentType;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setProfile: (value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function ProfileDisplay({ profile, isAdmin, isLoading, onPhotoClick, onLogout, OrderHistory, isEditing, setIsEditing, setProfile, handleSubmit }: ProfileDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    console.log('Logout initiated');
    try {
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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

  // Admin-specific header
  if (isAdmin) {
    return (
      <div className="space-y-6 px-2 bg-white rounded-lg">
        {/* First section - Avatar and welcome */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={profile.photoURL || ''} 
                  alt="Admin avatar"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Hi DoughDough Pizza,</h2>
              <p className="text-gray-500">Welcome back!</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Sign Out
          </button>
        </div>

        {/* Second section - Profile info */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-secondary">Profile Information</h3>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Admin
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{profile.email || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{profile.displayName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <p className="font-medium">{formatPhoneNumber(profile.phoneNumber)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Role</label>
              <p className="font-medium">Administrator</p>
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
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <label className="text-sm text-gray-500">Access Level</label>
                    <p className="font-medium">Full Access</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Login</label>
                    <p className="font-medium">
                      {profile.metadata?.lastSignInTime
                        ? new Date(profile.metadata.lastSignInTime).toLocaleDateString()
                        : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Created</label>
                    <p className="font-medium">
                      {profile.metadata?.creationTime
                        ? new Date(profile.metadata.creationTime).toLocaleDateString()
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Regular user profile display
  return (
    <div className="space-y-6 px-2 bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={profile.photoURL || ''} 
                alt="User avatar"
              />
              <AvatarFallback>{profile.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <button
              onClick={onPhotoClick}
              className="absolute bottom-0 right-0 p-1 bg-secondary text-white rounded-full hover:bg-secondary/80 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Hi {profile.displayName || 'there'},</h2>
            <p className="text-gray-500">Welcome back!</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-secondary hover:text-secondary/80">
          Sign Out
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-secondary">Profile Information</h3>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Save
                </Button>
              </>
            ) : (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
                <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            {isEditing ? (
              <Input
                value={profile.displayName}
                onChange={(e) => setProfile((prev: UserProfileData) => ({ ...prev, displayName: e.target.value }))}
              />
            ) : (
              <p className="font-medium">{profile.displayName || 'Not set'}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{profile.email || 'Not set'}</p>
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
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={profile.phoneNumber}
                      onChange={(e) => setProfile((prev: UserProfileData) => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  ) : (
                    <p className="font-medium">{formatPhoneNumber(profile.phoneNumber)}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  {isEditing ? (
                    <Input
                      value={profile.address}
                      onChange={(e) => setProfile((prev: UserProfileData) => ({ ...prev, address: e.target.value }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.address || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">City</label>
                  {isEditing ? (
                    <Input
                      value={profile.city}
                      onChange={(e) => setProfile((prev: UserProfileData) => ({ ...prev, city: e.target.value }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.city || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">State</label>
                  {isEditing ? (
                    <Input
                      value={profile.state}
                      onChange={(e) => setProfile((prev: UserProfileData) => ({ ...prev, state: e.target.value }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.state || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">ZIP Code</label>
                  {isEditing ? (
                    <Input
                      value={profile.zipCode}
                      onChange={(e) => setProfile((prev: UserProfileData) => ({ ...prev, zipCode: e.target.value }))}
                    />
                  ) : (
                    <p className="font-medium">{profile.zipCode || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="font-medium">
                    {profile.metadata?.creationTime 
                      ? new Date(profile.metadata.creationTime).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Not available'}
                  </p>
                </div>
              </div>
              {isEditing ? (
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Save Changes</Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Edit Profile
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-8 border-t">
        <h3 className="text-lg font-semibold mb-4 text-secondary">Order History</h3>
        <OrderHistory />
      </div>
    </div>
  );
} 