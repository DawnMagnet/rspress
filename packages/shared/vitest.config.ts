import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    root: __dirname,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
});
