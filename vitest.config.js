import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000,
    coverage: {
      reporter: ['text', 'html'],
      enabled: true,
      exclude: [
        'src/exfilms.js',
        'src/utils/yargsConfig.js',
        'src/utils/inquirerPrompts.js',
        'src/typedef/index.mjs',
      ],
    },
  },
});
