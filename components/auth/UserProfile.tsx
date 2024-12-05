import { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronDown, Upload, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface UserProfileData {
  displayName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  photoURL?: string;
}

// Validation schema
const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
});

export function UserProfile() {
  const { user, isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({
    displayName: user?.displayName || '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    photoURL: user?.photoURL || '',
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({
            ...prev,
            ...docSnap.data() as UserProfileData
          }));
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Validate form data
      const validatedData = profileSchema.parse(profile);
      
      setLoading(true);
      await updateProfile(user, {
        displayName: validatedData.displayName
      });

      const userRef = doc(db, 'userProfiles', user.uid);
      await setDoc(userRef, {
        ...validatedData,
        updatedAt: new Date(),
        userId: user.uid,
        email: user.email
      }, { merge: true });

      toast.success('Profile updated successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast.error(err.message);
        });
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const photoURL = await getDownloadURL(storageRef);
      
      // Update auth profile
      await updateProfile(user, { photoURL });
      
      // Update local state
      setProfile(prev => ({ ...prev, photoURL }));
      
      // Update Firestore
      const userRef = doc(db, 'userProfiles', user.uid);
      await setDoc(userRef, { photoURL }, { merge: true });
      
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* User Info Section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="bg-gray-100 rounded-full w-24 h-24 overflow-hidden">
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-full w-full p-4 text-gray-600" />
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <div className="animate-spin">
                <Upload className="h-4 w-4" />
              </div>
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.email}</h2>
          <p className="text-sm text-gray-500">
            {isAdmin ? 'Administrator Account' : 'Customer Account'}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input
              value={profile.phoneNumber}
              onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              placeholder="1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <Input
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <Input
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              placeholder="City"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <Input
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value.toUpperCase() })}
                placeholder="ST"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <Input
                value={profile.zipCode}
                onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                placeholder="12345"
                maxLength={5}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button 
            type="button"
            variant="destructive" 
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </form>
    </div>
  );
} 