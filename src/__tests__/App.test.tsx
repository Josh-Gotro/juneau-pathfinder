import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import App from '../App'

/*
 * This suite previously defined its own copy of AppContent and exercised that,
 * so it passed regardless of what App.tsx did. It now renders the real App.
 */

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}))

jest.mock('../components/Landmarks', () => ({
  Landmarks: () => <div data-testid="landmarks">Landmarks Component</div>,
}))

jest.mock('../components/TrailheadFinder', () => ({
  TrailheadFinder: () => <div data-testid="trailhead-finder">TrailheadFinder Component</div>,
}))

const scrollTo = jest.fn()

/** Every element reports this width once layout is "ready". */
const setPagerWidth = (width: number) => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return width
    },
  })
}

/** Let queued animation frames run. */
const flushFrames = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 40))
  })
}

const lastScrollLeft = () => {
  const call = scrollTo.mock.calls.at(-1)
  return call ? call[0].left : undefined
}

describe('App', () => {
  beforeEach(() => {
    scrollTo.mockClear()
    // jsdom has no layout, so scrollTo is absent on elements.
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: scrollTo,
    })
    setPagerWidth(0)
  })

  it('renders both views at once', () => {
    render(<App />)

    expect(screen.getByTestId('landmarks')).toBeInTheDocument()
    expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
  })

  it('opens on the trailheads page', async () => {
    setPagerWidth(400)
    render(<App />)

    // Trailheads is index 1, so one page width across.
    await waitFor(() => expect(lastScrollLeft()).toBe(400))
  })

  it('retries positioning when layout is not ready on the first pass', async () => {
    // The regression: iOS can report a zero-width grid track during the first
    // layout pass. Positioning by offsetLeft produced a 0 target that agreed
    // with a 0 scroll position, so the app showed Landmarks while believing it
    // was on Trailheads — and the correction pass saw no discrepancy to fix.
    setPagerWidth(0)
    render(<App />)

    expect(scrollTo).not.toHaveBeenCalled()

    setPagerWidth(400)
    await flushFrames()

    expect(lastScrollLeft()).toBe(400)
  })

  it('never leaves a page inert, so the visible page always stays interactive', () => {
    setPagerWidth(400)
    render(<App />)

    const pages = Array.from(screen.getByTestId('pager').children)
    pages.forEach((page) => expect(page).not.toHaveAttribute('inert'))
  })

  it('follows the visible page while swiping', async () => {
    setPagerWidth(400)
    render(<App />)

    const pager = screen.getByTestId('pager')
    Object.defineProperty(pager, 'scrollLeft', { configurable: true, value: 0 })
    fireEvent.scroll(pager)

    await waitFor(() => {
      expect(screen.getByTestId('pager-progress')).toHaveAttribute('data-index', '0')
    })
  })

  it('keeps both views mounted across a page change', async () => {
    // This is what lets a selection survive switching views.
    setPagerWidth(400)
    render(<App />)

    const pager = screen.getByTestId('pager')
    Object.defineProperty(pager, 'scrollLeft', { configurable: true, value: 0 })
    fireEvent.scroll(pager)

    await waitFor(() => {
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()
    })
    expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
  })

  it('gives each page an accessible name', () => {
    setPagerWidth(400)
    render(<App />)

    expect(screen.getByRole('region', { name: 'Landmarks' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Trailheads' })).toBeInTheDocument()
  })
})
