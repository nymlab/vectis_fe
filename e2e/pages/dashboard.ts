import { CustomPageArgs } from "e2e/types/CustomPageArgs";
import CustomPage from "./custom";

class DashboardPage extends CustomPage {
  constructor({ context }: CustomPageArgs) {
    super({ context });
    this.baseUrl = `http://localhost:3000`;
  }

  async clickConnectWallet(): Promise<void> {
    const locator = await this.getLocatorByTestId("wallet-connect");
    await locator.click();
    await this.page!.waitForTimeout(5000);
  }

  async clickNavIndex(index: string): Promise<void> {
    const sidebar = await this.page!.locator("aside");
    const link = await sidebar.locator(`text=${index}`);
    await link.click();
  }
}

export default DashboardPage;
