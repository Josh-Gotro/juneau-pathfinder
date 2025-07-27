import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Destination } from '../data/destinations'
import type { Trailhead, TrailheadEntrance } from '../data/trailheads'

type TravelMode = 'walking' | 'driving' | 'transit'

interface AppContextType {
  // Pathfinder state
  pathfinderTravelMode: TravelMode
  selectedPathfinderDestination: Destination | null
  pathfinderUrl: string | null

  // TrailheadFinder state
  trailheadTravelMode: TravelMode
  selectedTrailhead: Trailhead | null
  selectedEntrance: TrailheadEntrance | null
  trailheadUrl: string | null
  isQRCodeVisible: boolean

  // Shared state
  currentView: 'landmarks' | 'trailheads'

  // Actions
  setPathfinderTravelMode: (mode: TravelMode) => void
  setSelectedPathfinderDestination: (dest: Destination | null) => void
  setPathfinderUrl: (url: string | null) => void
  setTrailheadTravelMode: (mode: TravelMode) => void
  setSelectedTrailhead: (trailhead: Trailhead | null) => void
  setSelectedEntrance: (entrance: TrailheadEntrance | null) => void
  setTrailheadUrl: (url: string | null) => void
  setIsQRCodeVisible: (visible: boolean) => void
  setCurrentView: (view: 'landmarks' | 'trailheads') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [pathfinderTravelMode, setPathfinderTravelMode] = useState<TravelMode>('walking')
  const [selectedPathfinderDestination, setSelectedPathfinderDestination] = useState<Destination | null>(null)
  const [pathfinderUrl, setPathfinderUrl] = useState<string | null>(null)

  const [trailheadTravelMode, setTrailheadTravelMode] = useState<TravelMode>('driving')
  const [selectedTrailhead, setSelectedTrailhead] = useState<Trailhead | null>(null)
  const [selectedEntrance, setSelectedEntrance] = useState<TrailheadEntrance | null>(null)
  const [trailheadUrl, setTrailheadUrl] = useState<string | null>(null)
  const [isQRCodeVisible, setIsQRCodeVisible] = useState<boolean>(false)

  const [currentView, setCurrentView] = useState<'landmarks' | 'trailheads'>('trailheads')

  const value: AppContextType = {
    pathfinderTravelMode,
    selectedPathfinderDestination,
    pathfinderUrl,
    trailheadTravelMode,
    selectedTrailhead,
    selectedEntrance,
    trailheadUrl,
    isQRCodeVisible,
    currentView,
    setPathfinderTravelMode,
    setSelectedPathfinderDestination,
    setPathfinderUrl,
    setTrailheadTravelMode,
    setSelectedTrailhead,
    setSelectedEntrance,
    setTrailheadUrl,
    setIsQRCodeVisible,
    setCurrentView,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Context files legitimately export both provider component and custom hook
// This is the standard React Context pattern and Fast Refresh works fine
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}