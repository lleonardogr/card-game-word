import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LetterTile } from './LetterTile';
import { GuessResult } from '@/utils/game';

interface WordRowProps {
  guess: GuessResult[] | null;
  currentGuess?: string;
  wordLength: number;
  className?: string;
}

export const WordRow: React.FC<WordRowProps> = ({ 
  guess, 
  currentGuess = '', 
  wordLength = 5,
  className = ''
}) => {
  const tiles = [];
  const [isRevealing, setIsRevealing] = useState(false);
  
  // Trigger the revealing animation when a new guess is submitted
  useEffect(() => {
    if (guess) {
      setIsRevealing(true);
      
      // Reset the revealing state after animation completes (consider the longest delay)
      const timeoutId = setTimeout(() => {
        setIsRevealing(false);
      }, wordLength * 150 + 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [guess, wordLength]);

  // If we have a completed guess, show it with the proper states and animations
  if (guess) {
    for (let i = 0; i < wordLength; i++) {
      tiles.push(
        <LetterTile 
          key={i} 
          letter={guess[i].letter} 
          state={guess[i].state} 
          delay={i * 0.15}
          isRevealing={isRevealing}
        />
      );
    }
  }
  // Otherwise, show the current in-progress guess with typing animations
  else {
    for (let i = 0; i < wordLength; i++) {
      const hasLetter = i < currentGuess.length;
      tiles.push(
        <LetterTile 
          key={i} 
          letter={hasLetter ? currentGuess[i] : ''} 
          state="empty" 
        />
      );
    }
  }

  return (
    <motion.div 
      className={`flex gap-2 mb-2 justify-center ${className}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {tiles}
    </motion.div>
  );
};