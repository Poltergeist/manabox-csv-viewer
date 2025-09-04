import { useState, useCallback } from 'react';
import { type ScryfallCache } from '@/types';
import { loadScryfallCache, saveScryfallCache, fetchScryfallImage } from '@/utils/storage';

export const useScryfallCache = () => {
  const [cache, setCache] = useState<ScryfallCache>(() => loadScryfallCache());

  const getImage = useCallback(async (id: string): Promise<string | null> => {
    if (!id) return null;
    
    // Check cache first
    if (cache[id]) {
      return cache[id].img;
    }

    // Fetch from Scryfall API
    try {
      const imageData = await fetchScryfallImage(id);
      if (imageData) {
        const newCache = { ...cache, [id]: imageData };
        setCache(newCache);
        saveScryfallCache(newCache);
        return imageData.img;
      }
    } catch (error) {
      console.error('Failed to fetch image for', id, error);
    }

    return null;
  }, [cache]);

  return { cache, getImage };
};