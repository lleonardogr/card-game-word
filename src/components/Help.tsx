import React, { useState } from 'react';

export const Help: React.FC = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <div>
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        aria-label="Help"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>
      
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full relative max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">How to Play Cardle</h2>
            
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                <strong>Cardle</strong> is a word-guessing game based on Magic: The Gathering card names.
              </p>
              
              <h3 className="text-lg font-semibold mt-2">Rules:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Guess the card name in 6 tries or fewer.</li>
                <li>Each guess must be a valid word with the same number of letters as the target word.</li>
                <li>After each guess, the color of the tiles will change to show how close you are.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-2">Color Key:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
                  <span>Correct letter in the correct position</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
                  <span>Correct letter in the wrong position</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-500 rounded mr-2"></div>
                  <span>Letter not in the word</span>
                </div>
              </div>
              
              <p className="mt-4">
                Card names are randomly selected from Magic: The Gathering&apos;s legendary creatures using the{' '}
                <a 
                  href="https://scryfall.com/docs/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Scryfall API
                </a>.
              </p>
              
              <p className="text-sm text-gray-500 mt-4">
                <strong>Note:</strong> This game is not affiliated with, endorsed, sponsored, or specifically approved 
                by Wizards of the Coast LLC or Scryfall LLC. This is a fan project.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};