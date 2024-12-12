"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { setStage, resetTracking } = useOrderTracking();
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');
    
    if (!sessionId || !orderId) {
      router.push('/');
      return;
    }

    const initializeOrder = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);
        
        if (orderDoc.exists()) {
          clearCart();
          resetTracking();
          setStage(1); // Start tracking
          router.push('/order');
          toast.success('Order placed successfully!');
        }
      } catch (error) {
        console.error('Error initializing order:', error);
        toast.error('Error initializing order');
      }
    };

    initializeOrder();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Processing your order...</div>
    </div>
  );
} 