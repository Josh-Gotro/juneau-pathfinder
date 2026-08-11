import { useEffect } from 'react'

/**
 * Holds a screen wake lock while `active` is true.
 *
 * The whole point of the QR code is holding the phone out while someone else
 * finds their camera. Auto-lock firing mid-handoff is the failure this
 * prevents. The browser drops the lock whenever the page is hidden, so it is
 * reacquired on visibilitychange rather than assumed to persist.
 */
export const useWakeLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | null = null
    let released = false

    const acquire = async () => {
      try {
        sentinel = await navigator.wakeLock.request('screen')
      } catch {
        // Denied, unsupported, or the document was not visible. Not worth
        // surfacing — the screen simply behaves as it normally would.
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !released) void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      released = true
      document.removeEventListener('visibilitychange', handleVisibility)
      void sentinel?.release().catch(() => {})
    }
  }, [active])
}
