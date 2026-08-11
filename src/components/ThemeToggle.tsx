import React, { useCallback } from 'react'
import { SunIcon, MoonIcon } from './icons'
import { useTheme } from '../hooks/useTheme'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Light/dark switch with a circular wipe spreading from the button itself.
 *
 * View Transitions snapshot the old and new document; all this does is replace
 * the default cross-fade on the incoming snapshot with a growing circle
 * centred on the tap. Every browser without the API — and anyone who has asked
 * for reduced motion — just gets the instant swap.
 */
export const ThemeToggle: React.FC = () => {
  const { resolved, setPreference } = useTheme()
  const next = resolved === 'dark' ? 'light' : 'dark'

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const apply = () => setPreference(next)

      if (!document.startViewTransition || prefersReducedMotion()) {
        apply()
        return
      }

      const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      // Far enough to cover the furthest corner from the button.
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

      const transition = document.startViewTransition(apply)
      void transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          {
            duration: 480,
            easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
    },
    [next, setPreference]
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={next === 'light' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="flex size-tap items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surface hover:text-ink"
    >
      {resolved === 'dark' ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  )
}
