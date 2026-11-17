import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:5001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/users': { target: backendTarget, changeOrigin: true },
      '/products': { target: backendTarget, changeOrigin: true },
      '/orders': { target: backendTarget, changeOrigin: true },
      '/stats': { target: backendTarget, changeOrigin: true },
      '/health': { target: backendTarget, changeOrigin: true },
      '/config': { target: backendTarget, changeOrigin: true },
      '/reset': { target: backendTarget, changeOrigin: true },
      '/api': { target: backendTarget, changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
  },
});
