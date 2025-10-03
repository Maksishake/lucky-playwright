export const TestConfig = {
  testSettings: {
    parallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
  },
  
  reporting: {
    html: { outputFolder: 'playwright-report' },
    json: { outputFile: 'test-results/results.json' },
    trace: 'on-first-retry' as const,
    screenshots: 'only-on-failure' as const,
    video: 'retain-on-failure' as const,
  },
  
  testTypes: {
    e2e: {
      timeout: 30000,
      actionTimeout: 10000,
    },
    smoke: {
      timeout: 15000,
      actionTimeout: 5000,
    },
    security: {
      timeout: 60000,
      actionTimeout: 15000,
    },
  },
  
  browsers: {
    firefox: {
      timeout: 45000,
      actionTimeout: 12000,
    },
  },
};
