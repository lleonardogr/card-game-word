interface ScryfallCard {
  name: string;
  id: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    art_crop: string;
  };
  card_faces?: Array<{
    name: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      art_crop: string;
    };
  }>;
}

/**
 * Default query for card search
 * t=legendary type=creature will fetch legendary creature cards
 */
export const DEFAULT_QUERY = 't=legendary type=creature';

/**
 * Fetches a random card from Scryfall API
 */
export const fetchRandomCard = async (query: string = DEFAULT_QUERY): Promise<ScryfallCard> => {
  const response = await fetch(`https://api.scryfall.com/cards/random?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch card: ${response.status}`);
  }
  
  return await response.json();
};

export interface ProcessedCardName {
  processedName: string;     // Standard version (letters only)
  originalName: string;      // Original display name (before comma, for normal mode)
  fullCardName: string;      // The complete card name for hard mode
  letterPositions: number[]; // Positions of letters in the name (for spaces handling)
  hasSpaces: boolean;        // Flag indicating if the name has spaces
}

/**
 * Process a card name for the game
 * @param cardName The original card name
 * @param minLength Minimum acceptable length (default 3)
 * @param maxLength Maximum acceptable length (default 8)
 */
export const processCardName = (cardName: string, minLength = 3, maxLength = 8): ProcessedCardName | null => {
  // For hard mode: use the complete card name
  const fullCardName = cardName.toUpperCase();
  
  // For normal mode: Extract the part before any comma
  const nameBeforeComma = cardName.split(',')[0].trim().toUpperCase();
  const originalName = nameBeforeComma;
  
  // Process the name to track letter positions and spaces
  const letterPositions: number[] = [];
  let processedName = '';
  let hasSpaces = false;
  
  // Find letter positions and handle spaces
  for (let i = 0; i < nameBeforeComma.length; i++) {
    const char = nameBeforeComma[i];
    if (/[A-Z]/i.test(char)) {
      letterPositions.push(processedName.length);
      processedName += char.toUpperCase();
    } else if (char === ' ') {
      hasSpaces = true;
    }
    // Skip other non-alphabetic characters
  }
  
  // Check if the name length is within acceptable range
  if (processedName.length >= minLength && processedName.length <= maxLength) {
    return { 
      processedName,
      originalName,
      fullCardName,
      letterPositions,
      hasSpaces
    };
  } else if (processedName.length > maxLength) {
    // Truncate to max length for normal mode only
    return {
      processedName: processedName.substring(0, maxLength),
      originalName,
      fullCardName,
      letterPositions: letterPositions.filter(pos => pos < maxLength),
      hasSpaces
    };
  }
  
  // Name is too short, can't use it
  return null;
};

/**
 * Gets a card name that can be used in the game
 */
export const getPlayableCardName = async (
  minLength = 3, 
  maxLength = 8,
  maxAttempts = 10
): Promise<ProcessedCardName> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      const card = await fetchRandomCard();
      const nameResult = processCardName(card.name, minLength, maxLength);
      
      if (nameResult) {
        console.log('Using card:', card.name, '→', nameResult.processedName);
        return nameResult;
      }
      
      console.log('Skipping card:', card.name, '(name length not suitable)');
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  }
  
  // Fallback to a default name if we couldn't get a suitable card after several attempts
  return { 
    processedName: 'JACE', 
    originalName: 'Jace Beleren',
    fullCardName: 'JACE BELEREN',
    letterPositions: [0, 1, 2, 3],
    hasSpaces: false
  };
};