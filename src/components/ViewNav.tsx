import React from 'react'
import { FaChevronLeft, FaChevronRight, FaMap, FaSuitcase } from 'react-icons/fa'
import type { ViewName } from '../context/AppContext'

const TARGETS = {
  landmarks: { label: 'Landmarks', ariaLabel: 'Back to Landmarks', Icon: FaSuitcase },
  trailheads: { label: 'Trailheads', ariaLabel: 'Go to Trailhead Finder', Icon: FaMap },
} as const

interface Props {
  /** The view this control navigates to. */
  target: ViewName
  onNavigate: () => void
}

/**
 * The only view-switching control in the app. Replaces the four near-identical
 * absolute-positioned blocks that were duplicated across both views and
 * toggled on viewport width; this one sits in the thumb zone at every size and
 * adapts by container width instead.
 */
export const ViewNav: React.FC<Props> = ({ target, onNavigate }) => {
  const { label, ariaLabel, Icon } = TARGETS[target]
  const pointsBack = target === 'landmarks'

  return (
    <button
      type="button"
      onClick={onNavigate}
      aria-label={ariaLabel}
      className="flex min-h-tap w-full items-center justify-center gap-2 rounded-control text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink"
    >
      {pointsBack && <FaChevronLeft aria-hidden="true" className="text-lg" />}
      <Icon aria-hidden="true" className="text-lg" />
      {/* Label is dropped on very narrow containers, where the icon pair is
          already unambiguous and horizontal room is scarce. */}
      <span className="hidden text-sm font-medium @[18rem]:inline">{label}</span>
      {!pointsBack && <FaChevronRight aria-hidden="true" className="text-lg" />}
    </button>
  )
}
