"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"
import { useOrderTracking } from '@/hooks/useOrderTracking'
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { MenuModal } from "@/components/modals/MenuModal"
import { Drawer } from "@/components/ui/drawer"
import { useTrackingDrawer } from '@/hooks/useTrackingDrawer';
import { useRouter } from 'next/navigation';

interface PizzaTrackerProps {
  onClose?: () => void;
}

const stages = [
  { id: 1, name: "ORDER PLACED" },
  { id: 2, name: "PREP" },
  { id: 3, name: "BAKE" },
  { id: 4, name: "QUALITY CHECK" },
  { id: 5, name: "OUT FOR DELIVERY" },
]

const messages = {
  1: "Your order has been received!",
  2: "We're preparing your order",
  3: "Your order is in the oven!",
  4: "Making sure everything is perfect",
  5: "Your order is on its way!",
}

export default function PizzaTracker({ onClose }: PizzaTrackerProps) {
  const { user } = useAuth()
  const { status, setStage, resetTracking } = useOrderTracking()
  const [isRainbow, setIsRainbow] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const { closeTrackingDrawer } = useTrackingDrawer();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (status.currentStage > 0 && status.currentStage < stages.length && !status.isComplete) {
      timer = setInterval(() => {
        const nextStage = status.currentStage + 1;
        
        if (nextStage <= stages.length) {
          setStage(nextStage);
          
          if (nextStage === stages.length) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            setIsRainbow(true);
          }
        }
      }, 10000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status.currentStage, status.isComplete, setStage]);

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    // If timestamp is a Firestore Timestamp, convert to Date
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  };

  const handleMorePizza = () => {
    // Reset the tracking state
    resetTracking();
    
    // Close any open drawers
    onClose?.();
    closeTrackingDrawer();
    
    // Navigate to home page and scroll to featured section
    router.push('/#featured-section');
  }

  if (status.currentStage === 0 && !status.isComplete) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-primary rounded-xl">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/main-logo.jpg"
              alt="Pizzaria Logo"
              width={200}
              height={200}
              className="opacity-80"
            />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            No Active Orders
          </h2>
          <p className="text-secondary/80">
            Place an order to start tracking your pizza&apos;s journey!
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={cn(
        "w-full max-w-3xl mx-auto p-6 bg-secondary rounded-xl shadow-xl transition-all duration-500",
        isRainbow && "animate-rainbow"
      )}>
        <h1 className="text-4xl font-bold text-primary mb-8 text-center tracking-wider">
          DOUGHDOUGH&apos;S TRACKER
        </h1>

        <div className="relative mb-8">
          {/* Progress Bar */}
          <div className="h-16 bg-blue-700 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex">
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={cn(
                    "flex-1 flex items-center justify-center relative",
                    status.currentStage === stage.id && "bg-red-500",
                    status.currentStage > stage.id && "bg-blue-400"
                  )}
                >
                  <div
                    className={cn(
                      "text-primary text-sm font-semibold z-10",
                      (status.currentStage === stage.id || status.currentStage > stage.id) && "text-primary",
                      "flex flex-col items-center gap-1"
                    )}
                  >
                    <span className="text-lg">{stage.id}</span>
                    <span className="text-xs whitespace-nowrap">{stage.name}</span>
                  </div>
                  {index < stages.length - 1 && (
                    <div
                      className={cn(
                        "absolute right-0 top-0 bottom-0 w-1 bg-blue-700",
                        status.currentStage > stage.id && "bg-blue-400",
                        status.currentStage === stage.id && "bg-red-500"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center text-primary">
          <div className="text-2xl font-bold mb-2">{messages[status.currentStage as keyof typeof messages]}</div>
          <div className="text-sm opacity-80">
            Our Expert Pizza Maker started your order at{" "}
            {formatTime(status.startTime)}
          </div>
        </div>

        {status.isComplete && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleMorePizza}
              className="bg-primary text-black px-8 py-4 rounded-full font-bold text-lg
                animate-pulse hover:animate-none hover:bg-primary/90 transition-colors
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            >
              Want More DoughDough? 🍕
            </button>
          </div>
        )}
      </div>

      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />
    </>
  )
}

