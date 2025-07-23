export const buildGoogleMapsUrlWalking = (query: string): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=walking`

export const buildGoogleMapsUrlDriving = (query: string): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`

export const buildGoogleMapsUrlPublicTransit = (query: string): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=transit`
