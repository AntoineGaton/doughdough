"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'form' | 'info'>('form');
  const isMobile = useMediaQuery("(max-width: 768px)");

  const validateInputs = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!message.trim()) {
      toast.error('Message is required');
      return false;
    }
    if (message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      setName("");
      setEmail("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50 && currentView === 'form') {
      setCurrentView('info');
    } else if (info.offset.x > 50 && currentView === 'info') {
      setCurrentView('form');
    }
  };

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative overflow-hidden mt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ 
            x: currentView === 'form' ? '-100%' : '100%',
            opacity: 0 
          }}
          animate={{ 
            x: 0,
            opacity: 1 
          }}
          exit={{ 
            x: currentView === 'form' ? '100%' : '-100%',
            opacity: 0 
          }}
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const content = (
    <>
      {isMobile && (
        <div className="flex justify-center space-x-2 mt-2">
          <div 
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-200",
              currentView === 'form' 
                ? "bg-secondary" 
                : "bg-secondary/30"
            )}
          />
          <div 
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-200",
              currentView === 'info' 
                ? "bg-secondary" 
                : "bg-secondary/30"
            )}
          />
        </div>
      )}
      
      <ContentWrapper>
        {currentView === 'form' ? (
          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <Textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading}
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-secondary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 p-6 bg-secondary/50 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span>(212) DOH-PZZA</span>
                  <span className="text-sm text-primary">(212) 364-7992</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@doughdough.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Pizza Street, NY 10001</span>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="font-semibold mb-2">Hours of Operation</h4>
              <div className="space-y-1 text-sm">
                <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
                <p>Friday - Saturday: 11:00 AM - 11:00 PM</p>
                <p>Sunday: 12:00 PM - 9:00 PM</p>
              </div>
            </div>
          </div>
        )}
      </ContentWrapper>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">Contact Us</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Contact Us</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6 p-6 bg-secondary/50 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex flex-col">
                  <span>(212) DOH-PZZA</span>
                  <span className="text-sm text-primary">(212) 364-7992</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>contact@doughdough.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Pizza Street, NY 10001</span>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="font-semibold mb-2">Hours of Operation</h4>
              <div className="space-y-1 text-sm">
                <p>Monday - Thursday: 11:00 AM - 10:00 PM</p>
                <p>Friday - Saturday: 11:00 AM - 11:00 PM</p>
                <p>Sunday: 12:00 PM - 9:00 PM</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <Textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px]"
                disabled={isLoading}
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-secondary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 