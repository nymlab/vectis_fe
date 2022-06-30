import { CustomPageArgs } from "e2e/types/CustomPageArgs";
import CustomPage from "./custom";

class WalletsPage extends CustomPage {
  constructor({ context }: CustomPageArgs) {
    super({ context });
    this.baseUrl = `http://localhost:3000/wallets`;
  }

  async createWallet(): Promise<void> {
    const locator = await this.getLocatorByTestId("create-wallet");
    await locator.click();
    await this.fillForm();
    await this.page!.locator("button", { hasText: "CREATE" }).click();
    await this.page!.waitForTimeout(5000);
  }

  async fillForm(): Promise<void> {
    await this.page!.fill('input[name="guardian-#1"]', "juno1qwwx8hsrhge9ptg4skrmux35zgna47pwnhz5t4");
    await this.page!.fill('input[name="relayer-#1"]', "juno1ucl9dulgww2trng0dmunj348vxneufu50c822z");
    await this.page!.fill('input[name="wallet-label"]', "e2e-test");
    await this.page!.fill('input[name="wallet-funds"]', "15");
  }
}

export default WalletsPage;
