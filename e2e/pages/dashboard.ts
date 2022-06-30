import CustomPage from "./custom";

class DashboardPage extends CustomPage {
  static baseUrl = `http://localhost:3000`;

  static async clickConnectWallet(): Promise<void> {
    const locator = await super.getLocatorByTestId("wallet-connect");
    await locator.click();
  }

  static async clickNavIndex(index: string): Promise<void> {
    const sidebar = await page.locator("aside");
    const link = await sidebar.locator(`text=${index}`);
    await link.click();
  }
}

export default DashboardPage;
