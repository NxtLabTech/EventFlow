import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // First run may download a mongod binary for mongodb-memory-server
    hookTimeout: 120000,
    testTimeout: 30000,
  },
});
