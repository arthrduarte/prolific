'use client';

import { Step } from '@/types/database.types';
import { motion } from 'framer-motion';

interface TextContentProps {
  currentStep: Step;
  isTransitioning: boolean;
  voiceMode: boolean;
}

export default function TextContent({
  currentStep,
  isTransitioning,
  voiceMode
}: TextContentProps) {
  const words = currentStep.content.split(/(\n|\s+)/).filter(Boolean);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: voiceMode ? 0.1 : 0,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={isTransitioning ? "hidden" : "show"}
      className="mb-8"
    >
      {words.map((word, index) => (
        word === '\n' ? (
          <br key={index} />
        ) : (
          <motion.span
            key={index}
            variants={item}
            className="text-lg text-gray-900"
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        )
      ))}
    </motion.div>
  );
} 