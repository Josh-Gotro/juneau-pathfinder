import { useEffect, useState } from 'react'

/**
 * Connectivity, which matters more here than in most apps: the trailhead data
 * is bundled so the app itself loads anywhere, but every action it offers
 * needs a network, and past roughly Mile 30 out the road there isn't one.
 */
export const useOnline = () => {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  )

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return online
}
