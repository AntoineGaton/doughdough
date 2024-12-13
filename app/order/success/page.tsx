"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import PizzaTracker from '@/components/PizzaTracker';

export default function OrderSuccessPage() {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
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
  }, []);

  const handleTrackOrder = () => {
    setIsTrackingOpen(true);
  };

  return (
    <>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="space-y-6">
          <Image
            src="/images/logo2.png"
            alt="DoughDough's Pizza"
            width={200}
            height={200}
            className="mx-auto"
          />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for ordering from DoughDough's Pizza
            </p>
            <div className="flex flex-col gap-4 mt-8">
              <button 
                onClick={handleTrackOrder}
                className="bg-secondary text-white px-6 py-3 rounded-md font-bold hover:bg-secondary/90 transition-colors"
              >
                Track Your Order
              </button>
              <Link 
                href="/"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Drawer open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
        <DrawerContent>
          <PizzaTracker />
        </DrawerContent>
      </Drawer>
    </>
  );
} 