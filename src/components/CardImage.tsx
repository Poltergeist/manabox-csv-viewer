import React, { useState, useEffect } from 'react';
import { Image, Loader } from 'lucide-react';
import { useScryfallCache } from '@/hooks/useScryfallCache';

interface CardImageProps {
  scryfallId: string;
  cardName?: string;
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium';
}

export const CardImage: React.FC<CardImageProps> = ({ 
  scryfallId, 
  cardName = 'Card', 
  onClick,
  className = '',
  size = 'small'
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getImage } = useScryfallCache();

  useEffect(() => {
    let mounted = true;
    
    const fetchImage = async () => {
      if (!scryfallId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        const url = await getImage(scryfallId);
        
        if (mounted) {
          if (url) {
            setImageUrl(url);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [scryfallId, getImage]);

  const sizeClasses = {
    small: 'w-12 h-16',
    medium: 'w-20 h-28'
  };

  const baseClasses = `${sizeClasses[size]} bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden`;
  const finalClasses = onClick 
    ? `${baseClasses} cursor-pointer hover:shadow-md transition-shadow ${className}`
    : `${baseClasses} ${className}`;

  if (loading) {
    return (
      <div className={finalClasses}>
        <Loader className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={finalClasses}>
        <Image className="w-4 h-4 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={finalClasses} onClick={onClick}>
      <img
        src={imageUrl}
        alt={`${cardName} card image`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};