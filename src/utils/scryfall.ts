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

/**
 * Process a card name to get the part before a comma and ensure it's 5 letters
 */
export const processCardName = (cardName: string): string | null => {
  // Extract the part before any comma
  const nameBeforeComma = cardName.split(',')[0].trim().toUpperCase();
  
  // Remove non-alphabetic characters
  const onlyLetters = nameBeforeComma.replace(/[^A-Z]/g, '');
  
  // Check if the name has exactly 5 letters or can be extracted to 5 letters
  if (onlyLetters.length === 5) {
    return onlyLetters;
  } else if (onlyLetters.length > 5) {
    // Use the first 5 letters
    return onlyLetters.substring(0, 5);
  }
  
  // Name is too short, can't use it
  return null;
};

/**
 * Gets a card name that can be used in the game (5 letters)
 */
export const getPlayableCardName = async (maxAttempts: number = 10): Promise<string> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      const card = await fetchRandomCard();
      const processedName = processCardName(card.name);
      
      if (processedName) {
        console.log('Using card:', card.name, '→', processedName);
        return processedName;
      }
      
      console.log('Skipping card:', card.name, '(name too short)');
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  }
  
  // Fallback to a default name if we couldn't get a suitable card after several attempts
  return 'JACES';
};