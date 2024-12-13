import { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronDown, Upload, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { ProfileDisplay } from './ProfileDisplay';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistance } from 'date-fns';
import { cn } from '@/lib/utils';

export interface UserProfileData {
  displayName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  photoURL?: string | null;
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

// Add OrderHistory interface
interface OrderHistory {
  id: string;
  createdAt: Date;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  total: number;
}

export function UserProfile() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [loading, setLoading] = useState(true);
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
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          const docRef = doc(db, 'userProfiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(prev => ({
              ...prev,
              ...docSnap.data() as UserProfileData
            }));
          }
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoadingOrders(true);
        const ordersRef = collection(db, 'orders');
        const userOrdersQuery = query(
          ordersRef,
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(userOrdersQuery);
        const orderData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          items: doc.data().items || [],
          status: doc.data().status || 'pending',
          total: doc.data().total || 0
        })) as OrderHistory[];
        
        const sortedOrders = orderData.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error instanceof Error) {
          toast.error(`Failed to load order history: ${error.message}`);
        } else {
          toast.error('Failed to load order history');
        }
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
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
      setIsEditing(false);
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
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      
      const photoURL = await getDownloadURL(storageRef);
      
      await updateProfile(user, { photoURL });
      
      const userRef = doc(db, 'userProfiles', user.uid);
      await setDoc(userRef, { photoURL }, { merge: true });
      
      setProfile(prev => ({ ...prev, photoURL }));
      
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload profile picture');
      }
    } finally {
      setUploading(false);
    }
  };

  const ProfileAvatar = ({ editable = true }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={user?.photoURL || ''} 
            alt={user?.displayName || 'User avatar'}
            className="object-cover"
            onError={() => setImageError(true)}
          />
          <AvatarFallback delayMs={600}>
            {user?.displayName?.[0]?.toUpperCase() || 'A'}
          </AvatarFallback>
        </Avatar>
        {!uploading && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1 bg-secondary text-white rounded-full hover:bg-secondary/80 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
    );
  };

  // Add OrderHistory component
  const OrderHistory = () => {
    if (loadingOrders) {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No orders found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Order #{order.id.slice(-6)}
                </p>
                <p className="text-sm">
                  {order.createdAt && formatDistance(order.createdAt, new Date(), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <span className={cn(
                  "inline-block px-2 py-1 rounded-full text-xs font-medium",
                  {
                    "bg-green-100 text-green-800": true,
                    "bg-yellow-100 text-yellow-800": false,
                    "bg-blue-100 text-blue-800": false
                  }
                )}>
                  completed
                </span>
                <p className="font-medium mt-1">
                  ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-lg shadow w-fit mx-auto min-w-[600px]">
        <div className="flex justify-between items-center bg-white p-4 border-b">
          <div className="flex items-center gap-4">
            <ProfileAvatar />
            <div>
              <h2 className="text-2xl font-bold">
                Hi {profile.displayName},
              </h2>
              <p className="text-gray-500">Welcome back!</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={logout}
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="h-[600px] overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={profile.displayName}
                        onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={profile.phoneNumber}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\D/g, '');
                          if (cleaned.length <= 10) {
                            setProfile(prev => ({ ...prev, phoneNumber: cleaned }));
                          }
                        }}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input
                        value={profile.address}
                        onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input
                        value={profile.city}
                        onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Input
                        value={profile.state}
                        onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="ST"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZIP Code</label>
                      <Input
                        value={profile.zipCode}
                        onChange={(e) => setProfile(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="12345"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <ProfileDisplay 
                    profile={{ ...user, ...profile }} 
                    isAdmin={isAdmin}
                    isLoading={isLoading}
                    onEditClick={() => setIsEditing(true)}
                    onPhotoClick={() => fileInputRef.current?.click()}
                    OrderHistory={OrderHistory}
                  />
                </>
              )}
              
              {isAdmin && (
                <div className="pt-8 border-t">
                  <div className="bg-white rounded-lg min-h-[400px]">
                    <AdminDashboard />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 