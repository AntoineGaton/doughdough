"use client";

import Link from "next/link";
import { Menu as MenuIcon, X, ShoppingCart, User, Pizza, Tag, Clock, MapPin, Users, MessageSquare, HelpCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "@/components/CartDrawer";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer"

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  const menuItems = [
    { href: "/deals", label: "Deals", icon: <Tag className="h-5 w-5" /> },
    { href: "/menu", label: "Menu", icon: <Pizza className="h-5 w-5" /> },
    { href: "/track", label: "Track Order", icon: <Clock className="h-5 w-5" /> },
    { href: "/about", label: "About Us", icon: <Users className="h-5 w-5" /> },
    { href: "/contact", label: "Contact", icon: <MessageSquare className="h-5 w-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary mt-1 mb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left - Menu Button */}
          <div className="w-[100px]">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-primary h-20 px-6 -ml-4 sm:-ml-6 lg:-ml-8 text-secondary hover:text-black flex items-center"
            >
              {isMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <MenuIcon className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Center - Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="DoughDoughs Pizza"
                width={150}
                height={50}
                className="h-28 w-auto"
              />
            </Link>
          </div>

          {/* Right - Login & Cart */}
          <div className="w-[100px] flex items-center justify-end space-x-4">
            <Link
              href="/login"
              className="text-secondary hover:text-black transition-colors"
              aria-label="Login"
            >
              <User className="h-6 w-6" />
            </Link>
            <p className="text-secondary">|</p>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-secondary hover:text-black transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent>
          <DrawerHeader className="text-4xl font-semibold text-center text-secondary mx-auto">Menu</DrawerHeader>
          <motion.div 
            className="border-b border-1 border-secondary mx-auto"
            initial={{ width: "0%" }}
            animate={{ width: "25%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
          <div className="px-4 py-2"> 
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3 + index * 0.1,
                  ease: "easeOut"
                }}
              >
                <Link
                  href={item.href}
                  className="flex items-center justify-center gap-3 py-4 text-lg hover:text-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <DrawerFooter>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-secondary text-white py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Close Menu
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </nav>
  );
}