import { Locator } from "@playwright/test";

export class CustomPage {
  static baseUrl = "http://localhost:3000";

  static async navigate(url = ""): Promise<void> {
    const matchingUrl = this.baseUrl + url;
    const p = await CustomPage.getPage();
    await p.goto(matchingUrl);
  }

  static async getPage() {
    const pages = await context.pages();
    return pages.find((p) => !p.url().includes("chrome-extension://")) || (await context.newPage());
  }

  static async getLocatorByTestId(testId: string): Promise<Locator> {
    const p = await CustomPage.getPage();
    return await p.locator(`[data-testid="${testId}"]`);
  }

  static async wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default CustomPage;
