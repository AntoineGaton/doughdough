"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { CartItem } from '@/hooks/useCart';
import { GuestCheckoutModal } from '@/components/modals/GuestCheckoutModal';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  items: CartItem[];
  total: number;
}

export function CheckoutButton({ items, total }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      setShowGuestModal(true);
      return;
    }
    
    proceedToCheckout();
  };

  const proceedToCheckout = async () => {
    try {
      setIsLoading(true);
      
      const checkoutItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        total: item.total,
        tax: item.tax,
        image: item.image || '/fallback-pizza.jpg'
      }));

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          userId: user?.uid || 'guest',
          customerEmail: user?.email || 'guest@example.com'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      const { error } = await stripe.redirectToCheckout({ 
        sessionId: data.sessionId 
      });
      
      if (error) throw error;

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        className="w-full bg-secondary text-white py-3 rounded-md font-bold"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : `Checkout $${total.toFixed(2)}`}
      </button>

      <GuestCheckoutModal 
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onConfirmGuest={() => {
          setShowGuestModal(false);
          proceedToCheckout();
        }}
        onSignup={() => {
          setShowGuestModal(false);
          // Implement your signup logic here
        }}
      />
    </>
  );
} 