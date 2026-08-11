import React, { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Destination } from '../data/destinations'
import type { Trailhead, TrailheadEntrance } from '../data/trailheads'

export type TravelMode = 'walking' | 'driving' | 'transit'
export type ViewName = 'landmarks' | 'trailheads'

/*
 * Three contexts rather than one.
 *
 * A single provider meant every Landmarks change re-rendered TrailheadFinder
 * and vice versa, even though neither reads the other's data. Splitting them
 * keeps each view subscribed only to what it uses.
 *
 * Both state trees still live above the views rather than inside them: the
 * views unmount when you switch, so colocating state would silently discard
 * your selection every time you flipped between them.
 *
 * Map URLs are deliberately absent. They are a pure function of the selection,
 * the travel mode, and the provider, so they are derived during render instead
 * of being stored and synchronised by an effect.
 */

interface NavigationValue {
  currentView: ViewName
  setCurrentView: (view: ViewName) => void
}

interface LandmarksValue {
  travelMode: TravelMode
  setTravelMode: (mode: TravelMode) => void
  selectedDestination: Destination | null
  setSelectedDestination: (destination: Destination | null) => void
}

interface TrailheadValue {
  travelMode: TravelMode
  setTravelMode: (mode: TravelMode) => void
  selectedTrailhead: Trailhead | null
  setSelectedTrailhead: (trailhead: Trailhead | null) => void
  selectedEntrance: TrailheadEntrance | null
  setSelectedEntrance: (entrance: TrailheadEntrance | null) => void
  isQRCodeVisible: boolean
  setIsQRCodeVisible: (visible: boolean) => void
}

const NavigationContext = createContext<NavigationValue | undefined>(undefined)
const LandmarksContext = createContext<LandmarksValue | undefined>(undefined)
const TrailheadContext = createContext<TrailheadValue | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewName>('trailheads')

  const [landmarksTravelMode, setLandmarksTravelMode] = useState<TravelMode>('walking')
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)

  const [trailheadTravelMode, setTrailheadTravelMode] = useState<TravelMode>('driving')
  const [selectedTrailhead, setSelectedTrailhead] = useState<Trailhead | null>(null)
  const [selectedEntrance, setSelectedEntrance] = useState<TrailheadEntrance | null>(null)
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false)

  const navigation = useMemo<NavigationValue>(
    () => ({ currentView, setCurrentView }),
    [currentView]
  )

  const landmarks = useMemo<LandmarksValue>(
    () => ({
      travelMode: landmarksTravelMode,
      setTravelMode: setLandmarksTravelMode,
      selectedDestination,
      setSelectedDestination,
    }),
    [landmarksTravelMode, selectedDestination]
  )

  const trailhead = useMemo<TrailheadValue>(
    () => ({
      travelMode: trailheadTravelMode,
      setTravelMode: setTrailheadTravelMode,
      selectedTrailhead,
      setSelectedTrailhead,
      selectedEntrance,
      setSelectedEntrance,
      isQRCodeVisible,
      setIsQRCodeVisible,
    }),
    [trailheadTravelMode, selectedTrailhead, selectedEntrance, isQRCodeVisible]
  )

  return (
    <NavigationContext.Provider value={navigation}>
      <LandmarksContext.Provider value={landmarks}>
        <TrailheadContext.Provider value={trailhead}>{children}</TrailheadContext.Provider>
      </LandmarksContext.Provider>
    </NavigationContext.Provider>
  )
}

const useRequiredContext = <T,>(context: React.Context<T | undefined>, name: string): T => {
  const value = useContext(context)
  if (value === undefined) {
    throw new Error(`${name} must be used within an AppProvider`)
  }
  return value
}

// Context modules legitimately export both a provider component and hooks.
// eslint-disable-next-line react-refresh/only-export-components
export const useNavigation = () => useRequiredContext(NavigationContext, 'useNavigation')

// eslint-disable-next-line react-refresh/only-export-components
export const useLandmarksState = () => useRequiredContext(LandmarksContext, 'useLandmarksState')

// eslint-disable-next-line react-refresh/only-export-components
export const useTrailheadState = () => useRequiredContext(TrailheadContext, 'useTrailheadState')
