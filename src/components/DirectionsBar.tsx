import React, { useCallback, useState } from 'react'
import { FaDirections, FaShareAlt } from 'react-icons/fa'
import { MAP_PROVIDER_LABEL } from '../utils/directions'
import type { MapProvider } from '../utils/directions'

interface Props {
  url: string
  provider: MapProvider
  onSwitchProvider: (next: MapProvider) => void
  /** Destination name, used as the share sheet title. */
  shareTitle?: string
}

const canShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export const DirectionsBar: React.FC<Props> = ({
  url,
  provider,
  onSwitchProvider,
  shareTitle,
}) => {
  const [shareSupported] = useState(canShare)
  const other: MapProvider = provider === 'apple' ? 'google' : 'apple'

  const share = useCallback(() => {
    if (!canShare()) return
    // Rejected shares (user dismissed the sheet) are not errors worth surfacing.
    void navigator.share({ title: shareTitle, url }).catch(() => {})
  }, [url, shareTitle])

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-tap flex-1 items-center justify-center gap-2 rounded-control bg-accent font-semibold text-accent-ink transition-colors hover:bg-accent-hover active:bg-accent-active"
        >
          <FaDirections aria-hidden="true" />
          Directions
        </a>

        {shareSupported && (
          <button
            type="button"
            onClick={share}
            aria-label="Share directions"
            className="flex min-h-tap w-tap shrink-0 items-center justify-center rounded-control border border-edge text-ink-muted transition-colors hover:border-edge-strong hover:text-ink"
          >
            <FaShareAlt aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSwitchProvider(other)}
        className="self-center rounded-control px-2 py-1 text-xs text-ink-faint transition-colors hover:text-ink-muted"
      >
        Opens in {MAP_PROVIDER_LABEL[provider]} · use {MAP_PROVIDER_LABEL[other]}
      </button>
    </div>
  )
}
