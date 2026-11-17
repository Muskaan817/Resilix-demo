import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = process.env.VITE_BACKEND_URL || 'http://localhost:5001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/users': backendTarget,
      '/products': backendTarget,
      '/orders': backendTarget,
      '/stats': backendTarget,
      '/health': backendTarget,
      '/config': backendTarget,
      '/reset': backendTarget,
      '/api': backendTarget,
    },
  },
  build: {
    outDir: 'dist',
  },
});
