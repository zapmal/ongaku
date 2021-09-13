import path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        // ws: true,
      },
    },
  },
});
