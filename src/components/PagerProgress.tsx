import React from 'react'
import type { ViewName } from '../context/AppContext'

interface Props {
  views: ViewName[]
  current: ViewName
}

/**
 * A hairline rail under the status bar showing which of the two pages you are
 * on, and how far through a swipe you are.
 *
 * Deliberately not tappable dots: the footer already carries a labelled
 * control naming the other view, and a second interactive cluster down there
 * would fight it for thumb room. This is purely an indicator, which is why it
 * can afford to be 3px tall.
 *
 * Where scroll-linked animation is supported the segment tracks the scroll
 * position continuously, so it moves with your thumb rather than snapping once
 * the gesture ends. Elsewhere it transitions from state.
 */
export const PagerProgress: React.FC<Props> = ({ views, current }) => (
  <div
    className="pager-progress"
    data-testid="pager-progress"
    data-index={Math.max(0, views.indexOf(current))}
    aria-hidden="true"
    style={
      {
        '--pager-count': views.length,
        '--pager-index': Math.max(0, views.indexOf(current)),
      } as React.CSSProperties
    }
  >
    <div className="pager-progress-bar" />
  </div>
)
