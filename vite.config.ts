// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/site_calendario_shubudo/', // <-- necessário para GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://3.17.71.237:3000',
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
