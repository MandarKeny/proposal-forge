"use client";

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { BackButton } from '@/components/ui/button/back-button';

interface ResultHeaderProps {
  companyName: string;
  clientName: string;
}

export function ResultHeader({ companyName, clientName }: ResultHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <BackButton href="/inputproposal" className="mb-6" />
      
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm rounded-full text-blue-600 text-sm font-medium mb-6 border border-blue-100/50 shadow-lg"
        >
          <FileText className="w-4 h-4 animate-pulse" />
          Generated Proposal
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {companyName}'s
          </span>{" "}
          proposal for{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          {clientName}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl"
        >
          Your AI-generated proposal is ready! Fine-tune it, download the full document, or check the cost breakdown.
        </motion.p>
      </div>
    </motion.div>
  );
}