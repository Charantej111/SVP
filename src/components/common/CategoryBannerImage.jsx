import React, { useState } from 'react';
import { DEPARTMENTS } from '../../data/categoriesData';

export const CategoryBannerImage = ({ categoryId, className = "w-full h-full object-cover" }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const department = DEPARTMENTS.find(d => d.id === categoryId);
  const imageUrl = department?.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img
        src={hasError ? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" : imageUrl}
        alt={department?.name || "Supermarket Category"}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 group-hover:scale-105`}
      />
    </div>
  );
};
