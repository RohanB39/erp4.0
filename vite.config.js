import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Manual code splitting for libraries
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split React and its dependencies
            if (id.includes('react')) {
              return 'react-vendors';
            }
            // Split html2canvas and similar larger libraries
            if (id.includes('html2canvas')) {
              return 'html2canvas';
            }
            // All other third-party libraries
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,  // Set a chunk size warning limit (default is 500kB)
  },
});
