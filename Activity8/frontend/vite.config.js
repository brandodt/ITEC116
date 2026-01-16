import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.100.36:3000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://192.168.100.36:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
