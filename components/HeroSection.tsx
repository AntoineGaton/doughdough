"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function HeroSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const videoSrc = isMobile ? "videos/mobile-hero-video.mp4" : "videos/hero-video.mp4";

  const scrollToNext = () => {
    const nextSection = document.getElementById('featured-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      <div className="absolute inset-0 mt-[65px] sm:mt-[81px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Featured Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 mt-[65px] sm:mt-[81px]">
        <div className="text-center text-white">
          {/* Add your featured content here */}
        </div>
      </div>

      {/* Bouncing Chevron */}
      <div 
        className="flex flex-col items-center absolute bottom-3 left-1/2 -translate-x-1/2 text-center cursor-pointer z-20"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
            color: ['#000000', '#fafaf5', '#c4321c']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-10 w-10" />
        </motion.div>
      </div>
    </div>
  );
}