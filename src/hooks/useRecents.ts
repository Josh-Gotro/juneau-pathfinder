import { useCallback, useState } from 'react'

const RECENT_LIMIT = 4

const readIds = (key: string): string[] => {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    // Private mode, quota, or hand-edited junk — an empty list is fine here.
    return []
  }
}

const writeIds = (key: string, ids: string[]) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids))
  } catch {
    // Persistence is a convenience; never let it break selection.
  }
}

/**
 * Recents and favourites for one picker, persisted across cold starts.
 *
 * Reads happen in a lazy initialiser so the first paint already has the list
 * rather than flashing empty and filling in.
 */
export const useRecents = (namespace: string) => {
  const recentsKey = `jp:recents:${namespace}`
  const favoritesKey = `jp:favorites:${namespace}`

  const [recentIds, setRecentIds] = useState<string[]>(() => readIds(recentsKey))
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readIds(favoritesKey))

  const pushRecent = useCallback(
    (id: string) => {
      setRecentIds((prev) => {
        const next = [id, ...prev.filter((existing) => existing !== id)].slice(0, RECENT_LIMIT)
        writeIds(recentsKey, next)
        return next
      })
    },
    [recentsKey]
  )

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavoriteIds((prev) => {
        const next = prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
        writeIds(favoritesKey, next)
        return next
      })
    },
    [favoritesKey]
  )

  return { recentIds, favoriteIds, pushRecent, toggleFavorite }
}
