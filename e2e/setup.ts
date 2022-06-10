import fs from "fs";
import { chromium } from "@playwright/test";
import { KEPLER_EXTENSION, PLAYWRIGHT_PATH } from "./utils/constants";
import { extractExtensionPackage } from "./utils/extensions";
import KeplrPage from "./pages/keplr";
import DashboardPage from "./pages/dashboard";

export const startContext = async () => {
  await extractExtensionPackage(KEPLER_EXTENSION.id);

  // need to rm CACHE_PATH or else will store extension state
  if (fs.existsSync(PLAYWRIGHT_PATH)) {
    fs.rmSync(PLAYWRIGHT_PATH, { recursive: true });
  }

  const browser = await chromium.launchPersistentContext(PLAYWRIGHT_PATH, {
    devtools: false,
    headless: false,
    args: [`--disable-extensions-except=${KEPLER_EXTENSION.path}`, `--load-extension=${KEPLER_EXTENSION.path}`],
    viewport: {
      width: 1920,
      height: 1080,
    },
  });

  const [page] = await browser.pages();

  global.context = browser;
  global.page = page;

  const keplrPage = new KeplrPage({ context });
  const dashboardPage = new DashboardPage({ context });

  await keplrPage.importAccount();
  await dashboardPage.navigate();
  await dashboardPage.clickConnectWallet();
  await keplrPage.addChainAndConnect();
  await dashboardPage.wait(500);
};

export const closeContext = async () => {
  await context.close();
};
