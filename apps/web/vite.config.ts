import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@feat': path.resolve(__dirname, 'src/features'),
      '@net': path.resolve(__dirname, 'src/networking'),
      '@store': path.resolve(__dirname, 'src/store'),
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 3000,
  },
})