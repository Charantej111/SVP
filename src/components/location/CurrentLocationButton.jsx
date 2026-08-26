import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';

export const CurrentLocationButton = ({
  onClick,
  status,
  readingsCount = 0
}) => {
  const isLocating = status === 'detecting';
  const isGeocoding = status === 'reverse_geocoding';
  const isLoading = isLocating || isGeocoding;

  let buttonText = 'Use current location (GPS)';
  if (isLocating) {
    buttonText = readingsCount > 1 
      ? `Refining GPS accuracy (${readingsCount} readings)...` 
      : 'Detecting your location...';
  } else if (isGeocoding) {
    buttonText = 'Finding address details...';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full h-[46px] rounded-2xl font-extrabold text-[13px] sm:text-[14px] transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer select-none ${
        isLoading
          ? 'bg-brand-100/80 border border-brand-300 text-brand-900 cursor-not-allowed opacity-90'
          : 'bg-brand-50 hover:bg-brand-100 active:bg-brand-200 border border-brand-200 hover:border-brand-300 text-brand-800 active:scale-[0.99]'
      }`}
      aria-label="Use current location via GPS"
    >
      {isLoading ? (
        <Loader2 className="w-4.5 h-4.5 animate-spin text-brand-800 shrink-0" />
      ) : (
        <Navigation className="w-4 h-4 fill-current text-brand-800 shrink-0" />
      )}
      <span className="truncate">{buttonText}</span>
    </button>
  );
};
