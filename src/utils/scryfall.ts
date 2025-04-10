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
 * Fetches a random card from Scryfall API
 */
export const fetchRandomCard = async (query: string = 't=legendary'): Promise<ScryfallCard> => {
  const response = await fetch(`https://api.scryfall.com/cards/random?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch card: ${response.status}`);
  }
  
  return await response.json();
};

export interface ProcessedCardName {
  processedName: string;
  originalName: string;
}

/**
 * Process a card name to get the part before a comma
 * @param cardName The original card name
 * @param minLength Minimum acceptable length (default 3)
 * @param maxLength Maximum acceptable length (default 8)
 */
export const processCardName = (cardName: string, minLength = 3, maxLength = 8): ProcessedCardName | null => {
  // Extract the part before any comma
  const nameBeforeComma = cardName.split(',')[0].trim().toUpperCase();
  const originalName = nameBeforeComma;
  
  // Remove non-alphabetic characters
  const onlyLetters = nameBeforeComma.replace(/[^A-Z]/g, '');
  
  // Check if the name length is within acceptable range
  if (onlyLetters.length >= minLength && onlyLetters.length <= maxLength) {
    return { 
      processedName: onlyLetters,
      originalName
    };
  } else if (onlyLetters.length > maxLength) {
    // Truncate to max length
    return {
      processedName: onlyLetters.substring(0, maxLength),
      originalName
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
    originalName: 'Jace Beleren'
  };
};