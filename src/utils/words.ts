export const WORDS = [
  'APPLE', 'BEACH', 'CLOCK', 'DREAM', 'EARTH', 
  'FOCUS', 'GHOST', 'HEART', 'IMAGE', 'JUICE', 
  'KNIFE', 'LIGHT', 'MANGO', 'NIGHT', 'OCEAN', 
  'PIANO', 'QUEST', 'ROYAL', 'STORM', 'TABLE', 
  'UNCLE', 'VOICE', 'WATER', 'XENON', 'YACHT', 
  'ZEBRA', 'BRAIN', 'CHAMP', 'DRINK', 'EAGLE', 
  'FLAME', 'GRAPE', 'HOUSE', 'IGLOO', 'JOLLY', 
  'KIOSK', 'LEMON', 'MONTH', 'NORTH', 'OLIVE', 
  'PRIDE', 'QUOTE', 'RIVER', 'SHINE', 'TIGER', 
  'UNITY', 'VALUE', 'WOMAN', 'XEROX', 'YOUTH',
  'ZESTY', 'BRAVE', 'CRAFT', 'DANCE', 'ERUPT',
  'FROST', 'GREEN', 'HYPER', 'INPUT', 'JOKER',
  'KINGS', 'LAUGH', 'MAGIC', 'NOVEL', 'OASIS',
  'PSALM', 'QUICK', 'RELAX', 'SWEET', 'TRUST'
];

// Get a random word from the list
export const getRandomWord = (): string => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};

// Check if a word is in the list
export const isValidWord = (word: string): boolean => {
  return WORDS.includes(word.toUpperCase());
};