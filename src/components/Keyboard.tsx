import React from 'react';
import { LetterState } from '@/utils/game';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
}

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, letterStates }) => {
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyClass = (key: string) => {
    const state = letterStates[key];
    
    let baseClass = 'flex items-center justify-center h-12 rounded font-bold transition-colors';
    if (key === 'ENTER' || key === 'BACKSPACE') {
      baseClass += ' px-2 text-xs';
    } else {
      baseClass += ' w-8 sm:w-10';
    }

    switch(state) {
      case 'correct':
        return `${baseClass} bg-green-500 text-white`;
      case 'present':
        return `${baseClass} bg-yellow-500 text-white`;
      case 'absent':
        return `${baseClass} bg-gray-500 text-white`;
      default:
        return `${baseClass} bg-gray-200 dark:bg-gray-700 text-black dark:text-white`;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {keyboardRows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1 my-1">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};