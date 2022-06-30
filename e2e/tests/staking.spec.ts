import { test, expect } from "@playwright/test";
import { closeContext, startContext } from "e2e/setup";
import DashboardPage from "e2e/pages/dashboard";
import StakingPage from "e2e/pages/staking";
import WalletsPage from "e2e/pages/wallets";

test.describe("staking View", () => {
  test.beforeAll(async () => {
    await startContext();
    const walletsPage = new WalletsPage({ context });
    await walletsPage.navigate();
    await walletsPage.createWallet();
  });
  test.afterAll(closeContext);

  test("staking view should have at least one validator in the table", async () => {
    const stakingPage = new StakingPage({ context });
    await stakingPage.navigate();
    await stakingPage.wait(1500);
    const tbodyLocator = await stakingPage.getValidatorTableTbody();
    const count = await tbodyLocator.count();
    await expect(count).toBeGreaterThanOrEqual(1);
  });

  test("staking view should have three cards", async () => {
    const stakingPage = new StakingPage({ context });
    await stakingPage.navigate();
    const cards = await stakingPage.getValidatorCards();
    await expect(await cards.count()).toBe(3);
  });

  test("manage button should open a modal", async () => {
    const stakingPage = new StakingPage({ context });
    await stakingPage.navigate();
    await stakingPage.clickOnManageButton();
    expect(await page.locator(".modal")).toBeTruthy();
  });

  test("validator modal should show delegate button", async () => {
    const stakingPage = new StakingPage({ context });
    await stakingPage.navigate();
    await stakingPage.clickOnManageButton();
    const delegateButton = await stakingPage.page!.locator("button", { hasText: new RegExp(/^delegate/) });
    await expect(delegateButton).toBeVisible();
  });

  test("click on delegate should allow user to delegate", async () => {
    const stakingPage = new StakingPage({ context });
    await stakingPage.clickOnDelegate();
    await stakingPage.page!.fill('input[name="delegate"]', "1");
    await stakingPage.page!.locator("button", { hasText: "delegate" }).click();
    await stakingPage.page!.waitForResponse((res) => res.request().postDataJSON().params.path === "/cosmos.bank.v1beta1.Query/Balance");
    ("delegate-modal");
  });

  test("after delegate user could see redelegate and undelegate buttons", async () => {
    const stakingPage = new StakingPage({ context });
    await stakingPage.delegate(1);
    await stakingPage.navigate();
    await stakingPage.clickOnManageButton();
    const delegationButtons = await stakingPage.page!.locator("button", { hasText: "delegate" }).count();
    await expect(delegationButtons).toBe(3);
  });

  test("after delegate user should allow to undelagate", async () => {
    const stakingPage = new StakingPage({ context });
    await stakingPage.delegate(2);
    await stakingPage.clickOnUnDelegate();
    const balanceNode = await stakingPage.getLocatorByTestId("undelegation-modal-balance");
    const balanceBefore = parseInt(await balanceNode.innerText(), 10);
    await stakingPage.page!.fill('input[name="undelegate"]', String(balanceBefore / 2));
    await stakingPage.page!.locator("button", { hasText: "undelegate" }).click();
    await stakingPage.page!.waitForResponse(
      (res) => res.request().postDataJSON().params.path === "/cosmos.staking.v1beta1.Query/DelegatorDelegations"
    );
    const balanceAfter = parseInt(await balanceNode.innerText(), 10);

    expect(balanceBefore).toBeGreaterThan(balanceAfter);
  });
});
