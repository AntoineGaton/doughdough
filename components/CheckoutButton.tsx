"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { CartItem } from './CartDrawer';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  items: CartItem[];
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
      
      const checkoutItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || '/fallback-pizza.jpg'
      }));

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          userId: user?.uid || null,
          customerName: user?.email || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ 
        sessionId: data.sessionId 
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong with the checkout');
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