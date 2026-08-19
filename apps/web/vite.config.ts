import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'
import { VitePWA }      from 'vite-plugin-pwa'
import path             from 'path'

// [Agent-1: WebGPU Architect] — COOP/COEP headers for SharedArrayBuffer (Rapier WASM threads)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,wasm,woff2}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 31536000 } }
          }
        ]
      },
      manifest: false,
    }),
  ],
  resolve: {
    alias: {
      '@':      path.resolve(__dirname, 'src'),
      '@core':  path.resolve(__dirname, 'src/core'),
      '@feat':  path.resolve(__dirname, 'src/features'),
      '@net':   path.resolve(__dirname, 'src/networking'),
      '@store': path.resolve(__dirname, 'src/store'),
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-three':    ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-firebase': ['firebase'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    }
  },
  server: {
    port: 3000,
    headers: {
      'Cross-Origin-Opener-Policy':   'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  optimizeDeps: { exclude: ['@react-three/rapier'] }
})
