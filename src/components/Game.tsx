import React, { useState, useEffect, useCallback } from 'react';
import { WordRow } from './WordRow';
import { Keyboard } from './Keyboard';
import { isValidWord } from '@/utils/words';
import { getPlayableCardName } from '@/utils/scryfall';
import { evaluateGuess, GuessResult, getKeyboardLetterStates, isCorrectGuess } from '@/utils/game';

export const Game: React.FC = () => {
  const [targetWord, setTargetWord] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [originalCardName, setOriginalCardName] = useState<string>('');
  
  // Initialize a new game
  const startNewGame = useCallback(async () => {
    setLoading(true);
    setMessage('Loading new card...');
    
    try {
      const newWord = await getPlayableCardName();
      setTargetWord(newWord);
      // Original card name is logged in getPlayableCardName
      setGuesses([]);
      setCurrentGuess('');
      setGameOver(false);
      setGameWon(false);
      setMessage('');
    } catch (error) {
      console.error('Failed to start new game:', error);
      setMessage('Failed to load a card. Try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, [currentGuess, gameOver, loading, guesses]);

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

  const handleLetter = (letter: string) => {
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleEnter = () => {
    // Ignore if the guess is not 5 letters
    if (currentGuess.length !== 5) {
      setMessage('Word must be 5 letters');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    // Validate word only if using dictionary validation
    // For card game, we'll accept any 5-letter combination
    // if (!isValidWord(currentGuess)) {
    //   setMessage('Not in word list');
    //   setTimeout(() => setMessage(''), 2000);
    //   return;
    // }

    // Evaluate the guess
    const result = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Check if the player won
    if (isCorrectGuess(currentGuess, targetWord)) {
      setGameWon(true);
      setGameOver(true);
      setMessage(`Correct! The card name was ${targetWord}`);
    } 
    // Check if the player lost (used all 6 guesses)
    else if (newGuesses.length >= 6) {
      setGameOver(true);
      setMessage(`Game over! The card name was ${targetWord}`);
    }
  };

  // Calculate letter states for the keyboard
  const letterStates = getKeyboardLetterStates(guesses);

  // Generate rows for the game board
  const rows = [];
  
  // Add rows for completed guesses
  for (let i = 0; i < guesses.length; i++) {
    rows.push(<WordRow key={i} guess={guesses[i]} />);
  }
  
  // Add row for current guess if game is not over
  if (!gameOver && guesses.length < 6) {
    rows.push(<WordRow key={guesses.length} guess={null} currentGuess={currentGuess} />);
  }
  
  // Add empty rows to fill the board
  for (let i = rows.length; i < 6; i++) {
    rows.push(<WordRow key={i} guess={null} currentGuess="" />);
  }

  return (
    <div className="max-w-md w-full mx-auto p-4 flex flex-col items-center">
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
          {rows}
        </div>
      )}

      <div className="w-full">
        <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
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