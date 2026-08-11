import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TrailheadFinder } from '../TrailheadFinder'
import { AppProvider } from '../../context/AppContext'
import { trailheadPlaces } from '../../utils/places'

// Mock the child components
jest.mock('../QRCodeDisplay', () => ({
  QRCodeDisplay: ({ url, size }: { url: string; size: number }) => (
    <div data-testid="qr-code-display" data-url={url} data-size={size}>
      QR Code Display
    </div>
  ),
}))

jest.mock('../BrowserLink', () => ({
  BrowserLink: ({ url }: { url: string }) => (
    <a href={url} data-testid="browser-link" target="_blank" rel="noopener noreferrer">
      Open directions in browser
    </a>
  ),
}))

// Mocked to a predictable shape so URL assertions stay readable.
jest.mock('../../utils/buildMapUrl', () => ({
  buildGoogleMapsUrlWalking: jest.fn((query) => `https://maps.google.com/walking/${query}`),
  buildGoogleMapsUrlDriving: jest.fn((query) => `https://maps.google.com/driving/${query}`),
  buildGoogleMapsUrlPublicTransit: jest.fn((query) => `https://maps.google.com/transit/${query}`),
}))

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppProvider>{children}</AppProvider>
}

const renderFinder = (onBack = jest.fn()) => {
  render(
    <TestWrapper>
      <TrailheadFinder onBack={onBack} />
    </TestWrapper>
  )
  return { onBack }
}

/** Open the picker sheet. */
const openPicker = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Trailhead' }))
}

/**
 * Drive a selection the way a user does: open the sheet, type, tap a row.
 * `rowName` anchors at the start so it never collides with the row's
 * "Favorite <title>" companion button.
 */
const selectPlace = async (search: string, rowName: RegExp) => {
  openPicker()
  fireEvent.change(await screen.findByLabelText('Search trailhead'), {
    target: { value: search },
  })
  fireEvent.click(await screen.findByRole('button', { name: rowName }))
}

