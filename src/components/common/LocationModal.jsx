import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Search, Navigation, Check, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { STORE_CONFIG } from '../../config/storeConfig';
import { LocationIllustration } from './LocationIllustration';

export const LocationModal = () => {
  const { isLocationModalOpen, closeLocationModal, userLocation, setUserLocation } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimer = useRef(null);

  // Live Address Autocomplete & Detection via OpenStreetMap Geocoding API
  useEffect(() => {
    if (!searchInput || searchInput.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const query = encodeURIComponent(`${searchInput.trim()}, Andhra Pradesh, India`);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5&countrycodes=in`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSuggestions(data.map(item => ({
              title: item.display_name.split(',')[0],
              fullAddress: item.display_name,
              lat: item.lat,
              lon: item.lon
            })));
          } else {
            // Fallback to custom query if no external map match found
            setSuggestions([{
              title: searchInput.trim(),
              fullAddress: `${searchInput.trim()}, Delivery Area`,
              isCustom: true
            }]);
          }
        }
      } catch (err) {
        // Fallback on network error
        setSuggestions([{
          title: searchInput.trim(),
          fullAddress: `${searchInput.trim()}, Delivery Area`,
          isCustom: true
        }]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchInput]);

  if (!isLocationModalOpen) return null;

  const handleSelectAddress = (addressTitle, fullAddress) => {
    setUserLocation(addressTitle || fullAddress);
    closeLocationModal();
  };

  const handleShareLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            if (res.ok) {
              const data = await res.json();
              const area = data.address?.suburb || data.address?.village || data.address?.town || data.address?.city || "Ramavaram, Kutukuluru";
              setUserLocation(area);
            } else {
              setUserLocation("Ramavaram, Kutukuluru");
            }
          } catch {
            setUserLocation("Ramavaram, Kutukuluru");
          } finally {
            setIsLocating(false);
            closeLocationModal();
          }
        },
        () => {
          setIsLocating(false);
          setUserLocation("Ramavaram, Kutukuluru");
          closeLocationModal();
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      setUserLocation("Ramavaram, Kutukuluru");
      closeLocationModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#E2E2E7] relative animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Modal Top Header Bar with isolated Close Button */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Delivery Location
          </div>
          
          {/* Isolated Close Button */}
          <button
            onClick={closeLocationModal}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close location modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 pt-2 pb-6 space-y-4">
          
          {/* Headline + Location Illustration */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 pr-2">
              <h2 className="text-[19px] sm:text-[22px] font-extrabold text-[#02060C] tracking-tight leading-[25px]">
                Select your delivery location
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#686B78] mt-1 font-medium leading-[17px]">
                Type your area, village or street name below to automatically detect your address.
              </p>
            </div>

            {/* Vector Graphic Illustration */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E2E2E7] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              <LocationIllustration className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Live Address Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search your village, street or area name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
              className="w-full h-[48px] pl-10 pr-10 bg-white border border-[#E2E2E7] focus:border-brand-800 rounded-2xl text-[14px] text-[#02060C] placeholder-[#93959F] focus:outline-none focus:ring-2 focus:ring-brand-800/20 transition-all font-medium shadow-2xs"
            />
            <Search className="w-4.5 h-4.5 text-[#93959F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            {isSearching ? (
              <Loader2 className="w-4.5 h-4.5 text-brand-800 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            ) : searchInput ? (
              <button 
                onClick={() => setSearchInput('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* GPS Current Location Button */}
          <button
            onClick={handleShareLocation}
            disabled={isLocating}
            className="w-full h-[44px] bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-800 font-extrabold text-[13px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-75"
          >
            <Navigation className={`w-4 h-4 fill-current ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting via GPS...' : 'Use current location (GPS)'}</span>
          </button>

          {/* Live Auto-Detected Search Suggestions */}
          {searchInput.trim().length >= 2 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-[#686B78] uppercase tracking-wider px-1">
                Detected Addresses
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5 no-scrollbar">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAddress(item.title, item.fullAddress)}
                    className="w-full p-3 rounded-xl border border-[#E2E2E7] bg-white hover:bg-brand-50 hover:border-brand-800/40 text-left flex items-start gap-3 transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="p-1.5 rounded-lg bg-brand-50 text-brand-800 group-hover:bg-brand-800 group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[#02060C] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#686B78] font-normal line-clamp-2 leading-relaxed mt-0.5">
                        {item.fullAddress}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-brand-800 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </button>
                ))}

                {/* Direct Typed Option */}
                <button
                  onClick={() => handleSelectAddress(searchInput.trim(), searchInput.trim())}
                  className="w-full p-2.5 rounded-xl border border-dashed border-brand-800/40 bg-brand-50/50 hover:bg-brand-50 text-left flex items-center gap-2.5 transition-all cursor-pointer text-brand-800 font-bold text-[12px]"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">Deliver to &quot;{searchInput.trim()}&quot;</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
