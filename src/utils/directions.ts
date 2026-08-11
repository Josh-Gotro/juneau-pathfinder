import { parseCoords } from './geo'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit,
} from './buildMapUrl'
import type { TravelMode } from '../context/AppContext'

export type MapProvider = 'apple' | 'google'

export const MAP_PROVIDER_LABEL: Record<MapProvider, string> = {
  apple: 'Apple Maps',
  google: 'Google Maps',
}

/**
 * True on iPhone, iPad, and iPod.
 *
 * iPadOS 13+ reports a Macintosh user agent, so touch points are what
 * separate an iPad from a desktop Mac.
 */
export const isAppleMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  if (/iPhone|iPod|iPad/.test(ua)) return true
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
}

const APPLE_DIRFLG: Record<TravelMode, string> = {
  walking: 'w',
  driving: 'd',
  transit: 'r',
}

/**
 * Apple Maps via its https universal link rather than the maps:// scheme.
 * The https form opens the app directly on iOS and still resolves to
 * something useful everywhere else, so there is no dead link to handle.
 */
export const buildAppleMapsUrl = (query: string, mode: TravelMode): string => {
  const coords = parseCoords(query)
  const daddr = coords ? `${coords.lat},${coords.lng}` : query
  return `https://maps.apple.com/?daddr=${encodeURIComponent(daddr)}&dirflg=${APPLE_DIRFLG[mode]}`
}

export const buildGoogleMapsUrl = (query: string, mode: TravelMode): string => {
  switch (mode) {
    case 'driving':
      return buildGoogleMapsUrlDriving(query)
    case 'transit':
      return buildGoogleMapsUrlPublicTransit(query)
    case 'walking':
    default:
      return buildGoogleMapsUrlWalking(query)
  }
}

export const buildDirectionsUrl = (
  provider: MapProvider,
  query: string,
  mode: TravelMode
): string =>
  provider === 'apple' ? buildAppleMapsUrl(query, mode) : buildGoogleMapsUrl(query, mode)
