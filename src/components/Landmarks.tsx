import React, { useCallback, useEffect, useMemo } from 'react'
import { QRCodeDisplay } from './QRCodeDisplay'
import { AppShell } from './AppShell'
import { TravelModeSwitch } from './TravelModeSwitch'
import { ViewNav } from './ViewNav'
import { PlacePicker } from './PlacePicker'
import type { PickerItem } from './PlacePicker'
import { DirectionsBar } from './DirectionsBar'
import { landmarkPlaces } from '../utils/places'
import { distanceMiles, formatMiles } from '../utils/geo'
import { useRecents } from '../hooks/useRecents'
import { useGeolocation } from '../hooks/useGeolocation'
import { useMapProvider } from '../hooks/useMapProvider'
import { buildDirectionsUrl } from '../utils/directions'
import { useAppContext } from '../context/AppContext'

export const Landmarks: React.FC = () => {
  const {
    pathfinderTravelMode,
    selectedPathfinderDestination,
    pathfinderUrl,
    setPathfinderTravelMode,
    setSelectedPathfinderDestination,
    setPathfinderUrl,
    setCurrentView
  } = useAppContext()

  const { recentIds, favoriteIds, pushRecent, toggleFavorite } = useRecents('landmarks')
  const { coords: userCoords, status: locateStatus, request: locate } = useGeolocation()
  const { provider, setProvider } = useMapProvider()

  const items: PickerItem[] = useMemo(() => {
    const withDistance = landmarkPlaces.map((place) => {
      const miles = userCoords && place.coords ? distanceMiles(userCoords, place.coords) : null
      return {
        miles,
        item: {
          id: place.id,
          title: place.title,
          meta: miles !== null ? formatMiles(miles) : undefined,
        } satisfies PickerItem,
      }
    })

    if (userCoords) {
      withDistance.sort((a, b) => (a.miles ?? Infinity) - (b.miles ?? Infinity))
    }

    return withDistance.map((entry) => entry.item)
  }, [userCoords])

  const handleSelect = useCallback(
    (id: string) => {
      const place = landmarkPlaces.find((candidate) => candidate.id === id)
      if (!place) return
      setSelectedPathfinderDestination(place.destination)
      pushRecent(id)
    },
    [setSelectedPathfinderDestination, pushRecent]
  )

  useEffect(() => {
    if (selectedPathfinderDestination) {
      setPathfinderUrl(
        buildDirectionsUrl(provider, selectedPathfinderDestination.query, pathfinderTravelMode)
      )
    }
  }, [selectedPathfinderDestination, provider, pathfinderTravelMode, setPathfinderUrl])

  return (
    <AppShell
      title="Landmarks"
      footer={
        <>
          {pathfinderUrl && (
            <DirectionsBar
              url={pathfinderUrl}
              provider={provider}
              onSwitchProvider={setProvider}
              shareTitle={selectedPathfinderDestination?.name}
            />
          )}
          <TravelModeSwitch value={pathfinderTravelMode} onChange={setPathfinderTravelMode} />
          <ViewNav target="trailheads" onNavigate={() => setCurrentView('trailheads')} />
        </>
      }
    >
      <PlacePicker
        label="Destination"
        placeholder="Select a destination..."
        items={items}
        selectedId={selectedPathfinderDestination?.name ?? null}
        onSelect={handleSelect}
        recentIds={recentIds}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        onLocate={locate}
        locateStatus={locateStatus}
      />

      {pathfinderUrl && (
        <QRCodeDisplay
          url={pathfinderUrl}
          title={selectedPathfinderDestination?.name}
          mode={pathfinderTravelMode}
        />
      )}
    </AppShell>
  )
}
