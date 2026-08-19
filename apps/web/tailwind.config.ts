import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          900: '#0a0a0f', 800: '#111118', 700: '#1a1a28', 600: '#252538',
          accent: '#6c47ff', glow: '#a78bfa', danger: '#ff4757',
          success: '#2ed573', gold: '#ffd32a',
        }
      },
      fontFamily: {
        mono:    ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      }
    }
  },
  plugins: []
} satisfies Config
