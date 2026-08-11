import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'jp:theme'

const readPreference = (): ThemePreference => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  } catch {
    // Fall through to the system default.
  }
  return 'system'
}

const systemTheme = (): ResolvedTheme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'

const resolve = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? systemTheme() : preference

/** Keeps the installed app's status bar in step with the theme. */
const syncThemeColor = (theme: ResolvedTheme) => {
  const color = theme === 'light' ? '#f5f7f4' : '#030712'
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', color))
}

/**
 * Light and dark, defaulting to the system setting.
 *
 * A light theme is not just a preference here: a dark UI at full brightness is
 * harder to read outdoors than a light one, which is the condition this app is
 * actually used in.
 */
export const useTheme = () => {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference)
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolve(readPreference()))

  // Follow the OS while the preference is "system".
  useEffect(() => {
    if (preference !== 'system') {
      setResolved(preference)
      return
    }

    // Older WebViews and non-browser environments have no matchMedia; without
    // a system signal, dark is the safe assumption.
    if (typeof window.matchMedia !== 'function') {
      setResolved('dark')
      return
    }

    const query = window.matchMedia('(prefers-color-scheme: light)')
    const update = () => setResolved(query.matches ? 'light' : 'dark')
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [preference])

  useEffect(() => {
    const root = document.documentElement
    if (preference === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', preference)
    syncThemeColor(resolved)
  }, [preference, resolved])

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Preference is a convenience; never let it break rendering.
    }
  }, [])

  return { preference, resolved, setPreference }
}
