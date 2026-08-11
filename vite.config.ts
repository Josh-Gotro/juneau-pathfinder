import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['xtratuf_192.png', 'xtratuf_512.png'],
      manifest: {
        // A stable id keeps this the same installed app across start_url changes.
        id: '/',
        name: 'Juneau Pathfinder',
        short_name: 'Pathfinder',
        description:
          'Directions to Juneau trailheads and landmarks, with QR codes for sharing.',
        start_url: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        categories: ['navigation', 'travel'],
        // Long-press the home screen icon to land directly on a view — one
        // tap saved every time, which is the whole point of the app.
        shortcuts: [
          {
            name: 'Trailheads',
            short_name: 'Trailheads',
            url: '/?view=trailheads',
            icons: [{ src: '/xtratuf_192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Landmarks',
            short_name: 'Landmarks',
            url: '/?view=landmarks',
            icons: [{ src: '/xtratuf_192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        // Both match the app ground — a mismatched background_color
        // shows as a coloured flash on launch.
        background_color: '#030712',
        theme_color: '#030712',
        icons: [
          {
            src: '/xtratuf_192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/xtratuf_512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
