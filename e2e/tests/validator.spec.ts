import { test, expect } from "@playwright/test";
import { closeContext, startContext } from "e2e/setup";
import DashboardPage from "e2e/pages/dashboard";
import ValidatorsPage from "e2e/pages/validators";
import WalletsPage from "e2e/pages/wallets";
import KeplrPage from "e2e/pages/keplr";

test.describe("Validator View", () => {
  test.beforeAll(async () => {
    await startContext();
    const walletsPage = new WalletsPage({ context });
    const keplrPage = new KeplrPage({ context });
    await walletsPage.navigate();
    await walletsPage.createWallet();
    await keplrPage.waitForEventAndClickApprove();
  });
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
    await validatorPage.wait(1500);
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

  test("manage button should open a modal with a wallet selector", async () => {
    const validatorPage = new ValidatorsPage({ context });
    await validatorPage.navigate();
    await validatorPage.clickOnManageButton();
    const textButton = "Choose a wallet";
    const dropdownButton = await page.locator("button", { hasText: textButton });
    expect(await dropdownButton.innerText()).toBe(textButton.toUpperCase());
  });

  test("validator modal should show delegate button after select a wallet", async () => {
    const validatorPage = new ValidatorsPage({ context });
    await validatorPage.navigate();
    await validatorPage.clickOnManageButton();

    const walletSelector = await validatorPage.getLocatorByTestId("wallet-selector");
    await walletSelector.click();
    await walletSelector.locator("li").first().click();
    const delegateButton = await validatorPage.page!.locator("label", { hasText: new RegExp(/^delegate/) });
    await expect(delegateButton).toBeVisible();
  });

  test("click on delegate should allow user to delegate, after delegate balance should be updated", async () => {
    const validatorPage = new ValidatorsPage({ context });
    const keplrPage = new KeplrPage({ context });
    await validatorPage.clickOnDelegate();
    const balanceBeforeValidation = await validatorPage.getLocatorByTestId("delegate-modal-balance");
    const balanceBefore = parseInt(await balanceBeforeValidation.innerText(), 10);
    await validatorPage.page!.fill('input[name="delegate"]', "1");
    await validatorPage.page!.locator("button", { hasText: "delegate" }).click();
    await keplrPage.waitForEventAndClickApprove();
    await validatorPage.page!.waitForResponse((res) => res.request().postDataJSON().params.path === "/cosmos.bank.v1beta1.Query/Balance");

    const balanceAfterValidation = await validatorPage.getLocatorByTestId("delegate-modal-balance");

    const balanceAfter = parseInt(await balanceAfterValidation.innerText(), 10);

    expect(balanceBefore).toBeGreaterThan(balanceAfter);
  });

  test("after delegate user could see redelegate and undelegate buttons", async () => {
    const validatorPage = new ValidatorsPage({ context });
    await validatorPage.delegate(1);
    await validatorPage.navigate();
    await validatorPage.clickOnManageButton();
    await validatorPage.selectFirstWallet();
    const delegationButtons = await validatorPage.page!.locator("label", { hasText: "delegate" }).count();
    await expect(delegationButtons).toBe(3);
  });

  test("after delegate user should allow to undelagate", async () => {
    const validatorPage = new ValidatorsPage({ context });
    const keplrPage = new KeplrPage({ context });
    await validatorPage.delegate(2);
    await validatorPage.clickOnUnDelegate();
    const balanceNode = await validatorPage.getLocatorByTestId("undelegation-modal-balance");
    const balanceBefore = parseInt(await balanceNode.innerText(), 10);
    await validatorPage.page!.fill('input[name="undelegate"]', String(balanceBefore / 2));
    await validatorPage.page!.locator("button", { hasText: "undelegate" }).click();
    await keplrPage.waitForEventAndClickApprove();
    await validatorPage.page!.waitForResponse((res) => res.request().postDataJSON().params.path === "/cosmos.staking.v1beta1.Query/Delegation");
    const balanceAfter = parseInt(await balanceNode.innerText(), 10);

    expect(balanceBefore).toBeGreaterThan(balanceAfter);
  });

  test.only("after delegate you will see a claim button in the validator modal", async () => {
    const validatorPage = new ValidatorsPage({ context });

    await validatorPage.delegate(2);

    await validatorPage.navigate();
    await validatorPage.clickOnManageButton();
    await validatorPage.selectFirstWallet();

    const claimButton = await validatorPage.getLocatorByTestId("validator-modal-claim");

    expect(await claimButton.count()).toBe(1);
  });
});
