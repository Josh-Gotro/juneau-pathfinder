export interface Coords {
  lat: number
  lng: number
}

const COORD_PATTERN = /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/

/**
 * Parses a "58.528461, -134.806618" query into coordinates.
 * Returns null for addresses, plus codes, or out-of-range values.
 */
export const parseCoords = (query: string): Coords | null => {
  const match = query.trim().match(COORD_PATTERN)
  if (!match) return null

  const lat = Number.parseFloat(match[1])
  const lng = Number.parseFloat(match[2])
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  return { lat, lng }
}

const EARTH_RADIUS_MILES = 3958.8
const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/** Great-circle distance in miles. */
export const distanceMiles = (from: Coords, to: Coords): number => {
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(a)))
}

/** Distance label sized to how precisely you care at that range. */
export const formatMiles = (miles: number): string => {
  if (miles < 0.1) return 'here'
  if (miles < 10) return `${miles.toFixed(1)} mi`
  return `${Math.round(miles)} mi`
}
