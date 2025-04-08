<?xml version="1.0" encoding="UTF-8"?><code language="javascript">
// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Enable React support with Fast Refresh
  server: {
    // Configure proxy for API requests during development
    // This forwards requests from the frontend dev server (e.g., localhost:5173)
    // to the backend server (e.g., localhost:3001) to avoid CORS issues.
    proxy: {
      '/api': { // Match requests starting with /api
        target: 'http://localhost:3001', // The backend server address (from .env PORT)
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false, // Allow proxying to insecure backend (http) during development
        // No rewrite needed if backend routes also start with /api
      },
    },
    // Optional: Specify the port for the Vite dev server, if needed
    // port: 5173, // Default is often 5173
  },
  build: {
    // Specify the output directory for the production build
    outDir: 'dist',
  },
});
</code>