export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'space' | 'special';

export interface GuessResult {
  letter: string;
  state: LetterState;
}

// Evaluate a guess against the target word that may contain spaces and special characters
export function evaluateGuess(guess: string, targetWord: string): GuessResult[] {
  const result: GuessResult[] = [];
  const targetLetterCount: Record<string, number> = {};
  
  // For counting purposes, consider only letters
  const targetLettersOnly = targetWord.replace(/[^A-Za-z]/g, '');
  
  // Count each letter in the target word (excluding spaces and special characters)
  for (const letter of targetLettersOnly) {
    targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
  }

  // First pass: mark correct letters, spaces and special characters
  const guessCopy = guess.split('');
  const targetCopy = targetWord.split('');
  const used: boolean[] = Array(targetWord.length).fill(false);

  for (let i = 0; i < targetWord.length; i++) {
    // Handle spaces in the target word
    if (targetCopy[i] === ' ') {
      result[i] = { letter: ' ', state: 'space' };
      used[i] = true;
      continue;
    }
    
    // Handle special characters in the target word
    if (!/[A-Za-z]/.test(targetCopy[i])) {
      result[i] = { letter: targetCopy[i], state: 'special' };
      used[i] = true;
      continue;
    }
    
    // Handle correct letters
    if (i < guessCopy.length && guessCopy[i] === targetCopy[i]) {
      result[i] = { letter: guessCopy[i], state: 'correct' };
      targetLetterCount[guessCopy[i]]--;
      used[i] = true;
    }
  }

  // Second pass: mark present and absent letters
  for (let i = 0; i < targetWord.length; i++) {
    if (used[i]) continue;
    
    if (i >= guessCopy.length) {
      // Handle case where guess is shorter than target word
      result[i] = { letter: '', state: 'empty' };
    } else if (targetLetterCount[guessCopy[i]] > 0) {
      result[i] = { letter: guessCopy[i], state: 'present' };
      targetLetterCount[guessCopy[i]]--;
    } else {
      result[i] = { letter: guessCopy[i], state: 'absent' };
    }
  }

  return result;
}

// Check if the guess is correct, respecting the exact target word in hard mode
export function isCorrectGuess(guess: string, targetWord: string): boolean {
  // In case of hard mode (with spaces and special characters), compare exactly
  if (targetWord.includes(' ') || /[^A-Za-z]/.test(targetWord)) {
    return guess.toUpperCase() === targetWord.toUpperCase();
  }
  
  // Normal mode: just compare the letters
  const normalizedGuess = guess.replace(/[^A-Za-z]/g, '').toUpperCase();
  const normalizedTarget = targetWord.replace(/[^A-Za-z]/g, '').toUpperCase();
  return normalizedGuess === normalizedTarget;
}

// Get a flat map of all letter states for the keyboard
export function getKeyboardLetterStates(
  guesses: GuessResult[][]
): Record<string, LetterState> {
  const letterStates: Record<string, LetterState> = {};
  
  for (const guess of guesses) {
    for (const { letter, state } of guess) {
      // Skip spaces and special characters
      if (letter === ' ' || letter === '' || state === 'special') continue;
      
      // Only override if the new state is "more correct"
      if (
        !letterStates[letter] || 
        (letterStates[letter] === 'absent' && state !== 'absent') ||
        (letterStates[letter] === 'present' && state === 'correct')
      ) {
        letterStates[letter] = state;
      }
    }
  }
  
  return letterStates;
}