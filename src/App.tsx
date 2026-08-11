import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { Landmarks } from './components/Landmarks'
import { TrailheadFinder } from './components/TrailheadFinder'
import { PagerProgress } from './components/PagerProgress'
import { AppProvider, useNavigation } from './context/AppContext'
import type { ViewName } from './context/AppContext'
import { Analytics } from '@vercel/analytics/react'

const VIEWS: ViewName[] = ['landmarks', 'trailheads']

/**
 * Both views live side by side in a scroll-snap pager.
 *
 * Native scroll supplies momentum, rubber-banding at the edges, and
 * mid-gesture reversal, and keeping both views mounted means switching never
 * pays a remount.
 *
 * Positioning is done by index x width rather than by reading offsetLeft. On
 * iOS the grid tracks can still measure 0 during the first layout pass, and a
 * 0 target silently agrees with a 0 scroll position — which used to leave the
 * app showing one page while believing it was on the other.
 */
const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useNavigation()
  const pagerRef = useRef<HTMLDivElement>(null)
  const currentIndex = Math.max(0, VIEWS.indexOf(currentView))

  /** Returns false when layout is not ready yet, so callers can retry. */
  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior) => {
    const pager = pagerRef.current
    if (!pager) return false
    const width = pager.clientWidth
    if (width === 0) return false
    pager.scrollTo({ left: index * width, behavior })
    return true
  }, [])

  // Land on the opening view without animating in from the side, retrying
  // until the grid has actually been laid out.
  useLayoutEffect(() => {
    if (scrollToIndex(currentIndex, 'auto')) return

    let frame = 0
    let attempts = 0
    const retry = () => {
      if (scrollToIndex(currentIndex, 'auto') || attempts++ > 10) return
      frame = requestAnimationFrame(retry)
    }
    frame = requestAnimationFrame(retry)
    return () => cancelAnimationFrame(frame)
    // Mount only; later changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tapping the nav control scrolls the pager.
  useEffect(() => {
    const pager = pagerRef.current
    if (!pager) return
    const width = pager.clientWidth
    if (width === 0) return
    // Tolerate sub-pixel drift, but never treat "not laid out" as "arrived".
    if (Math.abs(pager.scrollLeft - currentIndex * width) < 4) return
    scrollToIndex(currentIndex, 'smooth')
  }, [currentIndex, scrollToIndex])

  // Keep the page alignment after a rotation or window resize.
  useEffect(() => {
    const onResize = () => scrollToIndex(currentIndex, 'auto')
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [currentIndex, scrollToIndex])

  // Swiping updates which view is considered current. Advisory only: it drives
  // the progress rail and the QR wake lock, and nothing breaks if it lags.
  useEffect(() => {
    const pager = pagerRef.current
    if (!pager) return

    let frame = 0
    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const width = pager.clientWidth
        if (width === 0) return
        const next = VIEWS[Math.round(pager.scrollLeft / width)]
        if (next && next !== currentView) setCurrentView(next)
      })
    }

    pager.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      pager.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [currentView, setCurrentView])

  return (
    <>
      <div ref={pagerRef} className="pager" data-testid="pager">
        {/*
          Neither page is marked inert. It reads like the right thing for the
          offscreen view, but it is derived from state that can drift from the
          real scroll position, and when it drifts the page you are looking at
          becomes untappable *and* swallows the touch that would scroll you off
          it — an unrecoverable state. Both pages staying live is a far smaller
          cost than that.
        */}
        <section className="pager-page" aria-label="Landmarks">
          <Landmarks />
        </section>
        <section className="pager-page" aria-label="Trailheads">
          <TrailheadFinder />
        </section>
      </div>

      <PagerProgress views={VIEWS} current={currentView} />
    </>
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
