import React, { useState } from 'react'
import { destinations } from './data/destinations'
import type { Destination } from './data/destinations'
import { QRCodeDisplay } from './components/QRCodeDisplay'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit
} from './utils/buildMapUrl'
import { FaWalking, FaCar, FaBus } from 'react-icons/fa'

type TravelMode = 'walking' | 'driving' | 'transit'

const App: React.FC = () => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [travelMode, setTravelMode] = useState<TravelMode>('walking')

  const handleSelect = (dest: Destination) => {
    let url: string
    switch (travelMode) {
      case 'driving':
        url = buildGoogleMapsUrlDriving(dest.query)
        break
      case 'transit':
        url = buildGoogleMapsUrlPublicTransit(dest.query)
        break
      case 'walking':
      default:
        url = buildGoogleMapsUrlWalking(dest.query)
        break
    }
    setSelectedUrl(url)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Juneau Pathfinder</h1>

        {/* Travel Mode Icons */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            aria-label="Walking"
            onClick={() => setTravelMode('walking')}
            className={`text-2xl ${travelMode === 'walking' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <FaWalking />
          </button>
          <button
            aria-label="Public Transit"
            onClick={() => setTravelMode('transit')}
            className={`text-2xl ${travelMode === 'transit' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <FaBus />
          </button>
          <button
            aria-label="Driving"
            onClick={() => setTravelMode('driving')}
            className={`text-2xl ${travelMode === 'driving' ? 'text-emerald-600' : 'text-gray-400'}`}
          >
            <FaCar />
          </button>
        </div>

        {/* Dropdown for destination */}
        <div className="mb-6">
          <select
            title="Destination"
            className="w-full border border-gray-300 rounded p-2"
            onChange={(e) => {
              const selected = destinations.find(d => d.name === e.target.value)
              if (selected) handleSelect(selected)
            }}
            defaultValue=""
          >
            <option value="" disabled>Select a destination...</option>
            {destinations.map(dest => (
              <option key={dest.name} value={dest.name}>{dest.name}</option>
            ))}
          </select>
        </div>

        {/* Centered QR code */}
        {selectedUrl && <QRCodeDisplay url={selectedUrl} />}
      </div>
    </div>
  )
}

export default App
