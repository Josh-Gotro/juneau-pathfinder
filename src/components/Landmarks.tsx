import React, { useCallback, useMemo } from 'react'
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
import { useLandmarksState, useNavigation } from '../context/AppContext'

export const Landmarks: React.FC = () => {
  const { travelMode, setTravelMode, selectedDestination, setSelectedDestination } =
    useLandmarksState()
  const { currentView, setCurrentView } = useNavigation()

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
      setSelectedDestination(place.destination)
      pushRecent(id)
    },
    [setSelectedDestination, pushRecent]
  )

  // Derived, not stored: a pure function of the selection, mode, and provider.
  const url = selectedDestination
    ? buildDirectionsUrl(provider, selectedDestination.query, travelMode)
    : null

  return (
    <AppShell
      title="Landmarks"
      footer={
        <>
          {url && (
            <DirectionsBar
              url={url}
              provider={provider}
              onSwitchProvider={setProvider}
              shareTitle={selectedDestination?.name}
            />
          )}
          <TravelModeSwitch value={travelMode} onChange={setTravelMode} />
          <ViewNav target="trailheads" onNavigate={() => setCurrentView('trailheads')} />
        </>
      }
    >
      <PlacePicker
        label="Destination"
        placeholder="Select a destination..."
        items={items}
        selectedId={selectedDestination?.name ?? null}
        onSelect={handleSelect}
        recentIds={recentIds}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        onLocate={locate}
        locateStatus={locateStatus}
      />

      {url && (
        <QRCodeDisplay
          className="reveal"
          url={url}
          title={selectedDestination?.name}
          mode={travelMode}
          active={currentView === 'landmarks'}
        />
      )}
    </AppShell>
  )
}
