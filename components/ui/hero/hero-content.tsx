"use client";

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { HeroCta } from './hero-cta';
import { HeroStats } from './hero-stats';

interface HeroContentProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroContent({ title, subtitle, ctaText, ctaLink }: HeroContentProps) {
  const brandLetters = "ProposalForge".split('');
  
  return (
    <div className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto lg:mx-0"
      >
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm rounded-full text-blue-600 text-sm font-medium mb-8 border border-blue-100/50 shadow-lg"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          AI-Powered Platform
        </motion.div>

        {/* Brand Name (reduced font size by 10%) */}
        <div className="text-[3.375rem] sm:text-[4.05rem] md:text-[5.4rem] font-bold mb-8">
          <div className="leading-[1.2] tracking-tight">
            {brandLetters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 + (index * 0.05),
                  duration: 0.5,
                  ease: [0.6, -0.05, 0.01, 0.99]
                }}
                className="inline-block bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                style={{ 
                  padding: '0.1em 0',
                  marginRight: letter === ' ' ? '0.2em' : '-0.01em'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Title */}
        <motion.div 
          className="text-4xl sm:text-5xl font-bold leading-[1.3] tracking-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="space-y-2">
            {title.split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + (index * 0.1) }}
                className="inline-block mr-[0.3em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-xl text-gray-600 leading-relaxed mb-12"
        >
          {subtitle}
        </motion.p>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="space-y-8"
        >
          <HeroCta text={ctaText} link={ctaLink} />
          <HeroStats />
        </motion.div>
      </motion.div>
    </div>
  );
}
