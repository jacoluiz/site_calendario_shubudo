// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // SEMPRE na raiz
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.calendariokarate.click',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`Proxying request: ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(`Received proxy response: ${proxyRes.statusCode} for ${req.url}`);
          });
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
