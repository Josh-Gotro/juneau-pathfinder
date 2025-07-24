// Helper function to detect if a query is a plus code
const isPlusCode = (query: string): boolean => {
  // Plus codes typically have format like "87G8P27V+JG" or "G5HV+96"
  return /^[A-Z0-9]{6,}\+[A-Z0-9]{2,}/.test(query) || query.includes('+')
}

// Helper function to detect if a query is coordinates
const isCoordinates = (query: string): boolean => {
  // Coordinates like "58.5290385,-134.8081391" or "58.5290385, -134.8081391"
  return /^-?\d+\.?\d*,\s*-?\d+\.?\d*/.test(query)
}

// Helper function to parse coordinates
const parseCoordinates = (query: string): { lat: number; lng: number } | null => {
  const match = query.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/)
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2])
    }
  }
  return null
}

export const buildGoogleMapsUrlWalking = (query: string): string => {
  if (isCoordinates(query)) {
    const coords = parseCoordinates(query)
    if (coords) {
      // For coordinates, use the proper Google Maps URL format
      return `https://www.google.com/maps/dir//${coords.lat},${coords.lng}/@${coords.lat},${coords.lng},15z/data=!4m2!4m1!3e2`
    }
  }

  if (isPlusCode(query)) {
    // For plus codes, use the place format
    return `https://www.google.com/maps/place/${encodeURIComponent(query)}`
  }

  // For regular addresses, use destination with travelmode
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=walking`
}

export const buildGoogleMapsUrlDriving = (query: string): string => {
  if (isCoordinates(query)) {
    const coords = parseCoordinates(query)
    if (coords) {
      // For coordinates, use the proper Google Maps URL format
      return `https://www.google.com/maps/dir//${coords.lat},${coords.lng}/@${coords.lat},${coords.lng},15z/data=!4m2!4m1!3e0`
    }
  }

  if (isPlusCode(query)) {
    // For plus codes, use the place format
    return `https://www.google.com/maps/place/${encodeURIComponent(query)}`
  }

  // For regular addresses, use destination with travelmode
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`
}

export const buildGoogleMapsUrlPublicTransit = (query: string): string => {
  if (isCoordinates(query)) {
    const coords = parseCoordinates(query)
    if (coords) {
      // For coordinates, use the proper Google Maps URL format
      return `https://www.google.com/maps/dir//${coords.lat},${coords.lng}/@${coords.lat},${coords.lng},15z/data=!4m2!4m1!3e3`
    }
  }

  if (isPlusCode(query)) {
    // For plus codes, use the place format
    return `https://www.google.com/maps/place/${encodeURIComponent(query)}`
  }

  // For regular addresses, use destination with travelmode
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=transit`
}
