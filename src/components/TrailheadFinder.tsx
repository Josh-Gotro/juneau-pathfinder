import React, { useCallback, useEffect, useMemo } from 'react'
import { QRCodeDisplay } from './QRCodeDisplay'
import { AppShell } from './AppShell'
import { TravelModeSwitch } from './TravelModeSwitch'
import { ViewNav } from './ViewNav'
import { PlacePicker } from './PlacePicker'
import type { PickerItem } from './PlacePicker'
import { DirectionsBar } from './DirectionsBar'
import { trailheadPlaces } from '../utils/places'
import { distanceMiles, formatMiles } from '../utils/geo'
import { useRecents } from '../hooks/useRecents'
import { useGeolocation } from '../hooks/useGeolocation'
import { useMapProvider } from '../hooks/useMapProvider'
import { buildDirectionsUrl } from '../utils/directions'
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

  const { recentIds, favoriteIds, pushRecent, toggleFavorite } = useRecents('trailheads')
  const { coords: userCoords, status: locateStatus, request: locate } = useGeolocation()
  const { provider, setProvider } = useMapProvider()

  const selectedId =
    selectedTrailhead && selectedEntrance
      ? `${selectedTrailhead.name}::${selectedEntrance.name}`
      : null

  /**
   * Rows carry a distance once located, and fall back to the mile marker —
   * which is how the roadside trailheads are signed anyway.
   */
  const items: PickerItem[] = useMemo(() => {
    const withDistance = trailheadPlaces.map((place) => {
      const miles =
        userCoords && place.coords ? distanceMiles(userCoords, place.coords) : null
      return {
        place,
        miles,
        item: {
          id: place.id,
          title: place.title,
          subtitle: place.subtitle,
          meta:
            miles !== null
              ? formatMiles(miles)
              : place.milemarker
                ? `MM ${place.milemarker}`
                : undefined,
        } satisfies PickerItem,
      }
    })

    if (userCoords) {
      // Entries without coordinates sort last rather than jumbling the order.
      withDistance.sort((a, b) => (a.miles ?? Infinity) - (b.miles ?? Infinity))
    }

    return withDistance.map((entry) => entry.item)
  }, [userCoords])

  const handleSelect = useCallback(
    (id: string) => {
      const place = trailheadPlaces.find((candidate) => candidate.id === id)
      if (!place) return
      setSelectedTrailhead(place.trailhead)
      setSelectedEntrance(place.entrance)
      pushRecent(id)
    },
    [setSelectedTrailhead, setSelectedEntrance, pushRecent]
  )

  useEffect(() => {
    if (selectedEntrance) {
      setTrailheadUrl(buildDirectionsUrl(provider, selectedEntrance.query, trailheadTravelMode))
    }
  }, [selectedEntrance, provider, trailheadTravelMode, setTrailheadUrl])

  return (
    <AppShell
      title="Trailheads"
      footer={
        <>
          {trailheadUrl && (
            <DirectionsBar
              url={trailheadUrl}
              provider={provider}
              onSwitchProvider={setProvider}
              shareTitle={selectedTrailhead?.name}
            />
          )}
          <TravelModeSwitch value={trailheadTravelMode} onChange={setTrailheadTravelMode} />
          <ViewNav target="landmarks" onNavigate={onBack} />
        </>
      }
    >
      <PlacePicker
        label="Trailhead"
        placeholder="Select a trailhead..."
        items={items}
        selectedId={selectedId}
        onSelect={handleSelect}
        recentIds={recentIds}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        onLocate={locate}
        locateStatus={locateStatus}
      />

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
          {isQRCodeVisible && (
            <QRCodeDisplay
              url={trailheadUrl}
              size={192}
              title={selectedTrailhead?.name}
              subtitle={selectedEntrance?.name}
              mode={trailheadTravelMode}
            />
          )}
        </div>
      )}
    </AppShell>
  )
}
