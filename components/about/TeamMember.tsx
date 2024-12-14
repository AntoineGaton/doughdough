'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TeamMemberProps {
  name: string;
  position: string;
  image: string;
  linkedIn: string;
}

export function TeamMember({ name, position, image, linkedIn }: TeamMemberProps) {
  return (
    <motion.div
      onClick={() => window.open(linkedIn, '_blank')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="aspect-square relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-gray-600">{position}</p>
        <a 
          href={linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 
            0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.
            765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          LinkedIn
        </a>
      </div>
    </motion.div>
  );
} 