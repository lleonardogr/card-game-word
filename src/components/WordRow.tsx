import React from 'react';
import { LetterTile } from './LetterTile';
import { GuessResult } from '@/utils/game';

interface WordRowProps {
  guess: GuessResult[] | null;
  currentGuess?: string;
}

export const WordRow: React.FC<WordRowProps> = ({ guess, currentGuess = '' }) => {
  const tiles = [];

  // If we have a completed guess, show it with the proper states
  if (guess) {
    for (let i = 0; i < 5; i++) {
      tiles.push(
        <LetterTile 
          key={i} 
          letter={guess[i].letter} 
          state={guess[i].state} 
        />
      );
    }
  }
  // Otherwise, show the current in-progress guess
  else {
    for (let i = 0; i < 5; i++) {
      tiles.push(
        <LetterTile 
          key={i} 
          letter={i < currentGuess.length ? currentGuess[i] : ''} 
          state="empty" 
        />
      );
    }
  }

  return (
    <div className="flex gap-2 mb-2">
      {tiles}
    </div>
  );
};