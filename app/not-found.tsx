'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center flex flex-col items-center z-0">
        <motion.div
          initial={{ scale: 10, opacity: 0 }}
          animate={{ scale: 3, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-48 h-48"
        >
          <Image
            src="/404.png"
            alt="DoughDoughs Pizza"
            fill
            className="object-contain"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-20 space-y-4 z-10"
        >
          <motion.h1 
            className="text-2xl font-bold text-muted-foreground"
          >
            Looks like this pizza has been delivered to the wrong address!
          </motion.h1>
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to our fresh pizzas</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 