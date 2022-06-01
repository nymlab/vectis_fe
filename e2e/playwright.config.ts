import type { PlaywrightTestConfig } from "@playwright/test";
import { devices, test as baseTest, chromium, expect as baseExpect } from "@playwright/test";
import { KEPLER_EXTENSION, PLAYWRIGHT_PATH } from "./utils/constants";
import { extractExtensionPackage } from "./utils/extensions";
import DashboardPage from "./pages/dashboard";
import KeplrPage from "./pages/keplr";
import fs from "fs";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
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

export const expect = baseExpect;

export const test = baseTest.extend({
  context: async ({}, use) => {
    await extractExtensionPackage(KEPLER_EXTENSION.id);

    // need to rm CACHE_PATH or else will store extension state
    if (fs.existsSync(PLAYWRIGHT_PATH)) {
      fs.rmdirSync(PLAYWRIGHT_PATH, { recursive: true });
    }

    const context = await chromium.launchPersistentContext(PLAYWRIGHT_PATH, {
      devtools: false,
      headless: false,
      args: [`--disable-extensions-except=${KEPLER_EXTENSION.path}`, `--load-extension=${KEPLER_EXTENSION.path}`],
      viewport: {
        width: 1920,
        height: 1080,
      },
    });

    const [page] = await context.pages();

    const keplrPage = new KeplrPage({ context });
    const dashboardPage = new DashboardPage({ context });

    await keplrPage.importAccount();
    await dashboardPage.navigate();
    await dashboardPage.clickConnectWallet();
    await keplrPage.addChainAndConnect();

    console.debug("keplr loaded");

    await page.close();
    await use(context);
    await context.close();
  },
});

export default config;
