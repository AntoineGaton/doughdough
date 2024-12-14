'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function AboutHero() {
  return (
    <div className="relative h-[650px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/about-hero.jpg"
          alt="DoughDoughs Pizza Kitchen"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 h-full w-full flex items-center justify-center text-white mx-auto pt-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl font-bold text-center max-w-full text-shadow-lg"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 2,
              ease: "linear",
              staggerChildren: 0.1
            }}
          >
            {Array.from("Crafting Perfect Pizza Since 2020").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.1,
                  delay: index * 0.1
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>
      </div>
    </div>
  );
}
