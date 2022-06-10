import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 60 * 1000, // Sometimes take longer to load the context
  expect: {
    timeout: 5000,
  },
  workers: 1,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    launchOptions: {
      slowMo: 100, // For debug purpose
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};

export default config;
