import DashboardPage from "e2e/pages/dashboard";
import { test, expect } from "e2e/playwright.config";
import { USER_WALLET } from "e2e/utils/constants";

test.describe("dashboard", () => {
  test("should appear wallet address in nav button", async ({ page, context }) => {
    const dashboardPage = new DashboardPage({ context });
    await dashboardPage.navigate();
    await dashboardPage.clickConnectWallet();
    await expect(page.locator("nav button")).toHaveText(USER_WALLET.address);
  });
});
