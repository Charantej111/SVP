import React from 'react';
import { MapPin, Check, Map, Search, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { classifyAccuracy } from '../../utils/locationUtils';

export const LocationConfirmation = ({
  location,
  onConfirm,
  onAdjustOnMap,
  onChangeLocation
}) => {
  if (!location) return null;

  const accuracyInfo = classifyAccuracy(location.accuracy);
  const isPoorAccuracy = accuracyInfo.category === 'poor';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* Location Status Card */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isPoorAccuracy 
          ? 'bg-amber-50/70 border-amber-200' 
          : 'bg-brand-50/40 border-brand-200'
      }`}>
        
        {/* Top meta tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-brand-800 text-white">
              <Sparkles className="w-3 h-3" />
              {location.source === 'gps' ? 'GPS Detected' : location.source === 'map' ? 'Pin Adjusted' : 'Search Selected'}
            </span>
          </div>

          {/* Accuracy Badge */}
          {typeof location.accuracy === 'number' && (
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isPoorAccuracy
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : accuracyInfo.category === 'excellent'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-brand-100 text-brand-800 border border-brand-200'
            }`}>
              {isPoorAccuracy ? (
                <AlertTriangle className="w-3 h-3 text-amber-600" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
              )}
              <span>{accuracyInfo.label}</span>
            </div>
          )}
        </div>

        {/* Address Details */}
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
            isPoorAccuracy ? 'bg-amber-100 text-amber-800' : 'bg-brand-800 text-white'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] sm:text-[17px] font-black text-[#02060C] tracking-tight leading-tight">
              {location.shortAddress || location.area || location.village || 'Delivery Area'}
            </h3>
            
            <p className="text-[12.5px] text-[#686B78] font-normal leading-relaxed mt-1">
              {location.formattedAddress}
            </p>

            {location.postalCode && (
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-white/80 border border-gray-200 px-2 py-0.5 rounded-lg">
                <span>PIN:</span>
                <span className="text-gray-900">{location.postalCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Poor Accuracy Warning Banner */}
        {isPoorAccuracy && (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 flex items-start gap-2 text-[12px] leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Approximate GPS Reading: </span>
              Your device reported an accuracy of ~{Math.round(location.accuracy)}m. We recommend fine-tuning your location on the map.
            </div>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        
        {/* Primary Confirmation Button */}
        <button
          type="button"
          onClick={onConfirm}
          className="w-full h-[48px] bg-brand-800 hover:bg-brand-900 text-white font-black text-[14px] rounded-2xl transition-all flex items-center justify-center gap-2 shadow-card hover:shadow-float active:scale-[0.99] cursor-pointer"
        >
          <Check className="w-4.5 h-4.5 stroke-[3px]" />
          <span>Confirm Delivery Location</span>
        </button>

        {/* Secondary: Map Adjustment Button */}
        <button
          type="button"
          onClick={onAdjustOnMap}
          className="w-full h-[44px] bg-white hover:bg-gray-50 border border-[#E2E2E7] hover:border-gray-400 text-[#02060C] font-extrabold text-[13px] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Map className="w-4 h-4 text-brand-800" />
          <span>{isPoorAccuracy ? 'Adjust Location on Map (Recommended)' : 'Fine-Tune Pin on Map'}</span>
        </button>

        {/* Tertiary: Change / Search again */}
        <button
          type="button"
          onClick={onChangeLocation}
          className="w-full py-2 text-center text-[12px] font-bold text-[#686B78] hover:text-brand-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search a different location</span>
        </button>

      </div>

    </div>
  );
};
