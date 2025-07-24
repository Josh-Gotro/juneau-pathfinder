import React, { useState } from 'react'
import { Pathfinder } from './components/Pathfinder'
import { TrailheadFinder } from './components/TrailheadFinder'
import { AppProvider, useAppContext } from './context/AppContext'
import { Analytics } from '@vercel/analytics/react'

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext()
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

  return (
    <div
      className="min-h-screen select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {currentView === 'pathfinder' ? (
        <Pathfinder />
      ) : (
        <TrailheadFinder onBack={() => setCurrentView('pathfinder')} />
      )}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
      <Analytics />
    </AppProvider>
  )
}

export default App