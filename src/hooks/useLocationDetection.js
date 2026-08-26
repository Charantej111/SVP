import { useState, useRef, useEffect, useCallback } from 'react';
import { reverseGeocode } from '../services/locationService';
import { classifyAccuracy } from '../utils/locationUtils';

/**
 * Custom hook for high-precision GPS detection, accuracy evaluation, reverse geocoding, and map coordination.
 */
export const useLocationDetection = (initialLocation = null) => {
  const [status, setStatus] = useState('idle'); 
  // 'idle' | 'detecting' | 'reverse_geocoding' | 'confirming' | 'adjusting_map' | 'low_accuracy' | 'permission_denied' | 'position_unavailable' | 'timeout' | 'error'

  const [detectedLocation, setDetectedLocation] = useState(initialLocation);
  const [detectionProgress, setDetectionProgress] = useState(0); // 0 to 100
  const [readingsCount, setReadingsCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // References to manage asynchronous operations safely
  const watchIdRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const bestPositionRef = useRef(null);
  const isMountedRef = useRef(true);

  // Clear any active geolocation watcher and safety timers
  const cleanupWatcher = useCallback(() => {
    if (watchIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  // Cancel any active network fetch
  const cancelActiveRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanupWatcher();
      cancelActiveRequest();
    };
  }, [cleanupWatcher, cancelActiveRequest]);

  /**
   * Completes GPS reading acquisition with the best available position.
   */
  const processBestReading = useCallback(async (bestCoords) => {
    cleanupWatcher();
    if (!isMountedRef.current || !bestCoords) return;

    const { latitude, longitude, accuracy } = bestCoords;
    const accuracyInfo = classifyAccuracy(accuracy);

    setStatus('reverse_geocoding');
    cancelActiveRequest();
    abortControllerRef.current = new AbortController();

    try {
      const locationData = await reverseGeocode(
        latitude,
        longitude,
        accuracy,
        'gps',
        abortControllerRef.current.signal
      );

      if (!isMountedRef.current) return;

      setDetectedLocation(locationData);
      
      if (accuracyInfo.category === 'poor') {
        setStatus('low_accuracy');
      } else {
        setStatus('confirming');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (!isMountedRef.current) return;

      console.error('Error reverse geocoding GPS coordinates:', err);
      setErrorMessage('Could not load address details for this location.');
      setStatus('error');
    }
  }, [cleanupWatcher, cancelActiveRequest]);

  /**
   * Initiates fresh, high-precision GPS detection.
   */
  const startGpsDetection = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('position_unavailable');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    // Reset detection state
    cleanupWatcher();
    cancelActiveRequest();
    bestPositionRef.current = null;
    setReadingsCount(0);
    setDetectionProgress(10);
    setErrorMessage(null);
    setStatus('detecting');

    let readingsSoFar = 0;

    // Safety timeout: after 8 seconds, accept whatever best reading we've gathered
    safetyTimeoutRef.current = setTimeout(() => {
      if (bestPositionRef.current) {
        processBestReading(bestPositionRef.current);
      } else {
        cleanupWatcher();
        if (isMountedRef.current) {
          setStatus('timeout');
          setErrorMessage('Location request timed out. Please check your GPS signal or search manually.');
        }
      }
    }, 12000);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0 // Request fresh coordinates, never cached
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          if (!isMountedRef.current) return;

          const coords = position.coords;
          readingsSoFar += 1;
          setReadingsCount(readingsSoFar);
          setDetectionProgress(Math.min(25 + readingsSoFar * 20, 90));

          // Check if this reading is more accurate than previous ones
          if (!bestPositionRef.current || coords.accuracy < bestPositionRef.current.accuracy) {
            bestPositionRef.current = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              accuracy: coords.accuracy,
              timestamp: position.timestamp
            };
          }

          // If we achieved high precision (<= 25m), accept immediately!
          if (coords.accuracy <= 25) {
            processBestReading(bestPositionRef.current);
            return;
          }

          // If we have gathered 4 or more readings, pick the best one
          if (readingsSoFar >= 4 && bestPositionRef.current) {
            processBestReading(bestPositionRef.current);
          }
        },
        (error) => {
          if (!isMountedRef.current) return;
          cleanupWatcher();

          switch (error.code) {
            case error.PERMISSION_DENIED: {
              const isHttpOnIp = typeof window !== 'undefined' && 
                window.location.protocol === 'http:' && 
                window.location.hostname !== 'localhost' && 
                window.location.hostname !== '127.0.0.1';
              
              if (isHttpOnIp) {
                setStatus('insecure_context');
                setErrorMessage('Mobile browsers block GPS over HTTP network addresses. Open using HTTPS (e.g. https://' + window.location.host + ') or search your location manually.');
              } else {
                setStatus('permission_denied');
                setErrorMessage('Location access is blocked. Please enable location permissions in your browser or search manually.');
              }
              break;
            }
            case error.POSITION_UNAVAILABLE:
              setStatus('position_unavailable');
              setErrorMessage('We could not determine your device location. Please check your GPS settings or search manually.');
              break;
            case error.TIMEOUT:
              // If we collected any reading before timeout, use it
              if (bestPositionRef.current) {
                processBestReading(bestPositionRef.current);
              } else {
                setStatus('timeout');
                setErrorMessage('Location detection took too long. Please try again or search manually.');
              }
              break;
            default:
              setStatus('error');
              setErrorMessage('An unexpected location error occurred. Please search manually.');
              break;
          }
        },
        geoOptions
      );
    } catch (err) {
      cleanupWatcher();
      setStatus('error');
      setErrorMessage('Could not initiate GPS detection.');
    }
  }, [cleanupWatcher, cancelActiveRequest, processBestReading]);

  /**
   * Selects an address found via search.
   */
  const selectSearchedPlace = useCallback(async (place) => {
    cleanupWatcher();
    cancelActiveRequest();
    setStatus('reverse_geocoding');

    abortControllerRef.current = new AbortController();

    try {
      // Reverse geocode to ensure complete address breakdown and canonical details
      const locationData = await reverseGeocode(
        place.latitude,
        place.longitude,
        place.accuracy || null,
        'search',
        abortControllerRef.current.signal
      );

      if (!isMountedRef.current) return;

      // Preserve any search title specifics
      if (place.title && !locationData.shortAddress) {
        locationData.shortAddress = place.title;
      }

      setDetectedLocation(locationData);
      setStatus('confirming');
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (!isMountedRef.current) return;

      // Direct fallback using search place object
      setDetectedLocation({
        latitude: place.latitude,
        longitude: place.longitude,
        accuracy: null,
        accuracyCategory: 'acceptable',
        accuracyLabel: 'Searched Place',
        formattedAddress: place.fullAddress || place.title,
        shortAddress: place.title || place.shortAddress,
        houseNumber: place.houseNumber || '',
        street: place.street || '',
        area: place.area || '',
        village: place.village || '',
        city: place.city || '',
        district: place.district || '',
        state: place.state || 'Andhra Pradesh',
        postalCode: place.postalCode || '',
        country: place.country || 'India',
        source: 'search',
        timestamp: Date.now()
      });
      setStatus('confirming');
    }
  }, [cleanupWatcher, cancelActiveRequest]);

  /**
   * Updates coordinates dynamically when adjusting pin on map.
   */
  const updateMapCoordinates = useCallback(async (lat, lng) => {
    cancelActiveRequest();
    abortControllerRef.current = new AbortController();

    try {
      const locationData = await reverseGeocode(
        lat,
        lng,
        null,
        'map',
        abortControllerRef.current.signal
      );

      if (!isMountedRef.current) return;
      setDetectedLocation(locationData);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('Map pin reverse geocoding skipped:', err);
    }
  }, [cancelActiveRequest]);

  /**
   * Cancels current operation and resets state back to default/search.
   */
  const resetToSearch = useCallback(() => {
    cleanupWatcher();
    cancelActiveRequest();
    setStatus('idle');
    setErrorMessage(null);
  }, [cleanupWatcher, cancelActiveRequest]);

  const openMapAdjustment = useCallback(() => {
    setStatus('adjusting_map');
  }, []);

  const backToConfirmation = useCallback(() => {
    setStatus('confirming');
  }, []);

  return {
    status,
    setStatus,
    detectedLocation,
    setDetectedLocation,
    detectionProgress,
    readingsCount,
    errorMessage,
    startGpsDetection,
    selectSearchedPlace,
    updateMapCoordinates,
    resetToSearch,
    openMapAdjustment,
    backToConfirmation
  };
};
