import { KEPLER_EXTENSION, USER_WALLET } from "e2e/utils/constants";
import { CustomPageArgs } from "e2e/types/CustomPageArgs";
import CustomPage from "./custom";

class KeplrPage extends CustomPage {
  constructor({ context }: CustomPageArgs) {
    super({ context });
    this.baseUrl = `chrome-extension://${KEPLER_EXTENSION.id}/popup.html#`;
  }

  async clickApprove(): Promise<void> {
    await this.page!.click('button:has-text("Approve")');
  }

  async addChain(): Promise<void> {
    await this.navigate("/suggest-chain?interaction=true&interactionInternal=false");
    await this.clickApprove();
  }

  async connectAccount(): Promise<void> {
    await this.navigate("/access?interaction=true&interactionInternal=false");
    await this.clickApprove();
  }

  async addChainAndConnect(): Promise<void> {
    await this.context.waitForEvent("page");
    await this.addChain();
    await this.context.waitForEvent("page");
    await this.connectAccount();
  }

  async importAccount(): Promise<void> {
    const page = await this.context.newPage();
    await page.goto(this.baseUrl + "/register");
    await page.click("text=Import existing account");
    await page.fill('textarea[name="words"]', USER_WALLET.mnemonic);
    await page.fill('input[name="name"]', USER_WALLET.name);
    await page.fill('input[name="password"]', USER_WALLET.password);
    await page.fill('input[name="confirmPassword"]', USER_WALLET.password);
    await page.click("text=Next");
    await page.click("text=Done");
    await page.close();
  }
}

export default KeplrPage;
