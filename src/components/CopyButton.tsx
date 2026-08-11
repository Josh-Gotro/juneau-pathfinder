import React, { useEffect, useRef, useState } from 'react'
import { CopyIcon } from './icons'
import { tap } from '../utils/haptics'

interface Props {
  value: string
  label: string
}

/**
 * Copies raw coordinates to the clipboard.
 *
 * The point is the no-signal case: a maps app that has already cached the area
 * can still navigate to a pasted lat/lng long after the directions link would
 * fail.
 */
export const CopyButton: React.FC<Props> = ({ value, label }) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      tap()
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked (insecure context or denied permission). The
      // coordinates are on screen next to the button either way.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="flex min-h-tap items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
    >
      <CopyIcon className="size-4" />
      <span aria-live="polite">{copied ? 'Copied' : 'Copy coordinates'}</span>
    </button>
  )
}
