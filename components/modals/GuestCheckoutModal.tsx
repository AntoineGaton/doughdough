"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmGuest: () => void;
  onSignup: () => void;
}

export function GuestCheckoutModal({ 
  isOpen, 
  onClose, 
  onConfirmGuest,
  onSignup 
}: GuestCheckoutModalProps) {
  const benefits = [
    "🎯 Track your order in real-time",
    "💝 Earn rewards on every order",
    "📜 Access order history",
    "⚡ Faster checkout experience",
    "🎁 Exclusive member deals",
    "🔔 Get notified about special offers"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-secondary">
            Join the DoughDough Family?
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 pt-4">
          <Image
            src="/images/logo2.png"
            alt="DoughDough's Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
          
          <div className="space-y-2 w-full">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 p-2 bg-background rounded-lg"
              >
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col w-full gap-3 pt-4">
            <Button 
              onClick={onSignup}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              Join DoughDough Family ❤️
            </Button>
            
            <Button 
              onClick={onConfirmGuest}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              No thanks, I just want pizza 🤤
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 