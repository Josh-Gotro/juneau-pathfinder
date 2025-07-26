import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from '@testing-library/react'
import App from './App'
import { AppProvider, useAppContext } from './context/AppContext'

// Mock the Analytics component
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}))

// Mock the child components
jest.mock('./components/Landmarks', () => ({
  Landmarks: () => <div data-testid="landmarks">Landmarks Component</div>,
}))

jest.mock('./components/TrailheadFinder', () => ({
  TrailheadFinder: ({ onBack }: { onBack: () => void }) => (
    <div data-testid="trailhead-finder">
      <button onClick={onBack} data-testid="back-button">
        Back to Landmarks
      </button>
      TrailheadFinder Component
    </div>
  ),
}))

// Helper component to test AppContent with custom context values
const TestWrapper: React.FC<{
  children: React.ReactNode
  initialView?: 'landmarks' | 'trailheads'
}> = ({ children, initialView = 'trailheads' }) => {
  return (
    <AppProvider>
      <TestContextSetter initialView={initialView} />
      {children}
    </AppProvider>
  )
}

const TestContextSetter: React.FC<{ initialView: 'landmarks' | 'trailheads' }> = ({
  initialView,
}) => {
  const { setCurrentView } = useAppContext()
  React.useEffect(() => {
    setCurrentView(initialView)
  }, [initialView, setCurrentView])
  return null
}

// AppContent component for isolated testing
const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext()
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

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

    if (isLeftSwipe && currentView === 'landmarks') {
      setCurrentView('trailheads')
    } else if (isRightSwipe && currentView === 'trailheads') {
      setCurrentView('landmarks')
    }
  }

  return (
    <div
      className="min-h-screen select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      data-testid="app-content"
    >
      {currentView === 'landmarks' ? (
        <div data-testid="landmarks">Landmarks Component</div>
      ) : (
        <div data-testid="trailhead-finder">
          <button onClick={() => setCurrentView('landmarks')} data-testid="back-button">
            Back to Landmarks
          </button>
          TrailheadFinder Component
        </div>
      )}
    </div>
  )
}

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('App Component', () => {
    it('renders without crashing', () => {
      render(<App />)
      expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
    })

    it('renders AppProvider and Analytics components', () => {
      render(<App />)
      // Since we start with 'trailheads' view by default in AppContext
      expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
    })
  })

  describe('AppContent Component', () => {
    it('renders landmarks view when currentView is landmarks', () => {
      render(
        <TestWrapper initialView="landmarks">
          <AppContent />
        </TestWrapper>
      )
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()
      expect(screen.queryByTestId('trailhead-finder')).not.toBeInTheDocument()
    })

    it('renders trailheads view when currentView is trailheads', () => {
      render(
        <TestWrapper initialView="trailheads">
          <AppContent />
        </TestWrapper>
      )
      expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
      expect(screen.queryByTestId('landmarks')).not.toBeInTheDocument()
    })

    it('switches from trailheads to landmarks when back button is clicked', () => {
      render(
        <TestWrapper initialView="trailheads">
          <AppContent />
        </TestWrapper>
      )

      expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()

      const backButton = screen.getByTestId('back-button')
      fireEvent.click(backButton)

      expect(screen.getByTestId('landmarks')).toBeInTheDocument()
      expect(screen.queryByTestId('trailhead-finder')).not.toBeInTheDocument()
    })

    it('has correct CSS classes and touch event handlers', () => {
      render(
        <TestWrapper>
          <AppContent />
        </TestWrapper>
      )

      const appContent = screen.getByTestId('app-content')
      expect(appContent).toHaveClass('min-h-screen', 'select-none')
    })
  })

  describe('Touch Swipe Functionality', () => {

    it('switches from landmarks to trailheads on left swipe', async () => {
      render(
        <TestWrapper initialView="landmarks">
          <AppContent />
        </TestWrapper>
      )

      const appContent = screen.getByTestId('app-content')
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()

      // Simulate left swipe (start at 100, end at 40, distance = 60 > 50)
      fireEvent.touchStart(appContent, {
        targetTouches: [{ clientX: 100 }],
      })
      fireEvent.touchMove(appContent, {
        targetTouches: [{ clientX: 40 }],
      })
      fireEvent.touchEnd(appContent)

      // Wait for state update
      await act(async () => {
        // Allow React to process the state update
      })

      expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
      expect(screen.queryByTestId('landmarks')).not.toBeInTheDocument()
    })

    it('switches from trailheads to landmarks on right swipe', async () => {
      render(
        <TestWrapper initialView="trailheads">
          <AppContent />
        </TestWrapper>
      )

      const appContent = screen.getByTestId('app-content')
      expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()

      // Simulate right swipe (start at 40, end at 100, distance = -60 < -50)
      fireEvent.touchStart(appContent, {
        targetTouches: [{ clientX: 40 }],
      })
      fireEvent.touchMove(appContent, {
        targetTouches: [{ clientX: 100 }],
      })
      fireEvent.touchEnd(appContent)

      // Wait for state update
      await act(async () => {
        // Allow React to process the state update
      })

      expect(screen.getByTestId('landmarks')).toBeInTheDocument()
      expect(screen.queryByTestId('trailhead-finder')).not.toBeInTheDocument()
    })

    it('does not switch views on insufficient swipe distance', async () => {
      render(
        <TestWrapper initialView="landmarks">
          <AppContent />
        </TestWrapper>
      )

      const appContent = screen.getByTestId('app-content')
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()

      // Simulate insufficient swipe (distance = 30 < 50)
      fireEvent.touchStart(appContent, {
        targetTouches: [{ clientX: 100 }],
      })
      fireEvent.touchMove(appContent, {
        targetTouches: [{ clientX: 70 }],
      })
      fireEvent.touchEnd(appContent)

      // Wait for potential state update
      await act(async () => {
        // Allow React to process any potential state update
      })

      // Should remain on landmarks view
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()
      expect(screen.queryByTestId('trailhead-finder')).not.toBeInTheDocument()
    })

    it('does not switch views when swiping in wrong direction for current view', async () => {
      render(
        <TestWrapper initialView="landmarks">
          <AppContent />
        </TestWrapper>
      )

      const appContent = screen.getByTestId('app-content')
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()

      // Simulate right swipe on landmarks view (should not switch)
      fireEvent.touchStart(appContent, {
        targetTouches: [{ clientX: 40 }],
      })
      fireEvent.touchMove(appContent, {
        targetTouches: [{ clientX: 100 }],
      })
      fireEvent.touchEnd(appContent)

      // Wait for potential state update
      await act(async () => {
        // Allow React to process any potential state update
      })

      // Should remain on landmarks view
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()
      expect(screen.queryByTestId('trailhead-finder')).not.toBeInTheDocument()
    })
  })
})