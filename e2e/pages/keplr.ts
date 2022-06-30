import { KEPLER_EXTENSION, USER_WALLET } from "../utils/constants";
import CustomPage from "./custom";

class KeplrPage extends CustomPage {
  static baseUrl = `chrome-extension://${KEPLER_EXTENSION.id}/popup.html#`;

  static async subscribe(): Promise<void> {
    context.on("page", KeplrPage.approveHandler);
  }

  static async approveHandler(p): Promise<void> {
    if (p.url().includes(KeplrPage.baseUrl)) {
      await p.waitForLoadState("domcontentloaded");
      await p.click('button:has-text("Approve")');
      if (p.url().includes("/access")) context.off("page", KeplrPage.approveHandler);
    }
  }

  static async importAccount(): Promise<void> {
    const p = await context.newPage();
    await p.goto(KeplrPage.baseUrl + "/register");
    await p.click("text=Import existing account");
    await p.fill('textarea[name="words"]', USER_WALLET.mnemonic);
    await p.fill('input[name="name"]', USER_WALLET.name);
    await p.fill('input[name="password"]', USER_WALLET.password);
    await p.fill('input[name="confirmPassword"]', USER_WALLET.password);
    await p.click("text=Next");
    await p.click("text=Done");
  }
}

export default KeplrPage;
