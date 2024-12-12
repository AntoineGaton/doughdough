"use client";

import { useOrderTracking } from '@/hooks/useOrderTracking';
import PizzaTracker from '@/components/PizzaTracker';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderPage() {
  const { status } = useOrderTracking();

  if (status.currentStage === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <Image
          src="/images/logo2.png"
          alt="DoughDough's Pizza"
          width={300}
          height={300}
          className="opacity-50 mb-6"
        />
        <h2 className="text-2xl font-bold mb-4">No Active Orders</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't placed an order yet!</p>
        <Link 
          href="/"
          className="bg-secondary text-white px-6 py-3 rounded-md font-bold hover:bg-secondary/90 transition-colors"
        >
          Order Now
        </Link>
      </div>
    );
  }

  return <PizzaTracker />;
}