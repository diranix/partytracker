import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['frontend', 'localhost'],
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['frontend', 'localhost', 'partytracker.fun'],
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})
