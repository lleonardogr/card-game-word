import React, { useState, useEffect, useCallback } from 'react';
import { WordRow } from './WordRow';
import { Keyboard } from './Keyboard';
import { Help } from './Help';
import { getPlayableCardName, ProcessedCardName, DEFAULT_QUERY } from '@/utils/scryfall';
import { evaluateGuess, GuessResult, getKeyboardLetterStates, isCorrectGuess } from '@/utils/game';

export const Game: React.FC = () => {
  const [targetWord, setTargetWord] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [originalCardName, setOriginalCardName] = useState<string>('');
  const [wordLength, setWordLength] = useState<number>(5);
  
  // Initialize a new game
  const startNewGame = useCallback(async () => {
    setLoading(true);
    setMessage('Loading new card...');
    
    try {
      const cardResult: ProcessedCardName = await getPlayableCardName(3, 8);
      setTargetWord(cardResult.processedName);
      setOriginalCardName(cardResult.originalName);
      setWordLength(cardResult.processedName.length);
      setGuesses([]);
      setCurrentGuess('');
      setGameOver(false);
      setMessage('');
    } catch (error) {
      console.error('Failed to start new game:', error);
      setMessage('Failed to load a card. Try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLetter = useCallback((letter: string) => {
    if (currentGuess.length < wordLength) {
      setCurrentGuess(prev => prev + letter);
    }
  }, [currentGuess.length, wordLength]);

  const handleBackspace = useCallback(() => {
    setCurrentGuess(prev => prev.slice(0, -1));
  }, []);

  const handleEnter = useCallback(() => {
    // Ignore if the guess does not match the expected word length
    if (currentGuess.length !== wordLength) {
      setMessage(`Word must be ${wordLength} letters`);
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    // Evaluate the guess
    const result = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Check if the player won
    if (isCorrectGuess(currentGuess, targetWord)) {
      setGameOver(true);
      setMessage(`Correct! The card name was "${originalCardName}"`);
    } 
    // Check if the player lost (used all 6 guesses)
    else if (newGuesses.length >= 6) {
      setGameOver(true);
      setMessage(`Game over! The card name was "${originalCardName}"`);
    }
  }, [currentGuess, wordLength, targetWord, guesses, originalCardName]);

  // Initialize on first render
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || loading) return;

      if (e.key === 'Enter') {
        handleEnter();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleLetter(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, gameOver, loading, guesses, handleEnter, handleBackspace, handleLetter]);

  const handleKeyPress = (key: string) => {
    if (gameOver || loading) return;

    if (key === 'ENTER') {
      handleEnter();
    } else if (key === 'BACKSPACE') {
      handleBackspace();
    } else {
      handleLetter(key);
    }
  };

  // Calculate letter states for the keyboard
  const letterStates = getKeyboardLetterStates(guesses);

  // Generate rows for the game board
  const rows = [];
  
  // Add rows for completed guesses
  for (let i = 0; i < guesses.length; i++) {
    rows.push(<WordRow key={i} guess={guesses[i]} wordLength={wordLength} />);
  }
  
  // Add row for current guess if game is not over
  if (!gameOver && guesses.length < 6) {
    rows.push(<WordRow key={guesses.length} guess={null} currentGuess={currentGuess} wordLength={wordLength} />);
  }
  
  // Add empty rows to fill the board
  for (let i = rows.length; i < 6; i++) {
    rows.push(<WordRow key={i} guess={null} currentGuess="" wordLength={wordLength} />);
  }

  // Generate Scryfall search URL for legendary creatures
  const scryfallSearchUrl = `https://scryfall.com/search?q=${encodeURIComponent(DEFAULT_QUERY)}`;

  return (
    <div className="max-w-md w-full mx-auto p-4 flex flex-col items-center">
      {/* Help button positioned fixed at top right, above the title */}
      <div className="fixed top-4 right-4 z-10">
        <Help />
      </div>

      <div className="flex justify-center mb-8 w-full">
        <h1 className="text-3xl font-bold text-center">Cardle: Guess the Card!</h1>
      </div>

      {message && (
        <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center mb-4 rounded w-full">
          {message}
        </div>
      )}

      {loading ? (
        <div className="mb-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 text-center text-sm text-gray-500">
            Guess the {wordLength}-letter card name
            
            <a 
              href={scryfallSearchUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline inline-flex items-center ml-2"
            >
              <span className="underline">Browse all cards</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          {rows}
        </div>
      )}

      <div className="w-full">
        <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
      </div>
      
      {/* Footer with attribution and donation link */}
      <div className="mt-8 flex flex-col items-center text-center space-y-2">
        <p className="text-gray-600 dark:text-gray-400">
          Made with ❤️ and Coding
        </p>
        <a 
          href="https://donate.stripe.com/14kdTw0R07AdeQg3cc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
        >
          Buy me a coffee
        </a>
      </div>
      
      {gameOver && (
        <div className="mt-8 text-center">
          <button
            onClick={() => startNewGame()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'New Game'}
          </button>
        </div>
      )}
    </div>
  );
};