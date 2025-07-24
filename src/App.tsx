import React, { useState, useEffect } from 'react'
import { destinations } from './data/destinations'
import type { Destination } from './data/destinations'
import { QRCodeDisplay } from './components/QRCodeDisplay'
import { TrailheadFinder } from './components/TrailheadFinder'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit
} from './utils/buildMapUrl'
import { FaWalking, FaCar, FaBus, FaChevronRight, FaMap } from 'react-icons/fa'
import { Analytics } from '@vercel/analytics/react'

type TravelMode = 'walking' | 'driving' | 'transit'

const App: React.FC = () => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [travelMode, setTravelMode] = useState<TravelMode>('walking')
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [currentView, setCurrentView] = useState<'pathfinder' | 'trailhead'>('pathfinder')
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentView === 'pathfinder') {
      setCurrentView('trailhead')
    } else if (isRightSwipe && currentView === 'trailhead') {
      setCurrentView('pathfinder')
    }
  }

  const handleSelect = (dest: Destination) => {
    setSelectedDestination(dest)
  }

  const generateUrl = (dest: Destination, mode: TravelMode) => {
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
    if (selectedDestination) {
      const url = generateUrl(selectedDestination, travelMode)
      setSelectedUrl(url)
    }
  }, [selectedDestination, travelMode])

  const handleTravelModeChange = (mode: TravelMode) => {
    setTravelMode(mode)
  }

  const PathfinderView = () => (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-md space-y-6 relative">
          <h1 className="text-3xl font-extrabold text-center text-white">Juneau Pathfinder</h1>

          <div className="flex justify-center gap-4">
            <button
              aria-label="Walking"
              onClick={() => handleTravelModeChange('walking')}
              className={`text-xl p-2 rounded-full border transition-colors duration-200 ${
                travelMode === 'walking'
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FaWalking />
            </button>
            <button
              aria-label="Public Transit"
              onClick={() => handleTravelModeChange('transit')}
              className={`text-xl p-2 rounded-full border transition-colors duration-200 ${
                travelMode === 'transit'
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FaBus />
            </button>
            <button
              aria-label="Driving"
              onClick={() => handleTravelModeChange('driving')}
              className={`text-xl p-2 rounded-full border transition-colors duration-200 ${
                travelMode === 'driving'
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FaCar />
            </button>
          </div>

          <label htmlFor="destination-select" className="sr-only">Destination</label>
          <select
            id="destination-select"
            className="w-full border border-gray-700 bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            onChange={(e) => {
              const selected = destinations.find(d => d.name === e.target.value)
              if (selected) handleSelect(selected)
            }}
            defaultValue=""
            title="Destination"
          >
            <option value="" disabled>Select a destination...</option>
            {destinations.map(dest => (
              <option key={dest.name} value={dest.name}>{dest.name}</option>
            ))}
          </select>

          {selectedUrl && <QRCodeDisplay url={selectedUrl} />}

          {/* Arrow button for larger screens */}
          <button
            onClick={() => setCurrentView('trailhead')}
            className="hidden lg:block absolute -right-8 lg:-right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Go to Trailhead Finder"
          >
            <div className="flex items-center gap-1 lg:gap-2">
              <FaMap className="text-lg lg:text-4xl" />
              <FaChevronRight className="text-2xl lg:text-4xl" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile navigation button - positioned in reserved space */}
      <div className="lg:hidden p-6 text-center">
        <button
          onClick={() => setCurrentView('trailhead')}
          className="text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Go to Trailhead Finder"
        >
          <div className="flex items-center gap-2 justify-center">
            <FaMap className="text-lg" />
            <FaChevronRight className="text-2xl" />
          </div>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div
        className="min-h-screen select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {currentView === 'pathfinder' ? (
          <PathfinderView />
        ) : (
          <TrailheadFinder onBack={() => setCurrentView('pathfinder')} />
        )}
      </div>
      <Analytics />
    </>
  )
}

export default App