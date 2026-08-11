import React, { useCallback, useEffect, useMemo } from 'react'
import { QRCodeDisplay } from './QRCodeDisplay'
import { BrowserLink } from './BrowserLink'
import { AppShell } from './AppShell'
import { TravelModeSwitch } from './TravelModeSwitch'
import { ViewNav } from './ViewNav'
import { PlacePicker } from './PlacePicker'
import type { PickerItem } from './PlacePicker'
import { landmarkPlaces } from '../utils/places'
import { distanceMiles, formatMiles } from '../utils/geo'
import { useRecents } from '../hooks/useRecents'
import { useGeolocation } from '../hooks/useGeolocation'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit
} from '../utils/buildMapUrl'
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

  const generateUrl = useCallback((query: string, mode: typeof pathfinderTravelMode) => {
    switch (mode) {
      case 'driving':
        return buildGoogleMapsUrlDriving(query)
      case 'transit':
        return buildGoogleMapsUrlPublicTransit(query)
      case 'walking':
      default:
        return buildGoogleMapsUrlWalking(query)
    }
  }, [])

  useEffect(() => {
    if (selectedPathfinderDestination) {
      setPathfinderUrl(generateUrl(selectedPathfinderDestination.query, pathfinderTravelMode))
    }
  }, [selectedPathfinderDestination, generateUrl, pathfinderTravelMode, setPathfinderUrl])

  return (
    <AppShell
      title="Landmarks"
      footer={
        <>
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
        <>
          <QRCodeDisplay url={pathfinderUrl} />
          <div className="text-center">
            <BrowserLink url={pathfinderUrl} />
          </div>
        </>
      )}
    </AppShell>
  )
}
