import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Juneau Pathfinder',
        short_name: 'Pathfinder',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#10b981',
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
