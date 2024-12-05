"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  items: any[];
  total: number;
}

export function CheckoutButton({ items, total }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userId: user.uid,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      // Redirect to Stripe checkout
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full bg-secondary text-white py-3 rounded-md font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50"
    >
      {isLoading ? 'Processing...' : `Pay ${total.toFixed(2)} USD`}
    </button>
  );
} 