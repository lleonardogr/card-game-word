import React from 'react';
import { LetterState } from '@/utils/game';

interface LetterTileProps {
  letter: string;
  state: LetterState;
}

export const LetterTile: React.FC<LetterTileProps> = ({ letter, state }) => {
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

  return (
    <div
      className={`w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 
        ${getBorderColor()} ${getBackgroundColor()} 
        ${state !== 'empty' ? 'text-white' : 'text-gray-900 dark:text-gray-100'} 
        transition-colors duration-300`}
    >
      {letter}
    </div>
  );
};