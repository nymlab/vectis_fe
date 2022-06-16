import { KEPLER_EXTENSION, USER_WALLET } from "../utils/constants";
import { CustomPageArgs } from "../types/CustomPageArgs";
import CustomPage from "./custom";

class KeplrPage extends CustomPage {
  constructor({ context }: CustomPageArgs) {
    super({ context });
    this.baseUrl = `chrome-extension://${KEPLER_EXTENSION.id}/popup.html#`;
  }

  async navigate(url = ""): Promise<void> {
    const pages = await this.context.pages();
    const matchingUrl = this.baseUrl + url;
    const [matchedPage] = pages.filter((page) => page.url().includes(matchingUrl));
    if (matchedPage) {
      this.page = matchedPage;
    } else {
      this.page = pages.length ? pages[0] : await this.context.newPage();
      await this.page.goto(matchingUrl, { waitUntil: "networkidle" });
    }
  }

  async clickApprove(): Promise<void> {
    await this.page?.waitForLoadState();
    await this.page!.click('button:has-text("Approve")');
  }

  async waitForEventAndClickApprove(): Promise<void> {
    await this.wait(2500);
    await this.navigate("/sign?interaction=true&interactionInternal=false");
    await this.clickApprove();
  }

  async addChain(): Promise<void> {
    await this.wait(2500);
    // await context.waitForEvent("page", (page) => page.url().includes("/suggest-chain?interaction=true&interactionInternal=false"));
    await this.navigate("/suggest-chain?interaction=true&interactionInternal=false");
    await this.clickApprove();
  }

  async connectAccount(): Promise<void> {
    await this.wait(2500);
    // await context.waitForEvent("page", (page) => page.url().includes("/access?interaction=true&interactionInternal=false"));
    await this.navigate("/access?interaction=true&interactionInternal=false");
    await this.clickApprove();
  }

  async addChainAndConnect(): Promise<void> {
    await this.addChain();
    await this.connectAccount();
  }

  async importAccount(): Promise<void> {
    this.page = await this.context.newPage();
    await this.page.goto(this.baseUrl + "/register");
    await this.page.click("text=Import existing account");
    await this.page.fill('textarea[name="words"]', USER_WALLET.mnemonic);
    await this.page.fill('input[name="name"]', USER_WALLET.name);
    await this.page.fill('input[name="password"]', USER_WALLET.password);
    await this.page.fill('input[name="confirmPassword"]', USER_WALLET.password);
    await this.page.click("text=Next");
    await this.page.click("text=Done");
    await this.page.close();
  }
}

export default KeplrPage;
