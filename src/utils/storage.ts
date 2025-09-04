import { type Card, type ScryfallCache, type ScryfallImage, type ScryfallCardData } from '@/types';

const SCRYFALL_CACHE_KEY = 'manabox-scryfall-cache';
const CSV_DATA_KEY = 'manabox-csv-data';
const CACHE_EXPIRY_DAYS = 7;

export const saveScryfallCache = (cache: ScryfallCache): void => {
  try {
    localStorage.setItem(SCRYFALL_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save Scryfall cache to localStorage:', error);
  }
};

export const loadScryfallCache = (): ScryfallCache => {
  try {
    const cached = localStorage.getItem(SCRYFALL_CACHE_KEY);
    if (cached) {
      const cache = JSON.parse(cached) as ScryfallCache;
      const now = Date.now();
      const cutoff = now - (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
      
      // Remove expired entries
      const cleanCache: ScryfallCache = {};
      Object.entries(cache).forEach(([id, data]) => {
        if (data.updatedAt > cutoff) {
          cleanCache[id] = data;
        }
      });
      
      return cleanCache;
    }
  } catch (error) {
    console.warn('Failed to load Scryfall cache from localStorage:', error);
  }
  return {};
};

export const saveCsvData = (csvData: string): void => {
  try {
    localStorage.setItem(CSV_DATA_KEY, csvData);
  } catch (error) {
    console.warn('Failed to save CSV data to localStorage:', error);
  }
};

export const loadCsvData = (): string | null => {
  try {
    return localStorage.getItem(CSV_DATA_KEY);
  } catch (error) {
    console.warn('Failed to load CSV data from localStorage:', error);
    return null;
  }
};

export const fetchScryfallImage = async (id: string): Promise<ScryfallImage | null> => {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ScryfallCardData = await response.json();
    
    // Get image URL, prioritizing normal size
    let imageUrl = data.image_uris?.normal || data.image_uris?.small;
    
    // Handle double-faced cards
    if (!imageUrl && data.card_faces && data.card_faces.length > 0) {
      imageUrl = data.card_faces[0].image_uris?.normal || data.card_faces[0].image_uris?.small;
    }
    
    if (imageUrl) {
      return {
        img: imageUrl,
        updatedAt: Date.now(),
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch Scryfall image for ID ${id}:`, error);
    return null;
  }
};

export const calculateEstimatedValue = (cards: Card[]): number => {
  if (!cards.length) return 0;
  
  const firstCard = cards[0];
  const keys = Object.keys(firstCard);
  
  const priceKey = keys.find(key => key.toLowerCase() === 'price');
  const quantityKey = keys.find(key => ['quantity', 'qty'].includes(key.toLowerCase()));
  
  if (!priceKey || !quantityKey) return 0;
  
  return cards.reduce((total, card) => {
    const priceValue = card[priceKey];
    const quantityValue = card[quantityKey];
    
    const price = typeof priceValue === 'string' ? parseFloat(priceValue) : 
                  typeof priceValue === 'number' ? priceValue : 0;
    const quantity = typeof quantityValue === 'string' ? parseInt(quantityValue) : 
                     typeof quantityValue === 'number' ? quantityValue : 0;
    
    return total + (price * quantity);
  }, 0);
};

export const detectScryfallColumn = (columns: string[]): string | null => {
  const scryfallIdPattern = /scryfall.*id/i;
  return columns.find(col => scryfallIdPattern.test(col)) || null;
};