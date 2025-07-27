import React, { useEffect, useCallback } from 'react'
import { trailheads } from '../data/trailheads'
import type { Trailhead, TrailheadEntrance } from '../data/trailheads'
import { QRCodeDisplay } from './QRCodeDisplay'
import { BrowserLink } from './BrowserLink'
import {
  buildGoogleMapsUrlWalking,
  buildGoogleMapsUrlDriving,
  buildGoogleMapsUrlPublicTransit
} from '../utils/buildMapUrl'
import { FaWalking, FaCar, FaBus, FaChevronLeft, FaSuitcase, FaQrcode, FaChevronDown, FaChevronUp } from 'react-icons/fa'
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
  }, [selectedTrailhead])

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
  }, [selectedEntrance, generateUrl])



  const handleTravelModeChange = (mode: typeof trailheadTravelMode) => {
    setTrailheadTravelMode(mode)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-gray-900 shadow-xl rounded-2xl p-6 w-full max-w-md space-y-6 relative">
          <h1 className="text-3xl font-extrabold text-center text-white">Trailheads</h1>

          <div className="flex justify-center gap-4">
            <button
              aria-label="Walking"
              onClick={() => handleTravelModeChange('walking')}
              className={`text-xl p-2 rounded-full border transition-colors duration-200 ${
                trailheadTravelMode === 'walking'
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
                trailheadTravelMode === 'transit'
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
                trailheadTravelMode === 'driving'
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
                className="w-full border border-gray-700 bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            <div className="bg-gray-800 rounded-lg p-4 space-y-1">
              {selectedEntrance.milemarker && selectedEntrance.milemarker !== null && (
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Mile Marker:</span> {selectedEntrance.milemarker}
                </p>
              )}
              {selectedEntrance.notes && selectedEntrance.notes !== null && (
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Notes:<br /></span> {selectedEntrance.notes}
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
                onClick={() => setIsQRCodeVisible(!isQRCodeVisible)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                aria-label={isQRCodeVisible ? "Hide QR Code" : "Show QR Code"}
              >
                <FaQrcode className="text-sm" />
                <span className="text-sm">QR Code</span>
                {isQRCodeVisible ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
              </button>
              {isQRCodeVisible && <QRCodeDisplay url={trailheadUrl} size={128} />}
            </div>
          )}

          {/* Arrow button for larger screens */}
          <button
            onClick={onBack}
            className="hidden lg:block absolute -left-8 lg:-left-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Back to Landmarks"
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
          aria-label="Back to Landmarks"
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
