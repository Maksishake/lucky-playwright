import { defineConfig, devices } from '@playwright/test';
import { Routes } from '@config/routes';
import { TestConfig } from '@config/test-config';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: TestConfig.testSettings.parallel,
  forbidOnly: TestConfig.testSettings.forbidOnly,
  retries: TestConfig.testSettings.retries,
  workers: TestConfig.testSettings.workers,
  
  reporter: [
    ['html', TestConfig.reporting.html],
    ['json', TestConfig.reporting.json],
    ['line']
  ],
  
  use: {
    baseURL: process.env.BASE_URL,
    trace: TestConfig.reporting.trace,
    screenshot: TestConfig.reporting.screenshots as 'on' | 'off' | 'only-on-failure',
    video: TestConfig.reporting.video as 'on' | 'off' | 'retain-on-failure' | 'on-first-retry',
    ignoreHTTPSErrors: true,
    storageState: undefined,
  },

  projects: [
    {
      name: 'default',
      testMatch: '**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.e2e
      },
    },
    {
      name: 'business-commands',
      testMatch: '**/examples/business-commands-example.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.e2e
      },
    },
    {
      name: 'smoke',
      testMatch: '**/smoke*/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.smoke
      },
    },
    {
      name: 'smoke-and-regression',
      testMatch: '**/smoke-and-regression/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.e2e
      },
    },
    {
      name: 'auth',
      testMatch: '**/auth/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.e2e
      },
    },
    {
      name: 'deposit',
      testMatch: '**/deposit/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.e2e
      },
    },
    {
      name: 'wallet',
      testMatch: '**/wallet/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.e2e
      },
    },
    {
      name: 'security',
      testMatch: '**/negative/security/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.security
      },
    },
    {
      name: 'error-handling',
      testMatch: '**/negative/error-handling/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.security
      },
    },
    {
      name: 'edge-cases',
      testMatch: '**/negative/edge-cases/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.security
      },
    },
    {
      name: 'workflows',
      testMatch: '**/workflows/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        ...TestConfig.testTypes.e2e
      },
    },
    {
      name: 'firefox',
      testMatch: '**/{auth,deposit,wallet,smoke,workflows}/**/*.spec.ts',
      use: { 
        ...devices['Desktop Firefox'],
        ...TestConfig.browsers.firefox
      },
    },
  ],

  outputDir: 'test-results/',
});
