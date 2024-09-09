import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: __dirname,
    environment: 'node',
    exclude: ['./e2e/**/*', '**/node_modules/**/*'],
  },
});
