/**
 * Utility helpers for delivery location detection, formatting, and persistence.
 */

export const LOCATION_STORAGE_KEY = 'spv_delivery_location';
export const LEGACY_LOCATION_STORAGE_KEY = 'spv_superbazaar_location_v1';

/**
 * Classifies location accuracy into user-friendly categories.
 * @param {number} accuracyInMeters 
 * @returns {{ category: 'excellent' | 'acceptable' | 'poor', label: string, description: string }}
 */
export const classifyAccuracy = (accuracyInMeters) => {
  if (typeof accuracyInMeters !== 'number' || isNaN(accuracyInMeters)) {
    return {
      category: 'acceptable',
      label: 'Detected',
      description: 'Location detected',
    };
  }

  const rounded = Math.round(accuracyInMeters);

  if (rounded <= 30) {
    return {
      category: 'excellent',
      label: `High precision (~${rounded}m)`,
      description: 'Precise GPS fix detected within a few meters.',
    };
  }

  if (rounded <= 100) {
    return {
      category: 'acceptable',
      label: `Acceptable (~${rounded}m)`,
      description: 'Good location fix. You can verify or adjust on the map.',
    };
  }

  return {
    category: 'poor',
    label: `Approximate (~${rounded}m)`,
    description: 'Estimated location. We recommend adjusting the pin on the map.',
  };
};

/**
 * Extracts clean structured Indian address fields from Nominatim address object.
 * @param {Object} rawAddress 
 * @param {string} displayName 
 * @returns {Object}
 */
export const parseIndianAddress = (rawAddress = {}, displayName = '') => {
  const houseNumber = rawAddress.house_number || rawAddress.building || rawAddress.house_name || '';
  
  const street = rawAddress.road || 
                 rawAddress.street || 
                 rawAddress.pedestrian || 
                 rawAddress.residential || 
                 rawAddress.path || 
                 '';
                 
  const area = rawAddress.suburb || 
               rawAddress.neighbourhood || 
               rawAddress.subdistrict || 
               rawAddress.commercial || 
               rawAddress.industrial || 
               '';
               
  const village = rawAddress.village || 
                  rawAddress.hamlet || 
                  rawAddress.town || 
                  '';
                  
  const city = rawAddress.city || 
               rawAddress.town || 
               rawAddress.municipality || 
               rawAddress.city_district || 
               '';
               
  const district = rawAddress.state_district || 
                   rawAddress.district || 
                   rawAddress.county || 
                   '';
                   
  const state = rawAddress.state || 'Andhra Pradesh';
  const postalCode = rawAddress.postcode || '';
  const country = rawAddress.country || 'India';

  // Build a concise headline / display title (e.g. "Ramavaram, Kutukuluru" or "Benz Circle, Vijayawada")
  const primaryName = village || area || street || city || (displayName ? displayName.split(',')[0].trim() : 'Delivery Location');
  const secondaryName = (village && city && village !== city) ? city : (area && city && area !== city ? city : (district || state));
  
  const shortAddress = primaryName === secondaryName || !secondaryName 
    ? primaryName 
    : `${primaryName}, ${secondaryName}`;

  // Build clean multi-line formatted address
  const addressParts = [];
  if (houseNumber) addressParts.push(houseNumber);
  if (street && street !== primaryName) addressParts.push(street);
  if (area && area !== primaryName && area !== village) addressParts.push(area);
  if (village && village !== primaryName) addressParts.push(village);
  if (city && city !== primaryName && city !== village) addressParts.push(city);
  if (district && district !== city && district !== state) addressParts.push(district);
  if (state) addressParts.push(state);
  if (postalCode) addressParts.push(postalCode);

  let formattedAddress = addressParts.filter(Boolean).join(', ');
  
  // Fallback to displayName if formattedAddress is too brief
  if ((!formattedAddress || formattedAddress.length < 10) && displayName) {
    formattedAddress = displayName;
  }

  return {
    houseNumber,
    street,
    area,
    village,
    city,
    district,
    state,
    postalCode,
    country,
    shortAddress,
    formattedAddress: formattedAddress || displayName || 'Delivery Location'
  };
};

/**
 * Loads persisted delivery location from localStorage.
 * @returns {Object|null}
 */
export const getSavedDeliveryLocation = () => {
  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not parse stored delivery location', e);
  }

  // Check legacy string format as fallback
  try {
    const legacy = localStorage.getItem(LEGACY_LOCATION_STORAGE_KEY);
    if (legacy && typeof legacy === 'string') {
      return {
        latitude: 16.9405, // Default Ramavaram/Kutukuluru coordinates
        longitude: 81.9982,
        accuracy: null,
        formattedAddress: legacy,
        shortAddress: legacy.split(',')[0].trim(),
        area: legacy.split(',')[0].trim(),
        city: 'Kutukuluru',
        state: 'Andhra Pradesh',
        postalCode: '533264',
        country: 'India',
        source: 'legacy_saved',
        timestamp: Date.now()
      };
    }
  } catch (e) {
    console.warn('Could not read legacy location', e);
  }

  return null;
};

/**
 * Persists confirmed delivery location to localStorage.
 * @param {Object} locationObj 
 */
export const saveDeliveryLocationToStorage = (locationObj) => {
  if (!locationObj || typeof locationObj !== 'object') return;
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationObj));
    if (locationObj.shortAddress || locationObj.formattedAddress) {
      localStorage.setItem(LEGACY_LOCATION_STORAGE_KEY, locationObj.shortAddress || locationObj.formattedAddress);
    }
  } catch (e) {
    console.error('Failed to save delivery location to localStorage', e);
  }
};
