import { Locator } from "@playwright/test";
import { CustomPageArgs } from "e2e/types/CustomPageArgs";
import CustomPage from "./custom";

class StakingPage extends CustomPage {
  static async navigate(url?: string): Promise<void> {
    await super.navigate(url || "/wallets");
    const stakeButton = await super.getLocatorByTestId("stake-button");
    await stakeButton.first().hover();
    await stakeButton.first().click();
  }

  static async getValidatorCards(): Promise<Locator> {
    return await page.locator("#validator-cards > *");
  }

  static async getValidatorTable(): Promise<Locator> {
    return await page.locator("#validator-list");
  }

  static async getValidatorTableTbody(): Promise<Locator> {
    return await page.locator("#validator-list > tbody > *");
  }

  static async clickOnManageButton(): Promise<void> {
    await page.locator("text=Manage").first().click();
  }

  static async selectFirstWallet(): Promise<void> {
    const walletSelector = await super.getLocatorByTestId("wallet-selector");
    await walletSelector.click();
    await walletSelector.locator("li").first().click({ delay: 1000 });
  }

  static async clickOnDelegate(): Promise<void> {
    await StakingPage.navigate();
    await StakingPage.clickOnManageButton();

    await page.locator("button", { hasText: new RegExp("^delegate") }).click();
  }

  static async clickOnUnDelegate(): Promise<void> {
    await StakingPage.navigate();
    await StakingPage.clickOnManageButton();

    const dropdown = await super.getLocatorByTestId("delegator-group-button-dropdown");
    await dropdown.click();
    await page.locator("button", { hasText: new RegExp("^undelegate") }).click();
  }

  static async delegate(amount: number) {
    await StakingPage.clickOnDelegate();
    await page.fill('input[name="delegate"]', String(amount));
    await page.locator("button", { hasText: "delegate" }).click();
    await page.waitForResponse((res) => res.request().postDataJSON().params.path === "/cosmos.bank.v1beta1.Query/Balance");
  }
}

export default StakingPage;
