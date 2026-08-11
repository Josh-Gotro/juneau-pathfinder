import React from 'react'

/*
 * The fifteen glyphs this app uses, hand-written rather than pulled from an
 * icon package. They inherit currentColor, size from a `size-*` class, and
 * keep a consistent 1.75 stroke weight at the 48px targets the controls use.
 *
 * All are stroke-based on a 24x24 grid.
 */

type IconProps = React.SVGProps<SVGSVGElement>

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className="size-[1em]"
    {...props}
  >
    {children}
  </svg>
)

export const WalkingIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="13" cy="4" r="1.6" />
    <path d="M12.5 21l1.2-6.2-2.7-2.4.9-4.6" />
    <path d="M8.2 12.2l1.7-3.6 2-1 2.6 1.2 2.1 2.2 2.4.8" />
    <path d="M11.9 14.8L9.2 17l-1.6 4" />
  </Icon>
)

export const BusIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="4" y="3" width="16" height="14" rx="2.5" />
    <path d="M4 10h16" />
    <path d="M7.5 13.6h.01M16.5 13.6h.01" />
    <path d="M7.5 17v2.2M16.5 17v2.2" />
  </Icon>
)

export const CarIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3.5 12.5l1.6-4.7A2 2 0 017 6.4h10a2 2 0 011.9 1.4l1.6 4.7" />
    <path d="M3.5 12.5h17V17a1 1 0 01-1 1h-1.6a1 1 0 01-1-1v-.8H7.1v.8a1 1 0 01-1 1H4.5a1 1 0 01-1-1z" />
    <path d="M6.8 15h.01M17.2 15h.01" />
  </Icon>
)

export const MapIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M9 4L3.6 6.2v13.2L9 17.2l6 2.2 5.4-2.2V4L15 6.2z" />
    <path d="M9 4v13.2M15 6.2v13.2" />
  </Icon>
)

export const SuitcaseIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="7.5" width="18" height="12" rx="2.2" />
    <path d="M8.8 7.5V5.6a1.6 1.6 0 011.6-1.6h3.2a1.6 1.6 0 011.6 1.6v1.9" />
    <path d="M3 12.6h18" />
  </Icon>
)

export const ChevronLeftIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M14.5 5.5L8 12l6.5 6.5" />
  </Icon>
)

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M9.5 5.5L16 12l-6.5 6.5" />
  </Icon>
)

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5.5 9l6.5 6.5L18.5 9" />
  </Icon>
)

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5.5 15L12 8.5l6.5 6.5" />
  </Icon>
)

export const QrIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
    <path d="M13.5 13.5h3v3h-3zM20.5 20.5h-3v-3" />
  </Icon>
)

export const SearchIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.5 15.5L20 20" />
  </Icon>
)

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({ filled, ...props }) => (
  <Icon fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M12 3.8l2.6 5.3 5.8 0.85-4.2 4.1 1 5.8-5.2-2.75-5.2 2.75 1-5.8-4.2-4.1 5.8-0.85z" />
  </Icon>
)

export const LocationArrowIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M20.5 3.5L3.5 10.4l7.3 2.8 2.8 7.3z" />
  </Icon>
)

export const DirectionsIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 2.6l9.4 9.4-9.4 9.4L2.6 12z" />
    <path d="M9.6 13.9v-2.1a1.6 1.6 0 011.6-1.6h3.6" />
    <path d="M12.9 8.2l2 2-2 2" />
  </Icon>
)

export const ShareIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="17.5" cy="5.6" r="2.6" />
    <circle cx="6.5" cy="12" r="2.6" />
    <circle cx="17.5" cy="18.4" r="2.6" />
    <path d="M8.8 10.7l6.4-3.7M8.8 13.3l6.4 3.7" />
  </Icon>
)
