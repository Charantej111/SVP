import React, { useState } from 'react';

export const ProductImage = ({ 
  imageUrl,
  name, 
  brand,
  className = "w-full h-full object-contain" 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // High-speed fallback image if URL fails
  const fallbackUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-2xl">
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
      )}

      <img
        src={hasError || !imageUrl ? fallbackUrl : imageUrl}
        alt={`${brand} ${name}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 rounded-2xl`}
      />
    </div>
  );
};
