import React, { useCallback, useDeferredValue, useId, useMemo, useRef, useState } from 'react'
import { SearchIcon, StarIcon, LocationArrowIcon, ChevronDownIcon } from './icons'
import type { LocateStatus } from '../hooks/useGeolocation'
import { tap } from '../utils/haptics'

export interface PickerItem {
  id: string
  title: string
  subtitle?: string
  /** Right-aligned detail: distance when located, otherwise a mile marker. */
  meta?: string
}

interface Props {
  /** Accessible name for the control, e.g. "Trailhead". */
  label: string
  placeholder: string
  items: PickerItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  recentIds: string[]
  favoriteIds: string[]
  onToggleFavorite: (id: string) => void
  onLocate?: () => void
  locateStatus?: LocateStatus
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const LOCATE_LABEL: Record<LocateStatus, string> = {
  idle: 'Sort by distance',
  locating: 'Locating…',
  ready: 'Sorted by distance',
  denied: 'Location denied',
  unavailable: 'Location unavailable',
}

export const PlacePicker: React.FC<Props> = ({
  label,
  placeholder,
  items,
  selectedId,
  onSelect,
  recentIds,
  favoriteIds,
  onToggleFavorite,
  onLocate,
  locateStatus = 'idle',
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const titleId = useId()

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  )

  const open = useCallback(() => {
    const element = dialogRef.current
    if (!element) return
    setQuery('')
    if (typeof element.showModal === 'function') element.showModal()
    else element.setAttribute('open', '')
  }, [])

  const close = useCallback(() => {
    const element = dialogRef.current
    if (!element) return
    if (typeof element.close === 'function') element.close()
    else element.removeAttribute('open')
  }, [])

  const choose = useCallback(
    (id: string) => {
      tap()
      onSelect(id)
      close()
    },
    [onSelect, close]
  )

  const matches = useMemo(() => {
    const tokens = normalize(deferredQuery).split(' ').filter(Boolean)
    if (tokens.length === 0) return items
    return items.filter((item) => {
      const haystack = normalize(`${item.title} ${item.subtitle ?? ''}`)
      return tokens.every((token) => haystack.includes(token))
    })
  }, [items, deferredQuery])

  const isSearching = normalize(deferredQuery).length > 0

  /** Favourites and recents float to the top only when not actively searching. */
  const sections = useMemo(() => {
    if (isSearching) return [{ heading: null, items: matches }]

    const byId = new Map(items.map((item) => [item.id, item]))
    const favorites = favoriteIds.map((id) => byId.get(id)).filter((v): v is PickerItem => !!v)
    const recents = recentIds
      .filter((id) => !favoriteIds.includes(id))
      .map((id) => byId.get(id))
      .filter((v): v is PickerItem => !!v)

    const pinned = new Set([...favorites, ...recents].map((item) => item.id))
    const rest = items.filter((item) => !pinned.has(item.id))

    return [
      favorites.length ? { heading: 'Favorites', items: favorites } : null,
      recents.length ? { heading: 'Recent', items: recents } : null,
      { heading: pinned.size ? 'All' : null, items: rest },
    ].filter((section): section is { heading: string | null; items: PickerItem[] } => !!section)
  }, [isSearching, matches, items, favoriteIds, recentIds])

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Type two letters, hit go — no reaching for the list.
    if (event.key === 'Enter' && matches.length > 0) {
      event.preventDefault()
      choose(matches[0].id)
    }
  }

  const renderRow = (item: PickerItem) => {
    const isFavorite = favoriteIds.includes(item.id)
    const isSelected = item.id === selectedId

    return (
      <li key={item.id} className="flex items-stretch gap-1 border-b border-edge/60 last:border-b-0">
        <button
          type="button"
          onClick={() => choose(item.id)}
          aria-current={isSelected ? 'true' : undefined}
          className={`flex min-h-tap flex-1 items-center gap-3 rounded-control px-3 py-2 text-left transition-colors hover:bg-surface-raised ${
            isSelected ? 'text-accent' : 'text-ink'
          }`}
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{item.title}</span>
            {item.subtitle && (
              <span className="block truncate text-sm text-ink-muted">{item.subtitle}</span>
            )}
          </span>
          {item.meta && (
            <span className="shrink-0 text-sm tabular-nums text-ink-faint">{item.meta}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(item.id)}
          aria-label={isFavorite ? `Unfavorite ${item.title}` : `Favorite ${item.title}`}
          aria-pressed={isFavorite}
          className="flex min-h-tap w-12 shrink-0 items-center justify-center rounded-control text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink"
        >
          <StarIcon filled={isFavorite} className={isFavorite ? "size-4 text-accent" : "size-4"} />
        </button>
      </li>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label={label}
        className="flex min-h-tap w-full items-center gap-3 rounded-control border border-edge bg-surface px-4 py-2 text-left transition-colors hover:border-edge-strong"
      >
        <span className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="block truncate font-medium text-ink">{selected.title}</span>
              {selected.subtitle && (
                <span className="block truncate text-sm text-ink-muted">{selected.subtitle}</span>
              )}
            </>
          ) : (
            <span className="block truncate text-ink-muted">{placeholder}</span>
          )}
        </span>
        <ChevronDownIcon className="size-4 shrink-0 text-ink-faint" />
      </button>

      <dialog ref={dialogRef} aria-labelledby={titleId} className="place-sheet">
        <div className="flex max-h-[85dvh] flex-col">
          <div className="shrink-0 space-y-3 border-b border-edge px-4 pt-3 pb-3">
            <div className="mx-auto h-1 w-10 rounded-full bg-edge-strong" aria-hidden="true" />
            <h2 id={titleId} className="sr-only">{label}</h2>

            <div className="flex items-center gap-2 rounded-control border border-edge bg-ground px-3">
              <SearchIcon className="size-4 shrink-0 text-ink-faint" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={placeholder}
                aria-label={`Search ${label.toLowerCase()}`}
                className="min-h-tap w-full bg-transparent text-ink placeholder:text-ink-faint focus:outline-hidden"
              />
            </div>

            {onLocate && (
              <button
                type="button"
                onClick={onLocate}
                disabled={locateStatus === 'locating' || locateStatus === 'ready'}
                className="flex min-h-tap w-full items-center justify-center gap-2 rounded-control border border-edge text-sm text-ink-muted transition-colors hover:border-edge-strong hover:text-ink disabled:opacity-60"
              >
                <LocationArrowIcon className="size-3" />
                {LOCATE_LABEL[locateStatus]}
              </button>
            )}
          </div>

          <div className="place-sheet-list flex-1 overflow-y-auto px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {matches.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-ink-muted">
                Nothing matches “{query}”.
              </p>
            ) : (
              sections.map((section, index) => (
                <section key={section.heading ?? `section-${index}`}>
                  {section.heading && (
                    <h3 className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wider text-ink-faint uppercase">
                      {section.heading}
                    </h3>
                  )}
                  <ul>{section.items.map(renderRow)}</ul>
                </section>
              ))
            )}
          </div>

          <div className="shrink-0 border-t border-edge px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={close}
              className="min-h-tap w-full rounded-control text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
