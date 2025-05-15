import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 1,
  workers: 1,

  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1920, height: 1080 },
  },

  expect: {
    timeout: 10 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  globalSetup: require.resolve('./tests/globalSetup.ts'),
  globalTeardown: require.resolve('./tests/globalTeardown.ts'),

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
});
