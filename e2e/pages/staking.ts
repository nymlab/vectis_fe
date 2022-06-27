import { Locator } from "@playwright/test";
import { CustomPageArgs } from "e2e/types/CustomPageArgs";
import CustomPage from "./custom";
import KeplrPage from "./keplr";

class StakingPage extends CustomPage {
  constructor({ context }: CustomPageArgs) {
    super({ context });
  }

  async navigate(url?: string): Promise<void> {
    await super.navigate("http://localhost:3000/wallets");
    const stakeButton = await this.getLocatorByTestId("stake-button");
    await stakeButton.first().hover();
    await stakeButton.first().click();
  }

  async getValidatorCards(): Promise<Locator> {
    return await this.page!.locator("#validator-cards > *");
  }

  async getValidatorTable(): Promise<Locator> {
    return await this.page!.locator("#validator-list");
  }

  async getValidatorTableTbody(): Promise<Locator> {
    return await this.page!.locator("#validator-list > tbody > *");
  }

  async clickOnManageButton(): Promise<void> {
    await this.page!.locator("text=Manage").first().click();
  }

  async selectFirstWallet(): Promise<void> {
    const walletSelector = await this.getLocatorByTestId("wallet-selector");
    await walletSelector.click();
    await walletSelector.locator("li").first().click({ delay: 1000 });
  }

  async clickOnDelegate(): Promise<void> {
    await this.navigate();
    await this.clickOnManageButton();

    await this.page!.locator("button", { hasText: new RegExp("^delegate") }).click();
  }

  async clickOnUnDelegate(): Promise<void> {
    await this.navigate();
    await this.clickOnManageButton();

    const dropdown = await this.getLocatorByTestId("delegator-group-button-dropdown");
    await dropdown.click();
    await this.page!.locator("button", { hasText: new RegExp("^undelegate") }).click();
  }

  async delegate(amount: number) {
    const keplrPage = new KeplrPage({ context });
    await this.clickOnDelegate();
    await this.page!.fill('input[name="delegate"]', String(amount));
    await this.page!.locator("button", { hasText: "delegate" }).click();
    await this.wait(1500);
    await keplrPage.navigate();
    await keplrPage.clickApprove();
    await this.page!.waitForResponse((res) => res.request().postDataJSON().params.path === "/cosmos.bank.v1beta1.Query/Balance");
  }
}

export default StakingPage;
