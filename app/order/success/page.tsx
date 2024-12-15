"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { useTrackingDrawer } from '@/hooks/useTrackingDrawer';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { setStage, resetTracking } = useOrderTracking();
  const { openTrackingDrawer } = useTrackingDrawer();

  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    const orderId = searchParams?.get('order_id');
    
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
          setStage(1);
          toast.success('Order placed successfully!');
        }
      } catch (error) {
        console.error('Error initializing order:', error);
        toast.error('Error initializing order. Please contact support.');
        router.push('/');
      }
    };

    initializeOrder();
  }, [setStage]);

  useEffect(() => {
    return () => {
      resetTracking();
    };
  }, []);

  const handleTrackOrder = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    router.push(`${baseUrl}/order`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-20 text-center">
      <div className="w-full max-w-md mx-auto">
        <div className="relative aspect-square w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto mb-4">
          <Image
            src="/images/order-success.png"
            alt="DoughDough's Pizza"
            fill
            priority
            className="object-contain"
          />
        </div>
        
        <div className="space-y-4 mt-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
            Order Confirmed!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Thank you for ordering from DoughDough's Pizza
          </p>
          
          <div className="flex flex-col gap-3 mt-6">
            <button 
              onClick={handleTrackOrder}
              className="w-full bg-secondary text-white px-4 py-3 rounded-md font-bold hover:bg-secondary/90 transition-colors text-sm sm:text-base"
            >
              Track Your Order
            </button>
            <Link 
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Return back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 