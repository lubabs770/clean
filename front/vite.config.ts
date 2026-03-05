import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// A proxy makes it easy to call the API without worrying about CORS during
// development. In production you would typically build the frontend and serve
// it from the same host as the API, or point VITE_API_BASE_URL at the correct
// server.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward any request starting with /api or /images to the backend on
      // port 3001; the frontend can then use relative paths and avoid
      // cross-origin fetch issues.
      '/api': 'http://localhost:3001',
      '/images': 'http://localhost:3001'
    }
  }
})
