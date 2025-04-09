import React, { useState, useEffect, useCallback } from 'react';
import { WordRow } from './WordRow';
import { Keyboard } from './Keyboard';
import { getRandomWord, isValidWord } from '@/utils/words';
import { evaluateGuess, GuessResult, getKeyboardLetterStates, isCorrectGuess } from '@/utils/game';

export const Game: React.FC = () => {
  const [targetWord, setTargetWord] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessResult[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
  // Initialize a new game
  const startNewGame = useCallback(() => {
    const newWord = getRandomWord();
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setGameWon(false);
    setMessage('');
    console.log('New word:', newWord); // For debugging
  }, []);

  // Initialize on first render
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

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
  }, [currentGuess, gameOver, guesses]);

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

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

    // Validate the word is in our dictionary
    if (!isValidWord(currentGuess)) {
      setMessage('Not in word list');
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
      setGameWon(true);
      setGameOver(true);
      setMessage(`Correct! The word was ${targetWord}`);
    } 
    // Check if the player lost (used all 6 guesses)
    else if (newGuesses.length >= 6) {
      setGameOver(true);
      setMessage(`Game over! The word was ${targetWord}`);
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
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-center mb-8">
        <h1 className="text-3xl font-bold">WORDLE</h1>
      </div>

      {message && (
        <div className="bg-gray-100 dark:bg-gray-800 p-2 text-center mb-4 rounded">
          {message}
        </div>
      )}

      <div className="mb-8">
        {rows}
      </div>

      <Keyboard onKeyPress={handleKeyPress} letterStates={letterStates} />
      
      {gameOver && (
        <div className="mt-8 text-center">
          <button
            onClick={startNewGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};