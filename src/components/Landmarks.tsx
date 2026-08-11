import React, { useEffect } from 'react'
import { destinations } from '../data/destinations'
import type { Destination } from '../data/destinations'
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

  const handleSelect = (dest: Destination) => {
    setSelectedPathfinderDestination(dest)
  }

  const generateUrl = (dest: Destination, mode: typeof pathfinderTravelMode) => {
    switch (mode) {
      case 'driving':
        return buildGoogleMapsUrlDriving(dest.query)
      case 'transit':
        return buildGoogleMapsUrlPublicTransit(dest.query)
      case 'walking':
      default:
        return buildGoogleMapsUrlWalking(dest.query)
    }
  }

  useEffect(() => {
    if (selectedPathfinderDestination) {
      const url = generateUrl(selectedPathfinderDestination, pathfinderTravelMode)
      setPathfinderUrl(url)
    }
  }, [selectedPathfinderDestination, pathfinderTravelMode, setPathfinderUrl])

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
      <label htmlFor="destination-select" className="sr-only">Destination</label>
      <select
        id="destination-select"
        className="min-h-tap w-full rounded-control border border-edge bg-surface px-4 text-ink focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-hidden"
        onChange={(e) => {
          const selected = destinations.find(d => d.name === e.target.value)
          if (selected) handleSelect(selected)
        }}
        value={selectedPathfinderDestination?.name || ""}
        title="Destination"
      >
        <option value="" disabled>Select a destination...</option>
        {destinations.map(dest => (
          <option key={dest.name} value={dest.name}>{dest.name}</option>
        ))}
      </select>

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
