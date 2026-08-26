import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, ChevronRight, Sparkles, Building } from 'lucide-react';
import { searchPlaces } from '../../services/locationService.js';
import { searchSPVLocations, isSixDigitPincode } from '../../utils/locationSearchUtils.js';

export const LocationSearch = ({
  onSelectPlace,
  autoFocus = true
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    // 1. Instant Local Priority Search (Zero latency!)
    const immediateLocalMatches = searchSPVLocations(trimmed);
    if (immediateLocalMatches.length > 0) {
      setSuggestions(immediateLocalMatches);
      setHasSearched(true);
    }

    // If query is an exact 6-digit PIN code, local matches are sufficient
    if (isSixDigitPincode(trimmed) && immediateLocalMatches.length > 0) {
      setIsSearching(false);
      return;
    }

    // 2. Debounced External Geocoding for Supplemental / Broader Results
    setIsSearching(true);
    setHasSearched(true);

    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();

      try {
        const mergedResults = await searchPlaces(trimmed, abortControllerRef.current.signal);
        setSuggestions(mergedResults);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Search query error:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsSearching(false);
    setHasSearched(false);
  };

  const isPincodeSearch = isSixDigitPincode(query.trim());

  return (
    <div className="space-y-2">
      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search village, area, mandal or 6-digit pincode..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          className="w-full h-[48px] pl-11 pr-11 bg-[#F8F9FA] focus:bg-white border border-[#E2E2E7] focus:border-brand-800 rounded-2xl text-[14px] text-[#02060C] placeholder-[#93959F] focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium shadow-2xs"
        />
        <Search className="w-4.5 h-4.5 text-[#686B78] absolute left-3.5 top-1/2 -translate-y-1/2" />
        
        {isSearching ? (
          <Loader2 className="w-4.5 h-4.5 text-brand-800 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="w-6 h-6 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {/* Live Suggestions Dropdown */}
      {query.trim().length >= 2 && (
        <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#686B78] uppercase tracking-wider">
              {isPincodeSearch
                ? `Locations in PIN ${query.trim()}`
                : isSearching
                ? 'Searching places...'
                : suggestions.length > 0
                ? 'Search Suggestions'
                : 'No places found'}
            </span>
            {suggestions.length > 0 && (
              <span className="text-[11px] text-[#93959F]">
                {suggestions.length} {suggestions.length === 1 ? 'place' : 'places'}
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1.5 no-scrollbar pr-0.5">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPlace(item)}
                className={`w-full p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer group shadow-2xs ${
                  item.isSpvPriority
                    ? 'border-brand-200/80 bg-brand-50/30 hover:bg-brand-50 hover:border-brand-400'
                    : 'border-[#E2E2E7] bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {/* Icon */}
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 transition-colors ${
                  item.isSpvPriority
                    ? 'bg-brand-100 text-brand-800 group-hover:bg-brand-800 group-hover:text-white'
                    : 'bg-gray-100 text-gray-700 group-hover:bg-gray-800 group-hover:text-white'
                }`}>
                  {item.isSpvPriority ? (
                    <MapPin className="w-4 h-4" />
                  ) : (
                    <Building className="w-4 h-4" />
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13.5px] font-extrabold text-[#02060C] truncate group-hover:text-brand-900">
                      {item.title}
                    </span>

                    {item.isSpvPriority && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-brand-100 text-brand-800 border border-brand-200 px-1.5 py-0.5 rounded-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        SPV Delivery Area
                      </span>
                    )}

                    {item.postalCode && (
                      <span className="text-[10px] font-bold bg-white text-gray-700 border border-gray-200 px-1.5 py-0.5 rounded-md">
                        PIN {item.postalCode}
                      </span>
                    )}
                  </div>

                  {/* Subtitle / Hierarchy */}
                  <div className="text-[11.5px] text-[#686B78] font-medium line-clamp-2 leading-relaxed mt-0.5">
                    {item.isSpvPriority && item.mandal ? (
                      <span>{item.mandal} Mandal · {item.district || 'Konaseema'}</span>
                    ) : (
                      <span>{item.fullAddress}</span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-800 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
              </button>
            ))}

            {!isSearching && suggestions.length === 0 && hasSearched && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <p className="text-[12.5px] text-[#686B78] font-medium">
                  No matching locations found for &quot;{query}&quot;.
                </p>
                <p className="text-[11px] text-[#93959F] mt-1">
                  Try searching with your nearby Mandal, Town or 6-digit PIN (e.g. Machavaram, Someswaram, 533261, Mandapeta).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
