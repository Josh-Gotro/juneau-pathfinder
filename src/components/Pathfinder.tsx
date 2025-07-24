import React, { useEffect } from 'react'
import { destinations } from '../data/destinations'
import type { Destination } from '../data/destinations'
import { QRCodeDisplay } from './QRCodeDisplay'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit
} from '../utils/buildMapUrl'
import { FaWalking, FaCar, FaBus, FaChevronRight, FaMap } from 'react-icons/fa'
import { useAppContext } from '../context/AppContext'

export const Pathfinder: React.FC = () => {
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

  const handleTravelModeChange = (mode: typeof pathfinderTravelMode) => {
    setPathfinderTravelMode(mode)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-md space-y-6 relative">
          <h1 className="text-3xl font-extrabold text-center text-white">Juneau Pathfinder</h1>

          <div className="flex justify-center gap-4">
            <button
              aria-label="Walking"
              onClick={() => handleTravelModeChange('walking')}
              className={`text-xl p-2 rounded-full border transition-colors duration-200 ${
                pathfinderTravelMode === 'walking'
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
                pathfinderTravelMode === 'transit'
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
                pathfinderTravelMode === 'driving'
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
            value={selectedPathfinderDestination?.name || ""}
            title="Destination"
          >
            <option value="" disabled>Select a destination...</option>
            {destinations.map(dest => (
              <option key={dest.name} value={dest.name}>{dest.name}</option>
            ))}
          </select>

          {pathfinderUrl && <QRCodeDisplay url={pathfinderUrl} />}

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
}