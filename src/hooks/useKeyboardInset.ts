import { useEffect, useState } from 'react'

/**
 * How many pixels at the bottom of the layout viewport are covered by the
 * on-screen keyboard.
 *
 * iOS does not shrink the layout viewport when the keyboard opens, so anything
 * anchored to the bottom of the screen — a sheet, its search field — ends up
 * behind it. The visual viewport is the only thing that reports the truth, and
 * the difference between it and the layout viewport is the keyboard.
 */
export const useKeyboardInset = (): number => {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      const covered = window.innerHeight - viewport.height - viewport.offsetTop
      // Small negative values show up during rubber-band scrolling.
      setInset(Math.max(0, Math.round(covered)))
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  return inset
}
