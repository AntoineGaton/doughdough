"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MenuIcon, X, ShoppingCart, Tag, Pizza, Clock, Users, MessageSquare, ArrowLeft, Home, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "./CartDrawer";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "./ui/drawer";
import { useCart } from "@/hooks/useCart";
import PizzaTracker from "./PizzaTracker";
import Image from "next/image";
import MobilePizzaTracker from "./MobilePizzaTracker";
import { AuthModal } from "./auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { DealsModal } from "./modals/DealsModal";
import { MenuModal } from "./modals/MenuModal";
import { ContactModal } from "./modals/ContactModal";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [isDealsModalOpen, setIsDealsModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      setRgbValues({
        r: Math.sin(Date.now() * 0.002) * 127 + 128,
        g: Math.sin(Date.now() * 0.002 + 2) * 127 + 128,
        b: Math.sin(Date.now() * 0.002 + 4) * 127 + 128
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isAdmin]);

  const baseMenuItems = [
    { id: "deals", label: "Deals", icon: <Tag className="h-5 w-5" /> },
    { id: "menu", label: "Menu", icon: <Pizza className="h-5 w-5" /> },
    { id: "track", label: "Track Order", icon: <Clock className="h-5 w-5" /> },
    { id: "about", label: "About Us", icon: <Users className="h-5 w-5" />, href: "/about" },
    { id: "contact", label: "Contact", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  const menuItems = pathname === "/" 
    ? baseMenuItems 
    : [
        { id: "home", label: "Home", icon: <Home className="h-5 w-5" />, href: "/" },
        ...baseMenuItems
      ];

  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    if (item.id === "track") {
      setActiveView("track");
    } else if (item.id === "deals") {
      setIsDealsModalOpen(true);
      setIsMenuOpen(false);
    } else if (item.id === "menu") {
      setIsMenuModalOpen(true);
      setIsMenuOpen(false);
    } else if (item.id === "contact") {
      setIsContactModalOpen(true);
      setIsMenuOpen(false);
    } else if (item.href) {
      window.location.href = item.href;
      setIsMenuOpen(false);
    }
  };

  const renderTrackOrder = () => (
    <div className="px-4 py-2">
      <div className="hidden md:block">
        <PizzaTracker />
      </div>
      <div className="block md:hidden">
        <MobilePizzaTracker />
      </div>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary h-[65px] sm:h-[81px] min-w-[320px]">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full relative">
          {/* Left - Menu Button - Fixed width */}
          <div className="w-[100px] sm:w-[120px] flex justify-start">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-primary h-[65px] sm:h-[81px] text-secondary hover:text-black flex items-center p-0"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
              ) : (
                <MenuIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              )}
            </button>
          </div>

          {/* Center - Logo - Fixed width */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="block">
              <Image 
                src="/logo.png" 
                alt="DoughDough's Logo" 
                width={80} 
                height={80}
                className="w-[50px] h-[50px] sm:w-20 sm:h-20 object-contain" 
                priority
              />
            </Link>
          </div>

          {/* Right - User & Cart - Fixed width */}
          <div className="w-[100px] sm:w-[120px] flex justify-end items-center">
            <Button 
              variant="ghost" 
              className="relative bg-primary h-[65px] sm:h-[81px] text-secondary hover:text-black hover:bg-transparent p-0"
              size="icon"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <User 
                className="h-6 w-6 sm:h-8 sm:w-8" 
                style={isAdmin ? {
                  color: `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`
                } : undefined}
              />
            </Button>
            <div className="text-secondary mx-1 sm:mx-2">|</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative bg-primary h-[65px] sm:h-[81px] text-secondary hover:text-black hover:bg-transparent p-0"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8" />
              {itemCount > 0 && (
                <span className="absolute top-2 sm:top-4 right-1 sm:right-3 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent className="fixed inset-x-0 top-[65px] sm:top-[600px] min-w-[320px]">
          <div className="bg-primary max-h-600px sm:max-h-300px overflow-y-auto">
            <AnimatePresence mode="wait">
              {!activeView ? (
                <motion.div
                  key="menu"
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center py-4"
                >
                  <DrawerHeader className="text-3xl font-semibold text-center text-secondary py-1">
                    Navigation Menu
                  </DrawerHeader>
                  <motion.div 
                    className="border-b border-1 border-secondary w-1/4"
                    initial={{ width: "0%" }}
                    animate={{ width: "25%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                  <div className="w-full px-4 py-2">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.3 + index * 0.1,
                          ease: "easeOut"
                        }}
                        className="w-full"
                      >
                        <button
                          onClick={() => handleMenuItemClick(item)}
                          className="flex items-center justify-center gap-3 py-2 text-lg hover:text-secondary transition-colors w-full"
                        >
                          <div className="w-5 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="track"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3 }}
                >
                  <DrawerHeader className="flex items-center text-4xl font-semibold text-secondary">
                    <button
                      onClick={() => setActiveView(null)}
                      className="absolute left-4 text-secondary hover:text-black"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>
                    <span className="w-full text-center">Order Status</span>
                  </DrawerHeader>
                  {activeView === "track" && renderTrackOrder()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <DealsModal isOpen={isDealsModalOpen} onClose={() => setIsDealsModalOpen(false)} />

      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
      />

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </nav>
  );
}