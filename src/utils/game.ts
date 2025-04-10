export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface GuessResult {
  letter: string;
  state: LetterState;
}

// Evaluate a guess against the target word
export function evaluateGuess(guess: string, targetWord: string): GuessResult[] {
  const result: GuessResult[] = [];
  const targetLetterCount: Record<string, number> = {};
  const wordLength = targetWord.length;

  // Count each letter in the target word
  for (const letter of targetWord) {
    targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
  }

  // First pass: mark correct letters
  const guessCopy = guess.split('');
  const targetCopy = targetWord.split('');
  const used: boolean[] = Array(wordLength).fill(false);

  for (let i = 0; i < wordLength; i++) {
    if (guessCopy[i] === targetCopy[i]) {
      result[i] = { letter: guessCopy[i], state: 'correct' };
      targetLetterCount[guessCopy[i]]--;
      used[i] = true;
    }
  }

  // Second pass: mark present and absent letters
  for (let i = 0; i < wordLength; i++) {
    if (!used[i]) {
      if (targetLetterCount[guessCopy[i]] > 0) {
        result[i] = { letter: guessCopy[i], state: 'present' };
        targetLetterCount[guessCopy[i]]--;
      } else {
        result[i] = { letter: guessCopy[i], state: 'absent' };
      }
    }
  }

  return result;
}

// Check if the guess is correct
export function isCorrectGuess(guess: string, targetWord: string): boolean {
  return guess.toUpperCase() === targetWord.toUpperCase();
}

// Get a flat map of all letter states for the keyboard
export function getKeyboardLetterStates(
  guesses: GuessResult[][]
): Record<string, LetterState> {
  const letterStates: Record<string, LetterState> = {};
  
  for (const guess of guesses) {
    for (const { letter, state } of guess) {
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