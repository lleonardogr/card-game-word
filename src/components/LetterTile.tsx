import React from 'react';
import { motion } from 'framer-motion';
import { LetterState } from '@/utils/game';

interface LetterTileProps {
  letter: string;
  state: LetterState;
  delay?: number;
  isRevealing?: boolean;
}

export const LetterTile: React.FC<LetterTileProps> = ({ 
  letter, 
  state, 
  delay = 0,
  isRevealing = false
}) => {
  const getBackgroundColor = () => {
    switch (state) {
      case 'correct':
        return 'bg-green-500';
      case 'present':
        return 'bg-yellow-500';
      case 'absent':
        return 'bg-gray-500';
      case 'empty':
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  const getBorderColor = () => {
    return state === 'empty' ? 'border-gray-300 dark:border-gray-600' : 'border-transparent';
  };

  // Animation variants
  const variants = {
    idle: { scale: 1 },
    typed: { scale: [1, 1.1, 1], transition: { duration: 0.15 } },
    revealing: { 
      rotateX: [0, 90, 0],
      transition: { 
        duration: 0.6,
        delay,
        times: [0, 0.5, 1]
      }
    }
  };

  // Determine which animation variant to use
  let animationVariant = 'idle';
  if (isRevealing) {
    animationVariant = 'revealing';
  }

  return (
    <motion.div
      className={`w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 
        ${getBorderColor()} ${getBackgroundColor()} 
        ${state !== 'empty' ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}
      variants={variants}
      initial="idle"
      animate={animationVariant}
      layout
    >
      {letter}
    </motion.div>
  );
};