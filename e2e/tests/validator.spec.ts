import DashboardPage from "e2e/pages/dashboard";
import ValidatorsPage from "e2e/pages/validators";
import { test, expect } from "@playwright/test";
import { closeContext, startContext } from "e2e/setup";

test.describe("Validator View", () => {
  test.beforeAll(startContext);
  test.afterAll(closeContext);
  test("when click on validator button in sidebar should go to validator page", async () => {
    const dashboardPage = new DashboardPage({ context });
    await dashboardPage.navigate();
    await dashboardPage.clickNavIndex("Validators");
    await expect(dashboardPage.page!).toHaveURL(`${dashboardPage.baseUrl}/validators`);
  });

  test("validator view should have at least one validator in the table", async () => {
    const validatorPage = new ValidatorsPage({ context });
    await validatorPage.navigate();
    const tbodyLocator = await validatorPage.getValidatorTableTbody();
    const count = await tbodyLocator.count();
    await expect(count).toBeGreaterThanOrEqual(1);
  });

  test("validator view should have three cards", async () => {
    const validatorPage = new ValidatorsPage({ context });
    await validatorPage.navigate();
    const cards = await validatorPage.getValidatorCards();
    await expect(await cards.count()).toBe(3);
  });
});
