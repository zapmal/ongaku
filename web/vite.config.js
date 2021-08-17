import { defineConfig } from 'vite';
import path from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@example': path.resolve(__dirname, './src/example'),
    }
  }
});
