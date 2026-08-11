import { trailheads } from '../data/trailheads'
import { destinations } from '../data/destinations'
import { parseCoords } from './geo'
import type { Coords } from './geo'
import type { Trailhead, TrailheadEntrance } from '../data/trailheads'
import type { Destination } from '../data/destinations'

export interface TrailheadPlace {
  id: string
  title: string
  /** Set only when the parent trailhead has more than one entrance. */
  subtitle?: string
  query: string
  coords: Coords | null
  milemarker?: string | null
  trailhead: Trailhead
  entrance: TrailheadEntrance
}

export interface LandmarkPlace {
  id: string
  title: string
  query: string
  coords: Coords | null
  destination: Destination
}

/**
 * Every entrance as its own selectable row.
 *
 * The old flow made you pick a trailhead and then, for the handful with more
 * than one entrance, pick again from a second control. Flattening means one
 * tap reaches any destination and search covers both names at once.
 */
export const trailheadPlaces: TrailheadPlace[] = trailheads.flatMap((trailhead) =>
  trailhead.entrances.map((entrance) => ({
    id: `${trailhead.name}::${entrance.name}`,
    title: trailhead.name,
    subtitle: trailhead.entrances.length > 1 ? entrance.name : undefined,
    query: entrance.query,
    coords: parseCoords(entrance.query),
    milemarker: entrance.milemarker,
    trailhead,
    entrance,
  }))
)

export const landmarkPlaces: LandmarkPlace[] = destinations.map((destination) => ({
  id: destination.name,
  title: destination.name,
  query: destination.query,
  coords: parseCoords(destination.query),
  destination,
}))
