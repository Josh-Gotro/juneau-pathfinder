import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

/**
 * jsdom has no layout: scrollTo is absent and every offsetLeft is 0. Stubbing
 * them lets the pager's bookkeeping run without pretending jsdom can tell us
 * anything real about scroll positions.
 */
const stubPagerLayout = (pageWidth = 400) => {
  const pager = screen.getByTestId('pager')

  Object.defineProperty(pager, 'clientWidth', { value: pageWidth, configurable: true })
  Object.defineProperty(pager, 'scrollLeft', {
    value: 0,
    configurable: true,
    writable: true,
  })
  pager.scrollTo = jest.fn() as unknown as typeof pager.scrollTo

  const pages = Array.from(pager.children) as HTMLElement[]
  pages.forEach((page, index) => {
    Object.defineProperty(page, 'offsetLeft', { value: index * pageWidth, configurable: true })
  })

  return { pager, pages }
}

describe('App', () => {
  it('renders both views at once', () => {
    render(<App />)

    expect(screen.getByTestId('landmarks')).toBeInTheDocument()
    expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
  })

  it('opens on the trailheads view', () => {
    render(<App />)
    const { pages } = stubPagerLayout()

    // Landmarks is page 0, Trailheads page 1. Only the current page is active.
    expect(pages[0]).toHaveAttribute('inert')
    expect(pages[1]).not.toHaveAttribute('inert')
  })

  it('activates landmarks once the pager is scrolled to it', async () => {
    render(<App />)
    const { pager, pages } = stubPagerLayout()

    pager.scrollLeft = 0
    fireEvent.scroll(pager)

    await waitFor(() => {
      expect(pages[0]).not.toHaveAttribute('inert')
    })
    expect(pages[1]).toHaveAttribute('inert')
  })

  it('keeps both views mounted across a view change', async () => {
    // This is what lets a selection survive switching views.
    render(<App />)
    const { pager } = stubPagerLayout()

    pager.scrollLeft = 0
    fireEvent.scroll(pager)

    await waitFor(() => {
      expect(screen.getByTestId('landmarks')).toBeInTheDocument()
    })
    expect(screen.getByTestId('trailhead-finder')).toBeInTheDocument()
  })

  it('gives each page an accessible name', () => {
    render(<App />)

    expect(screen.getByRole('region', { name: 'Landmarks' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Trailheads' })).toBeInTheDocument()
  })
})
