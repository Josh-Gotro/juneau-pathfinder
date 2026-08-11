import { useCallback, useState } from 'react'
import type { Coords } from '../utils/geo'

export type LocateStatus = 'idle' | 'locating' | 'ready' | 'denied' | 'unavailable'

/**
 * One-shot position lookup, requested explicitly.
 *
 * Deliberately not fired on mount: a permission prompt on first launch, before
 * you've asked for anything, is the kind of thing that gets denied once and
 * then stays denied.
 */
export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [status, setStatus] = useState<LocateStatus>('idle')

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setStatus('unavailable')
      return
    }

    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
        setStatus('ready')
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable')
      },
      // A rough fix beats a slow one here; any cached position under two
      // minutes is close enough to sort a trailhead list by.
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }
    )
  }, [])

  return { coords, status, request }
}
