"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { UserProfile } from "./UserProfile";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">("login");
  const { user, isAdmin, isLoading } = useAuth();

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </DialogContent>
      </Dialog>
    );
  }

  if (user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="sm:max-w-[800px] max-h-[80vh] overflow-hidden p-0"
        >
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{isAdmin ? "Control Panel" : "Dashboard"}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <UserProfile />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-describedby="auth-form-description"
      >
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
        </DialogHeader>
        <div id="auth-form-description">
          <div className="flex flex-col items-center">
            <div className="flex gap-4 mb-6">
              <button
                className={`pb-2 px-4 ${
                  view === "login"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-gray-400"
                }`}
                onClick={() => setView("login")}
              >
                Login
              </button>
              <button
                className={`pb-2 px-4 ${
                  view === "register"
                    ? "border-b-2 border-secondary text-secondary"
                    : "text-gray-400"
                }`}
                onClick={() => setView("register")}
              >
                Register
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                {view === "login" ? <LoginForm /> : <RegisterForm />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 