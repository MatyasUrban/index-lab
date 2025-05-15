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

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  globalSetup: require.resolve('./tests/globalSetup.ts'),
  globalTeardown: require.resolve('./tests/globalTeardown.ts'),

  reporter: [
    ['list'],                          // console output
    ['html', { open: 'never' }],      // generate <root>/playwright-report/index.html
  ],
});
