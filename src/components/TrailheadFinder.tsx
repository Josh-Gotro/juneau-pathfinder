import React, { useEffect, useCallback } from 'react'
import { trailheads } from '../data/trailheads'
import type { Trailhead, TrailheadEntrance } from '../data/trailheads'
import { QRCodeDisplay } from './QRCodeDisplay'
import { BrowserLink } from './BrowserLink'
import { AppShell } from './AppShell'
import { TravelModeSwitch } from './TravelModeSwitch'
import { ViewNav } from './ViewNav'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit
} from '../utils/buildMapUrl'
import { FaQrcode, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useAppContext } from '../context/AppContext'

interface Props {
  onBack: () => void
}

export const TrailheadFinder: React.FC<Props> = ({ onBack }) => {
  const {
    trailheadTravelMode,
    selectedTrailhead,
    selectedEntrance,
    trailheadUrl,
    isQRCodeVisible,
    setTrailheadTravelMode,
    setSelectedTrailhead,
    setSelectedEntrance,
    setTrailheadUrl,
    setIsQRCodeVisible
  } = useAppContext()

  const handleTrailheadSelect = (trailhead: Trailhead) => {
    setSelectedTrailhead(trailhead)
    // Reset entrance selection when trailhead changes
    setSelectedEntrance(null)
  }

  // Auto-select entrance if trailhead has only one entrance
  useEffect(() => {
    if (selectedTrailhead && selectedTrailhead.entrances.length === 1) {
      setSelectedEntrance(selectedTrailhead.entrances[0])
    }
  }, [selectedTrailhead, setSelectedEntrance])

  const handleEntranceSelect = (entrance: TrailheadEntrance) => {
    setSelectedEntrance(entrance)
  }

  const generateUrl = useCallback((entrance: TrailheadEntrance, mode: typeof trailheadTravelMode) => {
    switch (mode) {
      case 'driving':
        return buildGoogleMapsUrlDriving(entrance.query)
      case 'transit':
        return buildGoogleMapsUrlPublicTransit(entrance.query)
      case 'walking':
      default:
        return buildGoogleMapsUrlWalking(entrance.query)
    }
  }, [])

  useEffect(() => {
    if (selectedEntrance) {
      const url = generateUrl(selectedEntrance, trailheadTravelMode)
      setTrailheadUrl(url)
    }
  }, [selectedEntrance, generateUrl, trailheadTravelMode, setTrailheadUrl])

  const selectClass =
    'min-h-tap w-full rounded-control border border-edge bg-surface px-4 text-ink focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-hidden'

  return (
    <AppShell
      title="Trailheads"
      footer={
        <>
          <TravelModeSwitch value={trailheadTravelMode} onChange={setTrailheadTravelMode} />
          <ViewNav target="landmarks" onNavigate={onBack} />
        </>
      }
    >
      <label htmlFor="trailhead-select" className="sr-only">Trailhead</label>
      <select
        id="trailhead-select"
        className={selectClass}
        onChange={(e) => {
          const selected = trailheads.find(t => t.name === e.target.value)
          if (selected) handleTrailheadSelect(selected)
        }}
        value={selectedTrailhead?.name || ""}
        title="Trailhead"
      >
        <option value="" disabled>Select a trailhead...</option>
        {trailheads.map(trailhead => (
          <option key={trailhead.name} value={trailhead.name}>
            {trailhead.name}
          </option>
        ))}
      </select>

      {/* Show entrance selection if trailhead has multiple entrances */}
      {selectedTrailhead && selectedTrailhead.entrances.length > 1 && (
        <>
          <label htmlFor="entrance-select" className="sr-only">Entrance</label>
          <select
            id="entrance-select"
            className={selectClass}
            onChange={(e) => {
              const selected = selectedTrailhead.entrances.find(entrance => entrance.name === e.target.value)
              if (selected) handleEntranceSelect(selected)
            }}
            value={selectedEntrance?.name || ""}
            title="Entrance"
          >
            <option value="" disabled>Select an entrance...</option>
            {selectedTrailhead.entrances.map(entrance => (
              <option key={entrance.name} value={entrance.name}>
                {entrance.name}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedEntrance && (
        <div className="space-y-1 rounded-control bg-surface p-4">
          {selectedEntrance.milemarker && selectedEntrance.milemarker !== null && (
            <p className="text-sm text-ink-muted">
              <span className="font-semibold">Mile Marker:</span> {selectedEntrance.milemarker}
            </p>
          )}
          {selectedEntrance.notes && selectedEntrance.notes !== null && (
            <p className="text-sm text-ink-muted">
              <span className="block font-semibold">Notes:</span> {selectedEntrance.notes}
            </p>
          )}
          {trailheadUrl && (
            <div className="pt-2">
              <BrowserLink url={trailheadUrl} />
            </div>
          )}
        </div>
      )}

      {trailheadUrl && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsQRCodeVisible(!isQRCodeVisible)}
            className="flex min-h-tap items-center gap-2 text-ink-muted transition-colors duration-200 hover:text-ink"
            aria-label={isQRCodeVisible ? "Hide QR Code" : "Show QR Code"}
            aria-expanded={isQRCodeVisible}
          >
            <FaQrcode aria-hidden="true" className="text-sm" />
            <span className="text-sm">QR Code</span>
            {isQRCodeVisible
              ? <FaChevronUp aria-hidden="true" className="text-xs" />
              : <FaChevronDown aria-hidden="true" className="text-xs" />}
          </button>
          {isQRCodeVisible && <QRCodeDisplay url={trailheadUrl} size={128} />}
        </div>
      )}
    </AppShell>
  )
}
