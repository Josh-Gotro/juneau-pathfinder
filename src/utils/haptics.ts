/**
 * A short confirmation buzz.
 *
 * Android only in practice — iOS Safari does not expose the Vibration API —
 * but it costs nothing where it is missing, and selection feedback that is
 * colour-only is easy to miss in bright light or with the phone half out of a
 * pocket.
 */
export const tap = (durationMs = 8) => {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(durationMs)
  } catch {
    // Blocked by a user gesture requirement or a permissions policy.
  }
}
