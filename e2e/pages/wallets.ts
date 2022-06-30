import CustomPage from "./custom";

class WalletsPage extends CustomPage {
  static baseUrl = `http://localhost:3000/wallets`;

  static async createWallet(): Promise<void> {
    const locator = await super.getLocatorByTestId("create-wallet");
    await locator.click();
    await WalletsPage.fillForm();
    await page.locator("button", { hasText: "CREATE" }).click();
    await page.waitForResponse((res) => res.request().postDataJSON().method === "tx_search");
  }

  static async fillForm(): Promise<void> {
    await page.fill('input[name="guardian-#1"]', "juno1qwwx8hsrhge9ptg4skrmux35zgna47pwnhz5t4");
    await page.fill('input[name="relayer-#1"]', "juno1ucl9dulgww2trng0dmunj348vxneufu50c822z");
    await page.fill('input[name="wallet-label"]', "e2e-test");
    await page.fill('input[name="wallet-funds"]', "15");
  }
}

export default WalletsPage;
