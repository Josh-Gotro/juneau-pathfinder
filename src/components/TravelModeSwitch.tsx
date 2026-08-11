import React from 'react'
import { WalkingIcon, BusIcon, CarIcon } from './icons'
import type { TravelMode } from '../context/AppContext'

const MODES = [
  { mode: 'walking', label: 'Walking', Icon: WalkingIcon },
  { mode: 'transit', label: 'Public Transit', Icon: BusIcon },
  { mode: 'driving', label: 'Driving', Icon: CarIcon },
] as const satisfies ReadonlyArray<{ mode: TravelMode; label: string; Icon: React.ComponentType }>

interface Props {
  value: TravelMode
  onChange: (mode: TravelMode) => void
}

/**
 * Travel mode picker. A real radiogroup rather than three unrelated buttons,
 * so the active mode is exposed to assistive tech instead of being conveyed
 * by colour alone.
 */
export const TravelModeSwitch: React.FC<Props> = ({ value, onChange }) => (
  <div role="radiogroup" aria-label="Travel mode" className="grid grid-cols-3 gap-2">
    {MODES.map(({ mode, label, Icon }) => {
      const active = value === mode
      return (
        <button
          key={mode}
          type="button"
          role="radio"
          aria-checked={active}
          aria-label={label}
          onClick={() => onChange(mode)}
          className={`flex min-h-tap items-center justify-center rounded-control border text-xl transition-colors duration-200 ${
            active
              ? 'border-accent bg-accent text-accent-ink'
              : 'border-edge text-ink-muted hover:border-edge-strong hover:text-ink'
          }`}
        >
          <Icon />
        </button>
      )
    })}
  </div>
)
