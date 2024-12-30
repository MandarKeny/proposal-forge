"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full aspect-square"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 -right-42 w-92 h-92 bg-blue-400/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: 'blur(100px)' }}
        />
        <motion.div 
          className="absolute -bottom-24 -left-48 w-96 h-96 bg-purple-400/20 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: 'blur(100px)' }}
        />
      </div>

      {/* Main Image */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-8 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
      >
        <Image
          src="/images/home_hero.png"
          alt="Team Collaboration"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-5, 5, -5],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-4 p-4 bg-white rounded-xl shadow-lg z-20"
      >
        <div className="text-blue-600 font-bold">AI-Powered</div>
      </motion.div>
    </motion.div>
  );
}