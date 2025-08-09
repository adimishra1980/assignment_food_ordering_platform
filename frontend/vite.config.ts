import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow connections from any network interface
    hmr: {
      clientPort: 443, // Standard port for HTTPS
    },
    allowedHosts: [
      '.onrender.com' // Allow any subdomain of onrender.com
    ],
  },
})