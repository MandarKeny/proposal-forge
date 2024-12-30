"use client";

import { motion } from 'framer-motion';
import { HeroBackground } from './hero/hero-background';
import { HeroContent } from './hero/hero-content';
import { HeroIllustration } from './hero/hero-illustration';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroSection({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
      <HeroBackground />
      
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <HeroContent 
              title={title}
              subtitle={subtitle}
              ctaText={ctaText}
              ctaLink={ctaLink}
            />
          </motion.div>

          {/* Illustration Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-4">
              <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 opacity-50 blur-2xl" />
            </div>
            <div className="relative">
              <HeroIllustration />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}