describe('TrailheadFinder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      renderFinder()

      expect(screen.getByText('Trailheads')).toBeInTheDocument()
      expect(screen.getByText('Select a trailhead...')).toBeInTheDocument()
    })

    it('renders travel mode buttons', () => {
      renderFinder()

      expect(screen.getByLabelText('Walking')).toBeInTheDocument()
      expect(screen.getByLabelText('Public Transit')).toBeInTheDocument()
      expect(screen.getByLabelText('Driving')).toBeInTheDocument()
    })

    it('renders back button', () => {
      renderFinder()

      expect(screen.getByLabelText('Back to Landmarks')).toBeInTheDocument()
    })
  })

  describe('Picker', () => {
    it('lists every entrance as its own row', async () => {
      renderFinder()
      openPicker()

      const rows = await screen.findAllByRole('button', { name: /^Favorite / })
      expect(rows).toHaveLength(trailheadPlaces.length)
    })

    it('labels rows of multi-entrance trailheads with the entrance name', async () => {
      renderFinder()
      openPicker()

      fireEvent.change(await screen.findByLabelText('Search trailhead'), {
        target: { value: 'treadwell' },
      })

      expect(screen.getByRole('button', { name: /^Treadwell Ditch Blueberry Hill/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Treadwell Ditch Eagle Crest/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Treadwell Ditch Sandy Beach/ })).toBeInTheDocument()
    })

    it('filters on entrance name as well as trailhead name', async () => {
      renderFinder()
      openPicker()

      fireEvent.change(await screen.findByLabelText('Search trailhead'), {
        target: { value: 'blueberry' },
      })

      expect(screen.getByRole('button', { name: /^Treadwell Ditch Blueberry Hill/ })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^Amalga/ })).not.toBeInTheDocument()
    })

    it('reports when nothing matches', async () => {
      renderFinder()
      openPicker()

      fireEvent.change(await screen.findByLabelText('Search trailhead'), {
        target: { value: 'zzzz' },
      })

      expect(screen.getByText(/Nothing matches/)).toBeInTheDocument()
    })
  })

  describe('Selection', () => {
    it('selects a single-entrance trailhead in one tap', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)

      await waitFor(() => {
        expect(screen.getByTestId('browser-link')).toBeInTheDocument()
      })
      expect(screen.getByText('27.2')).toBeInTheDocument()
    })

    it('selects a specific entrance in one tap', async () => {
      renderFinder()
      await selectPlace('treadwell', /^Treadwell Ditch Blueberry Hill/)

      await waitFor(() => {
        expect(screen.getByText(/Large parking area/)).toBeInTheDocument()
      })
      expect(screen.getByTestId('browser-link')).toBeInTheDocument()
    })

    it('replaces the previous selection when a new place is chosen', async () => {
      renderFinder()
      await selectPlace('treadwell', /^Treadwell Ditch Blueberry Hill/)
      await waitFor(() => {
        expect(screen.getByText(/Large parking area/)).toBeInTheDocument()
      })

      await selectPlace('amalga', /^Amalga/)

      await waitFor(() => {
        expect(screen.queryByText(/Large parking area/)).not.toBeInTheDocument()
      })
      expect(screen.getByText(/Just past the bridge over Eagle River/)).toBeInTheDocument()
    })
  })

  describe('Recents and favourites', () => {
    it('surfaces a previous selection under Recent', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)
      await waitFor(() => expect(screen.getByTestId('browser-link')).toBeInTheDocument())

      openPicker()

      expect(await screen.findByText('Recent')).toBeInTheDocument()
    })

    it('persists recents to localStorage', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)

      await waitFor(() => {
        expect(window.localStorage.getItem('jp:recents:trailheads')).toContain('Amalga')
      })
    })

    it('persists favourites to localStorage', async () => {
      renderFinder()
      openPicker()

      fireEvent.click(await screen.findByRole('button', { name: 'Favorite Amalga' }))

      await waitFor(() => {
        expect(window.localStorage.getItem('jp:favorites:trailheads')).toContain('Amalga')
      })
      expect(screen.getByRole('button', { name: 'Unfavorite Amalga' })).toBeInTheDocument()
    })
  })

  describe('Travel Mode Selection', () => {
    it('highlights selected travel mode button', () => {
      renderFinder()

      const walkingButton = screen.getByLabelText('Walking')
      const drivingButton = screen.getByLabelText('Driving')

      // Assert on radio state rather than a class name: that is what the
      // control actually communicates, and it survives restyling.
      expect(drivingButton).toHaveAttribute('aria-checked', 'true')
      expect(walkingButton).toHaveAttribute('aria-checked', 'false')

      fireEvent.click(walkingButton)
      expect(walkingButton).toHaveAttribute('aria-checked', 'true')
      expect(drivingButton).toHaveAttribute('aria-checked', 'false')
    })
  })

  describe('URL Generation', () => {
    const AMALGA_QUERY = '58.528461, -134.806618'

    it('defaults to driving', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)

      await waitFor(() => {
        expect(screen.getByTestId('browser-link')).toHaveAttribute(
          'href',
          `https://maps.google.com/driving/${AMALGA_QUERY}`
        )
      })
    })

    it('rebuilds the URL for walking', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)
      await waitFor(() => expect(screen.getByTestId('browser-link')).toBeInTheDocument())

      fireEvent.click(screen.getByLabelText('Walking'))

      await waitFor(() => {
        expect(screen.getByTestId('browser-link')).toHaveAttribute(
          'href',
          `https://maps.google.com/walking/${AMALGA_QUERY}`
        )
      })
    })

    it('rebuilds the URL for transit', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)
      await waitFor(() => expect(screen.getByTestId('browser-link')).toBeInTheDocument())

      fireEvent.click(screen.getByLabelText('Public Transit'))

      await waitFor(() => {
        expect(screen.getByTestId('browser-link')).toHaveAttribute(
          'href',
          `https://maps.google.com/transit/${AMALGA_QUERY}`
        )
      })
    })
  })

  describe('QR Code Functionality', () => {
    it('shows QR code toggle button when URL is available', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)

      await waitFor(() => {
        expect(screen.getByText('QR Code')).toBeInTheDocument()
      })
    })

    it('toggles QR code visibility', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)
      await waitFor(() => expect(screen.getByText('QR Code')).toBeInTheDocument())

      const qrButton = screen.getByText('QR Code')
      fireEvent.click(qrButton)
      await waitFor(() => {
        expect(screen.getByTestId('qr-code-display')).toBeInTheDocument()
      })

      fireEvent.click(qrButton)
      await waitFor(() => {
        expect(screen.queryByTestId('qr-code-display')).not.toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('calls onBack when back button is clicked', () => {
      const { onBack } = renderFinder()

      fireEvent.click(screen.getByLabelText('Back to Landmarks'))

      expect(onBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('Data Display', () => {
    it('shows mile marker when available', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)

      await waitFor(() => {
        expect(screen.getByText(/Mile Marker:/)).toBeInTheDocument()
      })
      expect(screen.getByText('27.2')).toBeInTheDocument()
    })

    it('shows notes when available', async () => {
      renderFinder()
      await selectPlace('amalga', /^Amalga/)

      await waitFor(() => {
        expect(screen.getByText(/Just past the bridge over Eagle River/)).toBeInTheDocument()
      })
    })

    it('does not show mile marker when not available', async () => {
      renderFinder()
      await selectPlace('east glacier', /^East Glacier/)

      await waitFor(() => {
        expect(screen.getByText(/Starts behind Mendenhall/)).toBeInTheDocument()
      })
      expect(screen.queryByText(/Mile Marker:/)).not.toBeInTheDocument()
    })
  })
})
