import { SPV_LOCATIONS } from '../data/spvLocations.js';

/**
 * Normalizes location search text by trimming, lowercasing, and stripping
 * punctuation while preserving Telugu/Unicode alphabetic characters and digits.
 * @param {string} text 
 * @returns {string}
 */
export const normalizeLocationQuery = (text = '') => {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[,/\\#$@!%^&*()_+=\-[\]{};:'"?><~`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if query is a 6-digit Indian PIN code.
 * @param {string} query 
 * @returns {boolean}
 */
export const isSixDigitPincode = (query = '') => {
  return /^\d{6}$/.test((query || '').trim());
};

/**
 * Calculates geodesic distance between two coordinates using Haversine formula.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
export const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
  if (
    typeof lat1 !== 'number' || typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' || typeof lon2 !== 'number'
  ) {
    return Infinity;
  }

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Computes deterministic relevance score for a local SPV location against a query.
 * @param {Object} location 
 * @param {string} rawQuery 
 * @param {string} normalizedQuery 
 * @param {Array<string>} tokens 
 * @returns {number}
 */
export const scoreLocationMatch = (location, rawQuery, normalizedQuery, tokens) => {
  if (!location || !location.enabled) return 0;

  const locNameNorm = normalizeLocationQuery(location.name);
  const locMandalNorm = normalizeLocationQuery(location.mandal);
  const locDistrictNorm = normalizeLocationQuery(location.district);
  const locAliasesNorm = (location.aliases || []).map(a => normalizeLocationQuery(a));
  const locPincode = (location.pincode || '').trim();

  let score = 0;

  // 1. Direct 6-Digit PIN Code Query
  if (isSixDigitPincode(rawQuery)) {
    if (locPincode === rawQuery.trim()) {
      return 150 + (location.isPriority ? 10 : 0);
    }
    return 0;
  }

  // 2. Exact Canonical Name Match
  if (locNameNorm === normalizedQuery) {
    score += 100;
  }

  // 3. Exact Alias Match
  if (locAliasesNorm.some(alias => alias === normalizedQuery)) {
    score += 90;
  }

  // 4. Prefix Matching
  if (locNameNorm.startsWith(normalizedQuery)) {
    score += 80;
  } else if (locAliasesNorm.some(alias => alias.startsWith(normalizedQuery))) {
    score += 75;
  }

  // 5. Substring / Inclusion Matching
  if (locNameNorm.includes(normalizedQuery)) {
    score += 60;
  } else if (locAliasesNorm.some(alias => alias.includes(normalizedQuery))) {
    score += 45;
  }

  // 6. Mandal & District Exact Matches
  if (locMandalNorm === normalizedQuery) {
    score += 40;
  } else if (locMandalNorm.includes(normalizedQuery)) {
    score += 25;
  }

  if (locDistrictNorm === normalizedQuery) {
    score += 30;
  } else if (locDistrictNorm.includes(normalizedQuery)) {
    score += 15;
  }

  // 7. Multi-Token Combined Search (e.g. "Machavaram 533261", "Machavaram Rayavaram", "Pasalapudi 533261")
  if (tokens.length > 1) {
    let matchedTokensCount = 0;

    for (const token of tokens) {
      let tokenMatched = false;

      if (locPincode === token || locPincode.startsWith(token)) {
        score += 50;
        tokenMatched = true;
      }

      if (locNameNorm.includes(token)) {
        score += 40;
        tokenMatched = true;
      } else if (locAliasesNorm.some(a => a.includes(token))) {
        score += 35;
        tokenMatched = true;
      }

      if (locMandalNorm.includes(token)) {
        score += 35;
        tokenMatched = true;
      }

      if (locDistrictNorm.includes(token)) {
        score += 20;
        tokenMatched = true;
      }

      if (tokenMatched) {
        matchedTokensCount += 1;
      }
    }

    // Significant boost if all search tokens are satisfied
    if (matchedTokensCount === tokens.length) {
      score += 75;
    }
  }

  // Priority bonus
  if (location.isPriority && score > 0) {
    score += 10;
  }

  return score;
};

/**
 * Searches the local SPV priority locations dataset.
 * @param {string} query 
 * @returns {Array<Object>}
 */
export const searchSPVLocations = (query = '') => {
  const rawTrimmed = (query || '').trim();
  if (!rawTrimmed) return [];

  const normalizedQuery = normalizeLocationQuery(rawTrimmed);
  if (!normalizedQuery && !isSixDigitPincode(rawTrimmed)) return [];

  const tokens = normalizedQuery.split(' ').filter(t => t.length > 0);

  const scored = SPV_LOCATIONS.map((loc) => {
    const score = scoreLocationMatch(loc, rawTrimmed, normalizedQuery, tokens);
    return {
      location: loc,
      score
    };
  }).filter(item => item.score > 0);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.map(({ location, score }) => ({
    id: location.id,
    title: location.name,
    fullAddress: location.formattedAddress,
    shortAddress: location.shortAddress || location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    mandal: location.mandal,
    district: location.district,
    state: location.state,
    postalCode: location.pincode,
    country: location.country,
    isSpvPriority: true,
    source: 'spv_priority',
    score
  }));
};

/**
 * Merges local SPV priority results with external geocoder results,
 * ensuring local priority items stay at the top and removing duplicate places.
 * @param {Array<Object>} localResults 
 * @param {Array<Object>} externalResults 
 * @returns {Array<Object>}
 */
export const mergeAndRankSearchResults = (localResults = [], externalResults = []) => {
  const merged = [...localResults];
  const seenIds = new Set(localResults.map(r => r.id));

  for (const ext of externalResults) {
    if (!ext || typeof ext.latitude !== 'number' || typeof ext.longitude !== 'number') {
      continue;
    }

    const extNameNorm = normalizeLocationQuery(ext.title || '');
    const extPostal = (ext.postalCode || '').trim();

    // Check if this external result is a duplicate of any local SPV location
    const isDuplicateOfLocal = localResults.some((loc) => {
      // 1. Proximity check (within 3.5 km)
      const distance = calculateDistanceInKm(
        loc.latitude,
        loc.longitude,
        ext.latitude,
        ext.longitude
      );
      if (distance <= 3.5) return true;

      // 2. Name + Pincode Match
      const locNameNorm = normalizeLocationQuery(loc.title || '');
      if (locNameNorm === extNameNorm && loc.postalCode && extPostal && loc.postalCode === extPostal) {
        return true;
      }

      return false;
    });

    if (isDuplicateOfLocal) {
      continue;
    }

    const uniqueKey = `${ext.latitude.toFixed(4)}_${ext.longitude.toFixed(4)}`;
    if (seenIds.has(uniqueKey)) {
      continue;
    }
    seenIds.add(uniqueKey);

    merged.push({
      ...ext,
      isSpvPriority: false,
      source: 'external_search'
    });
  }

  return merged.slice(0, 8);
};

/**
 * Matches reverse-geocoded coordinates and address details against the SPV dataset.
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {Object} addressObj 
 * @returns {Object|null}
 */
export const matchLocationToSPV = (latitude, longitude, addressObj = {}) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  // 1. Check distance proximity to any SPV priority location (within 4.5km)
  for (const loc of SPV_LOCATIONS) {
    const dist = calculateDistanceInKm(latitude, longitude, loc.latitude, loc.longitude);
    if (dist <= 4.5) {
      return loc;
    }
  }

  // 2. Check administrative text matching (Village/Mandal + Pincode)
  const addrPostal = (addressObj.postalCode || addressObj.postcode || '').trim();
  const addrVillageNorm = normalizeLocationQuery(addressObj.village || addressObj.area || addressObj.suburb || '');
  const addrMandalNorm = normalizeLocationQuery(addressObj.mandal || addressObj.subdistrict || '');

  for (const loc of SPV_LOCATIONS) {
    const locNameNorm = normalizeLocationQuery(loc.name);
    const locMandalNorm = normalizeLocationQuery(loc.mandal);

    if (
      addrPostal === loc.pincode &&
      (addrVillageNorm.includes(locNameNorm) || locNameNorm.includes(addrVillageNorm))
    ) {
      return loc;
    }

    if (
      locMandalNorm &&
      (addrMandalNorm.includes(locMandalNorm) || locMandalNorm.includes(addrMandalNorm)) &&
      (addrVillageNorm.includes(locNameNorm) || locNameNorm.includes(addrVillageNorm))
    ) {
      return loc;
    }
  }

  return null;
};
