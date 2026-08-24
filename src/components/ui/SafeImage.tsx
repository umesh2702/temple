'use client';

import React, { useState, useEffect } from 'react';
import { getFallbackImageForCategory } from '@/lib/utils/fallbackImages';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  category?: string;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  category,
  fallbackSrc,
  className = '',
  ...props
}) => {
  const defaultFallback = fallbackSrc || getFallbackImageForCategory(category);
  const [imgSrc, setImgSrc] = useState<string>(typeof src === 'string' && src ? src : defaultFallback);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(typeof src === 'string' && src ? src : defaultFallback);
    setIsError(false);
    setIsLoading(true);
  }, [src, defaultFallback]);

  const handleError = () => {
    if (!isError) {
      setIsError(true);
      setImgSrc(defaultFallback);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 animate-pulse flex items-center justify-center text-xs text-stone-400">
          🛕
        </div>
      )}
      <img
        {...props}
        src={imgSrc}
        alt={alt || 'Temple Image'}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          handleError();
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
