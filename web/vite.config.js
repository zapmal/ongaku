import path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [reactRefresh()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_NODE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
