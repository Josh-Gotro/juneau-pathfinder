# Juneau Pathfinder

Juneau Pathfinder is a lightweight PWA for quickly generating Google Maps directions and QR codes to popular Juneau, Alaska landmarks and hiking trailheads. It runs offline after first load, supports mobile gestures, and is optimized for showing a QR code you can scan from another device.

## Features

- **Two views**: `Landmarks` and `Trailheads`, switchable via swipe (mobile) or arrow buttons (desktop).
- **Travel modes**: Walking, Transit, or Driving.
- **Smart map links**: Accepts street addresses, plus codes, or `lat,lng` coordinates and builds the correct Google Maps URL.
- **QR codes**: Instant QR for the selected destination; toggleable in Trailheads.
- **PWA**: Installable app shell with offline caching and custom icons.
- **Analytics**: Basic usage analytics via Vercel Analytics.

## How it works

- `Landmarks` and `Trailheads` read from simple TypeScript arrays in `src/data/`.
- When you select an item and a travel mode, a Google Maps URL is generated via `src/utils/buildMapUrl.ts`.
- The URL is exposed as a clickable link (`Open directions in browser`) and as a QR code (`qrcode.react`).
- View state, selections, and settings are managed in a shared React Context (`src/context/AppContext.tsx`).
- In `src/App.tsx`, swipe gestures navigate between the two main views (50px threshold). Desktop buttons mirror this behavior.

## Getting started

1. Install dependencies

   - `pnpm i` or `npm i` or `yarn` (project uses Vite + React + TypeScript)

2. Run the dev server

   - `pnpm dev` or `npm run dev`

3. Build for production

   - `pnpm build` or `npm run build`

4. Preview the production build

   - `pnpm preview` or `npm run preview`

Minimum setup requires a modern Node runtime. See `package.json` for scripts and dependencies.

## Project structure (high level)

- `src/App.tsx`: App shell and swipe navigation
- `src/context/AppContext.tsx`: All shared state for views, selections, URLs, and UI toggles
- `src/components/Landmarks.tsx`: Landmark selector, travel mode, QR + link
- `src/components/TrailheadFinder.tsx`: Trailhead selector, details (mile marker, notes), optional QR toggle
- `src/components/QRCodeDisplay.tsx`: Renders QRCodeSVG
- `src/components/BrowserLink.tsx`: External link with consistent styling
- `src/utils/buildMapUrl.ts`: Builds Google Maps URLs for walking, driving, and public transit from address/plus code/coordinates
- `src/data/destinations.ts`: Landmark list and queries
- `src/data/trailheads.ts`: Trailhead list with optional metadata
- `vite.config.ts`: Vite config with `@vitejs/plugin-react` and `vite-plugin-pwa`
- `public/manifest.webmanifest` and icons: PWA metadata and icons

## Data model

```ts
// src/data/destinations.ts
export interface Destination { name: string; query: string }

// src/data/trailheads.ts
export interface Trailhead {
  name: string
  query: string            // accepts address, plus code, or "lat,lng"
  milemarker?: string|null
  notes?: string|null
  source?: string|null     // optional reference URL
  googleMapsUrl?: string|null
}
```

## Adding items

- **Add a landmark**: append to `src/data/destinations.ts`.
- **Add a trailhead**: append to `src/data/trailheads.ts` (include `query` as precise `lat,lng` when possible; add `milemarker`, `notes`, and `source` if known).

## URL generation details

`src/utils/buildMapUrl.ts` normalizes different query types:

- **Coordinates (`lat,lng`)**: Uses Google Maps dir URLs targeting exact coordinates and appropriate travel mode.
- **Plus codes**: Uses Google Maps place URLs.
- **Addresses**: Uses the Maps Directions API-style URL with `destination` and `travelmode`.

## PWA

The app is configured as a PWA using `vite-plugin-pwa`:

- Manifest and icons are defined in `vite.config.ts` and `public/`.
- Install from the browser (Add to Home Screen) after first visit.
- Works offline for the core UI once cached.

## Accessibility and gestures

- Buttons have `aria-label`s and clear focus styles.
- Swipe left/right to switch views on touch devices; use arrow buttons on large screens.

## Notes / known

- The Vite entry HTML is `index.html` at the project root. The file at `src/index.html` is a leftover example and is not used by Vite during build or dev; it can be removed if not needed.
- Tailwind CSS is used for styling (`src/index.css`).

## Linting

- Run `npm run lint` to check the codebase (ESLint + TypeScript rules).

## Dependencies

- React 19, TypeScript, Vite
- Tailwind CSS for styling
- `qrcode.react` for QR generation
- `@vercel/analytics` for basic analytics

## License

No license file is included. Add one if you intend to distribute.
