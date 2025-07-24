import React, { useState, useEffect } from 'react'
import { trailheads } from '../data/trailheads'
import type { Trailhead } from '../data/trailheads'
import { QRCodeDisplay } from './QRCodeDisplay'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit
} from '../utils/buildMapUrl'
import { FaWalking, FaCar, FaBus, FaChevronLeft, FaSuitcase, FaQrcode, FaChevronDown, FaChevronUp } from 'react-icons/fa'

type TravelMode = 'walking' | 'driving' | 'transit'

interface Props {
  onBack: () => void
}

export const TrailheadFinder: React.FC<Props> = ({ onBack }) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [travelMode, setTravelMode] = useState<TravelMode>('driving')
  const [selectedTrailhead, setSelectedTrailhead] = useState<Trailhead | null>(null)
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false)

  const handleSelect = (trailhead: Trailhead) => {
    setSelectedTrailhead(trailhead)
  }

  const generateUrl = (trailhead: Trailhead, mode: TravelMode) => {
    switch (mode) {
      case 'driving':
        return buildGoogleMapsUrlDriving(trailhead.query)
      case 'transit':
        return buildGoogleMapsUrlPublicTransit(trailhead.query)
      case 'walking':
      default:
        return buildGoogleMapsUrlWalking(trailhead.query)
    }
  }

  useEffect(() => {
    if (selectedTrailhead) {
      const url = generateUrl(selectedTrailhead, travelMode)
      setSelectedUrl(url)
    }
  }, [selectedTrailhead, travelMode])

  const handleTravelModeChange = (mode: TravelMode) => {
    setTravelMode(mode)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-md space-y-6 relative">
          <h1 className="text-3xl font-extrabold text-center text-white">Trailhead Finder</h1>

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

          <label htmlFor="trailhead-select" className="sr-only">Trailhead</label>
          <select
            id="trailhead-select"
            className="w-full border border-gray-700 bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            onChange={(e) => {
              const selected = trailheads.find(t => t.name === e.target.value)
              if (selected) handleSelect(selected)
            }}
            defaultValue=""
            title="Trailhead"
          >
            <option value="" disabled>Select a trailhead...</option>
            {trailheads.map(trailhead => (
              <option key={trailhead.name} value={trailhead.name}>
                {trailhead.name}
              </option>
            ))}
          </select>

          {selectedTrailhead && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-2">
              {selectedTrailhead.milemarker && (
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Mile Marker:</span> {selectedTrailhead.milemarker}
                </p>
              )}
              {selectedTrailhead.notes && (
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Notes:</span> {selectedTrailhead.notes}
                </p>
              )}
              {selectedUrl && (
                <a
                  href={selectedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline break-all"
                >
                  Open directions in browser
                </a>
              )}
            </div>
          )}

          {selectedUrl && (
            <div className="space-y-2">
              <button
                onClick={() => setIsQRCodeVisible(!isQRCodeVisible)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={isQRCodeVisible ? "Hide QR Code" : "Show QR Code"}
              >
                <FaQrcode className="text-sm" />
                <span className="text-sm">QR Code</span>
                {isQRCodeVisible ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
              </button>
              {isQRCodeVisible && <QRCodeDisplay url={selectedUrl} size={128} showBrowserLink={false} />}
            </div>
          )}

          {/* Arrow button for larger screens */}
          <button
            onClick={onBack}
            className="hidden lg:block absolute -left-8 lg:-left-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Back to Pathfinder"
          >
            <div className="flex items-center gap-1 lg:gap-2">
              <FaChevronLeft className="text-2xl lg:text-4xl" />
              <FaSuitcase className="text-lg lg:text-2xl" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile navigation button - positioned in reserved space */}
      <div className="lg:hidden p-6 text-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Back to Pathfinder"
        >
          <div className="flex items-center gap-2 justify-center">
            <FaChevronLeft className="text-2xl" />
            <FaSuitcase className="text-lg" />
          </div>
        </button>
      </div>
    </div>
  )
}
