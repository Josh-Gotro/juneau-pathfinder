import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useWakeLock } from '../hooks/useWakeLock'
import type { TravelMode } from '../context/AppContext'

const MODE_LABEL: Record<TravelMode, string> = {
  walking: 'Walking',
  driving: 'Driving',
  transit: 'Transit',
}

interface Props {
  url: string
  size?: number
  /** Shown under the code so both of you can confirm the destination. */
  title?: string
  subtitle?: string
  mode?: TravelMode
}

export const QRCodeDisplay: React.FC<Props> = ({ url, size = 256, title, subtitle, mode }) => {
  // Held out to a stranger — the screen must not sleep mid-handoff.
  useWakeLock(true)

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {/*
        Always white with a generous quiet zone, regardless of app theme.
        Scanners need the light module to be genuinely light, and the border
        is the quiet zone the spec requires to find the symbol at all.
      */}
      <div
        className="rounded-card bg-white p-4"
        style={{ width: 'min(70vw, 18rem)', maxWidth: `${size + 32}px` }}
      >
        <QRCodeSVG
          value={url}
          level="M"
          marginSize={2}
          bgColor="#ffffff"
          fgColor="#000000"
          className="h-auto w-full"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {title && (
        <div className="max-w-xs">
          <p className="font-semibold text-balance text-ink">{title}</p>
          {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
          {mode && <p className="text-sm text-ink-faint">{MODE_LABEL[mode]} directions</p>}
        </div>
      )}
    </div>
  )
}
