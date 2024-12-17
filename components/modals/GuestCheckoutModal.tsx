"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { AuthModal } from "../auth/AuthModal";

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
  const [showAuthModal, setShowAuthModal] = useState(false);

  const benefits = [
    "🎯 Track your order in real-time",
    "💝 Earn rewards on every order",
    "📜 Access order history",
    "⚡ Faster checkout experience",
    "🎁 Exclusive member deals",
    "🔔 Get notified about special offers"
  ];

  const handleSignupClick = () => {
    onClose(); // Close guest modal
    setShowAuthModal(true); // Show auth modal
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-secondary">
              Join the DoughDough Family?
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-2">
            <Image
              src="/images/Doughdough/3.png"
              alt="DoughDough's Logo"
              width={200}
              height={200}
              className="full"
            />
            
            <div className="space-y-1 w-full">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 p-1.5 bg-background rounded-lg"
                >
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col w-full gap-2 pt-2">
              <Button
                onClick={handleSignupClick}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                Actually, I'm part of the family 👨‍👩‍👧‍👦
              </Button>
              <Button 
                onClick={handleSignupClick}
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

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
      />
    </>
  );
} 