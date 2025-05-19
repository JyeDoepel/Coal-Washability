import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  resolve: {
    alias: {
      buffer: 'buffer',         // Alias buffer to npm module
      process: 'process/browser', // Polyfill for process
    }
  },
  define: {
    'process.env': {},  // Optional: prevent process.env errors
    'global': 'window'        // Optional: prevent global errors
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  }

})
