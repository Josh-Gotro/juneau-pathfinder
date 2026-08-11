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
        name: 'Juneau Pathfinder',
        short_name: 'Pathfinder',
        start_url: '/',
        display: 'standalone',
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
