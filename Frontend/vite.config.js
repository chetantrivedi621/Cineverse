import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/tickets': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/shows': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/api/movies': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/api/bookings': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
