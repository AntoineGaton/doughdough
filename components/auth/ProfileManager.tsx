import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface UserProfile {
  displayName: string;
  phoneNumber: string;
  address: string;
  cardLast4: string;
}

export function ProfileManager() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || '',
    phoneNumber: '',
    address: '',
    cardLast4: ''
  });
  const [loading, setLoading] = useState(false);

  // Test card numbers for display
  const testCards = [
    { last4: '4242', type: 'Visa', number: '4242 4242 4242 4242' },
    { last4: '5555', type: 'Mastercard', number: '5555 5555 5555 4444' },
    { last4: '3782', type: 'Amex', number: '3782 822463 10005' }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ ...profile, ...docSnap.data() as UserProfile });
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update display name in Firebase Auth
      await updateProfile(auth.currentUser!, {
        displayName: profile.displayName
      });

      // Store additional info in Firestore
      await setDoc(doc(db, 'userProfiles', user.uid), {
        ...profile,
        updatedAt: new Date()
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.photoURL || ''} />
          <AvatarFallback>{profile.displayName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            value={profile.displayName}
            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <Input
            value={profile.phoneNumber}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Delivery Address</label>
          <Input
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            placeholder="Your delivery address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Test Cards</label>
          <div className="space-y-2 bg-gray-50 p-4 rounded-md">
            {testCards.map((card) => (
              <div key={card.last4} className="flex justify-between items-center">
                <span>{card.type} (**** **** **** {card.last4})</span>
                <code className="text-sm bg-gray-200 px-2 py-1 rounded">
                  {card.number}
                </code>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Updating...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
} 