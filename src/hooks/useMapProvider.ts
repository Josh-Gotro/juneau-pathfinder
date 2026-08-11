import { useCallback, useState } from 'react'
import { isAppleMobile } from '../utils/directions'
import type { MapProvider } from '../utils/directions'

const STORAGE_KEY = 'jp:mapProvider'

const readProvider = (): MapProvider | null => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'apple' || saved === 'google' ? saved : null
  } catch {
    return null
  }
}

/**
 * Which maps app directions open in.
 *
 * Defaults to the platform's native app so the first tap goes straight to
 * navigation rather than through a browser tab and an install nag. An explicit
 * choice is remembered and always wins.
 */
export const useMapProvider = () => {
  const [provider, setProviderState] = useState<MapProvider>(
    () => readProvider() ?? (isAppleMobile() ? 'apple' : 'google')
  )

  const setProvider = useCallback((next: MapProvider) => {
    setProviderState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Preference is a convenience; never let it break the link.
    }
  }, [])

  return { provider, setProvider }
}
