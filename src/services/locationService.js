import { parseIndianAddress, classifyAccuracy } from '../utils/locationUtils.js';
import { 
  searchSPVLocations, 
  mergeAndRankSearchResults, 
  matchLocationToSPV,
  isSixDigitPincode 
} from '../utils/locationSearchUtils.js';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Reverse geocode latitude and longitude into a structured Indian address.
 * Cross-matches coordinates with SPV local priority dataset.
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number|null} accuracy 
 * @param {string} source - 'gps' | 'search' | 'map'
 * @param {AbortSignal} [signal] 
 * @returns {Promise<Object>}
 */
export const reverseGeocode = async (latitude, longitude, accuracy = null, source = 'gps', signal = null) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new Error('Valid coordinates are required for reverse geocoding');
  }

  const url = `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

  try {
    const headers = {
      'Accept': 'application/json',
      'Accept-Language': 'en-IN,en;q=0.9,te;q=0.8'
    };
    
    try {
      headers['User-Agent'] = 'SPV-Superbazaar-App/1.0 (delivery-location)';
    } catch {}

    const response = await fetch(url, {
      headers,
      signal
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    const rawAddress = data.address || {};
    const parsed = parseIndianAddress(rawAddress, data.display_name);
    const accuracyInfo = classifyAccuracy(accuracy);

    // Cross-match against SPV priority service localities
    const spvMatch = matchLocationToSPV(latitude, longitude, parsed);

    return {
      latitude,
      longitude,
      accuracy: typeof accuracy === 'number' ? Math.round(accuracy) : null,
      accuracyCategory: accuracyInfo.category,
      accuracyLabel: accuracyInfo.label,
      accuracyDescription: accuracyInfo.description,
      formattedAddress: parsed.formattedAddress,
      shortAddress: spvMatch?.shortAddress || parsed.shortAddress,
      houseNumber: parsed.houseNumber,
      street: parsed.street,
      area: parsed.area,
      village: parsed.village || spvMatch?.name || '',
      city: parsed.city,
      mandal: parsed.mandal || spvMatch?.mandal || '',
      district: parsed.district || spvMatch?.district || '',
      state: parsed.state || spvMatch?.state || 'Andhra Pradesh',
      postalCode: parsed.postalCode || spvMatch?.pincode || '',
      country: parsed.country || 'India',
      source,
      isSpvServiceArea: Boolean(spvMatch),
      spvLocationId: spvMatch?.id || null,
      timestamp: Date.now()
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error; // Re-throw abort errors so caller knows it was cancelled
    }
    
    console.warn('Reverse geocoding request error, using fallback location structure:', error);
    
    const accuracyInfo = classifyAccuracy(accuracy);
    const spvMatch = matchLocationToSPV(latitude, longitude, {});

    return {
      latitude,
      longitude,
      accuracy: typeof accuracy === 'number' ? Math.round(accuracy) : null,
      accuracyCategory: accuracyInfo.category,
      accuracyLabel: accuracyInfo.label,
      accuracyDescription: accuracyInfo.description,
      formattedAddress: spvMatch?.formattedAddress || `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      shortAddress: spvMatch?.shortAddress || `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      houseNumber: '',
      street: '',
      area: '',
      village: spvMatch?.name || '',
      city: 'Andhra Pradesh',
      mandal: spvMatch?.mandal || '',
      district: spvMatch?.district || '',
      state: 'Andhra Pradesh',
      postalCode: spvMatch?.pincode || '',
      country: 'India',
      source,
      isSpvServiceArea: Boolean(spvMatch),
      spvLocationId: spvMatch?.id || null,
      timestamp: Date.now()
    };
  }
};

/**
 * Searches places with local SPV priority ranking followed by external geocoding.
 * 
 * Pipeline:
 * 1. Normalize query
 * 2. Search local SPV priority locations (exact name, aliases, PIN, mandal, district)
 * 3. If 6-digit PIN query, return local PIN matches directly without external noise
 * 4. Otherwise, fetch external results as supplemental fallback
 * 5. Deduplicate and merge results (local SPV locations always rank first)
 * 
 * @param {string} query 
 * @param {AbortSignal} [signal] 
 * @returns {Promise<Array<Object>>}
 */
export const searchPlaces = async (query, signal = null) => {
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  // 1. Local Priority Search First
  const localResults = searchSPVLocations(trimmed);

  // 2. If user searched a 6-digit PIN code, return local results under this PIN directly
  if (isSixDigitPincode(trimmed)) {
    if (localResults.length > 0) {
      return localResults;
    }
  }

  // 3. If we already have 4 or more high-scoring local matches, return them immediately
  if (localResults.length >= 4 && localResults[0].score >= 90) {
    return localResults;
  }

  // 4. External Geocoding as Supplemental / Fallback Layer
  const encodedQuery = encodeURIComponent(trimmed);
  const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&q=${encodedQuery}&addressdetails=1&limit=6&countrycodes=in`;

  try {
    const headers = {
      'Accept': 'application/json',
      'Accept-Language': 'en-IN,en;q=0.9,te;q=0.8'
    };

    try {
      headers['User-Agent'] = 'SPV-Superbazaar-App/1.0 (delivery-location)';
    } catch {}

    const response = await fetch(url, {
      headers,
      signal
    });

    if (!response.ok) {
      // If external fails, gracefully return local results
      return localResults;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return localResults;
    }

    const externalResults = data.map((item, index) => {
      const parsed = parseIndianAddress(item.address || {}, item.display_name);
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);

      return {
        id: item.place_id ? String(item.place_id) : `place_${index}_${Date.now()}`,
        title: parsed.shortAddress || item.display_name.split(',')[0].trim(),
        fullAddress: item.display_name,
        latitude: lat,
        longitude: lon,
        houseNumber: parsed.houseNumber,
        street: parsed.street,
        area: parsed.area,
        village: parsed.village,
        city: parsed.city,
        district: parsed.district,
        state: parsed.state,
        postalCode: parsed.postalCode,
        country: parsed.country,
        shortAddress: parsed.shortAddress,
        source: 'external_search'
      };
    });

    // 5. Merge local priority results with external results, dropping duplicates
    return mergeAndRankSearchResults(localResults, externalResults);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.warn('External geocoder unavailable, using local results:', error);
    return localResults;
  }
};
