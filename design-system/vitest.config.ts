import {defineConfig} from 'vitest/config';

export default defineConfig({
  resolve: { conditions: ['browser'] },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    restoreMocks: true,
    coverage: {reporter: ['text', 'html']},
  },
});
