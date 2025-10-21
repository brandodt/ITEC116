import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This file must ensure that all API calls are correctly redirected to the NestJS backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend runs here
    proxy: {
      // Redirects all '/api' calls to the backend on port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false, // Use 'false' for local development on HTTPS (if applicable)
      },
    },
  },
});