import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Check, ArrowLeft, Loader2, LocateFixed, Navigation } from 'lucide-react';
import { reverseGeocode } from '../../services/locationService';

export const LocationMap = ({
  initialLocation,
  onConfirmAdjustedLocation,
  onBack
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const [currentCoords, setCurrentCoords] = useState({
    lat: initialLocation?.latitude || 16.9405,
    lng: initialLocation?.longitude || 81.9982
  });

  const [resolvedAddress, setResolvedAddress] = useState(initialLocation || null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Reverse geocode whenever pin position changes
  const fetchAddressForCoords = useCallback((lat, lng) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsGeocoding(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const data = await reverseGeocode(lat, lng, null, 'map');
        setResolvedAddress(data);
      } catch (e) {
        console.warn('Map reverse geocode error:', e);
      } finally {
        setIsGeocoding(false);
      }
    }, 400);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const startLat = initialLocation?.latitude || 16.9405;
    const startLng = initialLocation?.longitude || 81.9982;

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 16,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Draggable Pin Icon
    const pinIcon = L.divIcon({
      className: 'custom-map-pin-container',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(16, 185, 129, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 40px; height: 40px; border-radius: 9999px; background: #047857; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(4, 120, 87, 0.4); border: 2.5px solid white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 40]
    });

    // Add Marker
    const marker = L.marker([startLat, startLng], {
      draggable: true,
      icon: pinIcon
    }).addTo(map);

    markerRef.current = marker;

    // Add accuracy circle if accuracy is known
    if (initialLocation?.accuracy && typeof initialLocation.accuracy === 'number') {
      const circle = L.circle([startLat, startLng], {
        radius: initialLocation.accuracy,
        color: '#047857',
        fillColor: '#10B981',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(map);
      circleRef.current = circle;
    }

    // Handle marker dragend
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setCurrentCoords({ lat: pos.lat, lng: pos.lng });
      fetchAddressForCoords(pos.lat, pos.lng);
      if (circleRef.current) {
        circleRef.current.setLatLng(pos);
      }
    });

    // Handle map click to reposition pin
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setCurrentCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      fetchAddressForCoords(e.latlng.lat, e.latlng.lng);
      if (circleRef.current) {
        circleRef.current.setLatLng(e.latlng);
      }
    });

    // Ensure map tiles render properly after container sizing
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      map.remove();
    };
  }, [initialLocation, fetchAddressForCoords]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && initialLocation?.latitude && initialLocation?.longitude) {
      const latLng = [initialLocation.latitude, initialLocation.longitude];
      mapInstanceRef.current.setView(latLng, 17, { animate: true });
      if (markerRef.current) {
        markerRef.current.setLatLng(latLng);
      }
      if (circleRef.current) {
        circleRef.current.setLatLng(latLng);
      }
      setCurrentCoords({ lat: initialLocation.latitude, lng: initialLocation.longitude });
      fetchAddressForCoords(initialLocation.latitude, initialLocation.longitude);
    }
  };

  const handleConfirm = () => {
    const finalLocation = resolvedAddress || {
      latitude: currentCoords.lat,
      longitude: currentCoords.lng,
      formattedAddress: `Adjusted Delivery Pin (${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)})`,
      shortAddress: 'Map Delivery Pin',
      source: 'map',
      timestamp: Date.now()
    };
    onConfirmAdjustedLocation(finalLocation);
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      
      {/* Top Map Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] font-bold text-[#686B78] hover:text-[#02060C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-800 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
          Drag pin to your doorstep
        </span>
      </div>

      {/* Interactive Map Box */}
      <div className="relative w-full h-[260px] sm:h-[290px] rounded-2xl overflow-hidden border border-[#E2E2E7] shadow-inner bg-gray-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Recenter Button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-md flex items-center justify-center text-gray-700 hover:text-brand-800 transition-all cursor-pointer"
          title="Recenter to original reading"
          aria-label="Recenter to original location"
        >
          <LocateFixed className="w-4.5 h-4.5" />
        </button>

        {/* Dynamic Geocoding Spinner Pill */}
        {isGeocoding && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/75 text-white backdrop-blur-xs px-3 py-1.5 rounded-full text-[11.5px] font-bold flex items-center gap-2 shadow-lg">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Updating address...</span>
          </div>
        )}
      </div>

      {/* Current Address Preview Card */}
      <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E2E2E7] flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-brand-800 text-white shrink-0 mt-0.5">
          <MapPin className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-black text-[#02060C] truncate">
            {resolvedAddress?.shortAddress || 'Selected Map Location'}
          </div>
          <div className="text-[11.5px] text-[#686B78] font-medium line-clamp-2 leading-relaxed mt-0.5">
            {resolvedAddress?.formattedAddress || `Lat: ${currentCoords.lat.toFixed(5)}, Lon: ${currentCoords.lng.toFixed(5)}`}
          </div>
        </div>
      </div>

      {/* Confirm Map Position Button */}
      <button
        type="button"
        onClick={handleConfirm}
        className="w-full h-[48px] bg-brand-800 hover:bg-brand-900 text-white font-black text-[14px] rounded-2xl transition-all flex items-center justify-center gap-2 shadow-card hover:shadow-float active:scale-[0.99] cursor-pointer"
      >
        <Check className="w-4.5 h-4.5 stroke-[3px]" />
        <span>Confirm This Location</span>
      </button>

    </div>
  );
};
