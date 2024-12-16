import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatPhoneNumber, validatePhoneNumber, validateAddress } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: OrderDetails) => void;
}

export type OrderDetails = {
  name: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export function OrderDetailsModal({ isOpen, onClose, onSubmit }: OrderDetailsModalProps) {
  const { deliveryMethod } = useCart();
  const { user } = useAuth();
  const [details, setDetails] = useState<OrderDetails>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'userProfiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data();
            setDetails({
              name: profileData.displayName || user.displayName || '',
              phone: profileData.phoneNumber ? formatPhoneNumber(profileData.phoneNumber) : '',
              address: profileData.address || '',
              city: profileData.city || '',
              state: profileData.state || '',
              zipCode: profileData.zipCode || ''
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    if (isOpen) {
      fetchProfile();
    }
  }, [user, isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d\s()-]/g, '');
    
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      let formatted = digits;
      if (digits.length >= 3) {
        formatted = `(${digits.slice(0,3)})${digits.length > 3 ? ` ${digits.slice(3)}` : ''}`;
      }
      if (digits.length >= 6) {
        formatted = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
      }
      setDetails(prev => ({ ...prev, phone: formatted }));
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setDetails(prev => ({ ...prev, zipCode: value }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    };
    
    let isValid = true;

    if (!details.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!validatePhoneNumber(details.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (deliveryMethod === 'delivery') {
      if (!details.address || !validateAddress(details.address)) {
        newErrors.address = 'Street address is required';
        isValid = false;
      }

      if (!details.city?.trim()) {
        newErrors.city = 'City is required';
        isValid = false;
      }

      if (!details.state?.trim()) {
        newErrors.state = 'State is required';
        isValid = false;
      }

      if (!details.zipCode || !/^\d{5}$/.test(details.zipCode)) {
        newErrors.zipCode = 'Valid 5-digit ZIP code is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please check your input and try again');
      return;
    }

    const formattedDetails = {
      ...details,
      phone: formatPhoneNumber(details.phone),
      fullAddress: deliveryMethod === 'delivery' 
        ? `${details.address}, ${details.city}, ${details.state} ${details.zipCode}`
        : ''
    };

    onSubmit(formattedDetails);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Full Name"
              value={details.name}
              onChange={(e) => setDetails(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Input
              placeholder="Phone Number"
              value={details.phone}
              onChange={handlePhoneChange}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {deliveryMethod === 'delivery' && (
            <>
              <div>
                <Input
                  placeholder="Street Address"
                  value={details.address}
                  onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="City"
                    value={details.city}
                    onChange={(e) => setDetails(prev => ({ ...prev, city: e.target.value }))}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Input
                    placeholder="State"
                    value={details.state}
                    onChange={(e) => setDetails(prev => ({ ...prev, state: e.target.value.toUpperCase().slice(0, 2) }))}
                    className={errors.state ? 'border-red-500' : ''}
                    maxLength={2}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>

              <div>
                <Input
                  placeholder="ZIP Code"
                  value={details.zipCode}
                  onChange={handleZipCodeChange}
                  className={errors.zipCode ? 'border-red-500' : ''}
                  maxLength={5}
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            Continue to Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 