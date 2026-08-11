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
 * The previous implementation resolved a swipe only on touchend, so nothing
 * moved under your finger and there was no way to abort a swipe you started by
 * accident. Native scroll gives momentum, rubber-banding at the edges, and
 * mid-gesture reversal for free — and no gesture code to maintain.
 *
 * Keeping both mounted also means switching views no longer discards your
 * selection or pays a remount.
 */
const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useNavigation()
  const pagerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<Partial<Record<ViewName, HTMLElement | null>>>({})

  const setPageRef = useCallback(
    (view: ViewName) => (element: HTMLElement | null) => {
      pageRefs.current[view] = element
    },
    []
  )

  // Land on the default view without animating in from the side.
  useLayoutEffect(() => {
    const pager = pagerRef.current
    const page = pageRefs.current[currentView]
    if (pager && page) pager.scrollLeft = page.offsetLeft
    // Mount only — later changes are handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tapping the nav control scrolls the pager.
  useEffect(() => {
    const pager = pagerRef.current
    const page = pageRefs.current[currentView]
    if (!pager || !page) return
    if (Math.abs(pager.scrollLeft - page.offsetLeft) < 4) return
    pager.scrollTo({ left: page.offsetLeft, behavior: 'smooth' })
  }, [currentView])

  // Swiping updates which view is considered current.
  useEffect(() => {
    const pager = pagerRef.current
    if (!pager) return

    let frame = 0
    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (pager.clientWidth === 0) return
        const next = VIEWS[Math.round(pager.scrollLeft / pager.clientWidth)]
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
        <section
          ref={setPageRef('landmarks')}
          className="pager-page"
          aria-label="Landmarks"
          inert={currentView !== 'landmarks'}
        >
          <Landmarks />
        </section>
        <section
          ref={setPageRef('trailheads')}
          className="pager-page"
          aria-label="Trailheads"
          inert={currentView !== 'trailheads'}
        >
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
