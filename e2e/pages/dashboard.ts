import { CustomPageArgs } from "e2e/types/CustomPageArgs";
import CustomPage from "./custom";

class DashboardPage extends CustomPage {
  constructor({ context }: CustomPageArgs) {
    super({ context });
    this.baseUrl = `http://localhost:3000/`;
  }

  async clickConnectWallet(): Promise<void> {
    await this.page!.click('button:has-text("Connect your wallet")');
  }
}

export default DashboardPage;
