import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy all API requests to your backend
      '/api': {
        target: 'https://localhost:4443', // Your backend server URL
        changeOrigin: true,
        secure: false, // Only needed if you're using HTTPS with invalid certificates
      },
      '/auth': {
        target: 'https://localhost:4443',
        changeOrigin: true,
        secure: false,
      },
      '/saml': {
        target: 'https://localhost:4443',
        changeOrigin: true,
        secure: false,
      },
      '/upload': {
        target: 'https://localhost:4443',
        changeOrigin: true,
        secure: false,
      },
      '/reports': {
        target: 'https://localhost:4443',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          charts: ['recharts']
        }
      }
    }
  }
})