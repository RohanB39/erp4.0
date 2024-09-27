import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendors';
            }
            if (id.includes('html2canvas')) {
              return 'html2canvas';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 4000, 
  },
});
