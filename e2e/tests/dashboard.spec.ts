import DashboardPage from "e2e/pages/dashboard";
import { test, expect } from "@playwright/test";
import { closeContext, startContext } from "e2e/setup";

test.describe("dashboard", () => {
  test.beforeAll(startContext);
  test.afterAll(closeContext);
  test("should appear wallet address in nav button", async () => {
    const elem = await DashboardPage.getLocatorByTestId("wallet-connect");
    await expect(elem).toHaveText("wallet-user");
  });
});
