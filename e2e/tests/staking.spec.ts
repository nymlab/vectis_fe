import { test, expect } from "@playwright/test";
import { closeContext, startContext } from "e2e/setup";
import StakingPage from "e2e/pages/staking";
import WalletsPage from "e2e/pages/wallets";
import KeplrPage from "e2e/pages/keplr";

test.describe("staking View", () => {
  test.beforeAll(async () => {
    await startContext();
    await KeplrPage.subscribe();
    await WalletsPage.navigate();
    await WalletsPage.createWallet();
  });
  test.afterAll(closeContext);

  test("staking view should have at least one validator in the table", async () => {
    await StakingPage.navigate();
    await StakingPage.wait(1500);
    // await page.waitForResponse((res) => res.request().postDataJSON()?.method === "block"); Invistigate why crash only here.
    const tbodyLocator = await StakingPage.getValidatorTableTbody();
    const count = await tbodyLocator.count();
    await expect(count).toBeGreaterThanOrEqual(1);
  });

  test("staking view should have three cards", async () => {
    await StakingPage.navigate();
    const cards = await StakingPage.getValidatorCards();
    await expect(await cards.count()).toBe(3);
  });

  test("manage button should open a modal", async () => {
    await StakingPage.navigate();
    await StakingPage.clickOnManageButton();
    expect(await page.locator(".modal")).toBeTruthy();
  });

  test("validator modal should show delegate button", async () => {
    await StakingPage.navigate();
    await StakingPage.clickOnManageButton();
    const delegateButton = await page.locator("button", { hasText: new RegExp(/^delegate/) });
    await expect(delegateButton).toBeVisible();
  });

  test("click on delegate should allow user to delegate", async () => {
    await StakingPage.clickOnDelegate();
    await page.fill('input[name="delegate"]', "1");
    await page.locator("button", { hasText: "delegate" }).click();
    await page.waitForResponse((res) => res.request().postDataJSON().params.path === "/cosmos.bank.v1beta1.Query/Balance");
    ("delegate-modal");
  });

  test("after delegate user could see redelegate and undelegate buttons", async () => {
    await StakingPage.delegate(1);
    await StakingPage.navigate();
    await StakingPage.clickOnManageButton();
    const delegationButtons = await page.locator("button", { hasText: "delegate" }).count();
    await expect(delegationButtons).toBe(3);
  });

  test("after delegate user should allow to undelagate", async () => {
    await StakingPage.delegate(2);
    await StakingPage.clickOnUnDelegate();
    const balanceNode = await StakingPage.getLocatorByTestId("undelegation-modal-balance");
    const balanceBefore = parseInt(await balanceNode.innerText(), 10);
    await page.fill('input[name="undelegate"]', String(balanceBefore / 2));
    await page.locator("button", { hasText: "undelegate" }).click();
    await page.waitForResponse((res) => res.request().postDataJSON().params.path === "/cosmos.staking.v1beta1.Query/DelegatorDelegations");
    const balanceAfter = parseInt(await balanceNode.innerText(), 10);

    expect(balanceBefore).toBeGreaterThan(balanceAfter);
  });
});
