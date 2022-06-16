import { BrowserContext, Locator, Page } from "@playwright/test";
import { CustomPageArgs } from "e2e/types/CustomPageArgs";

export class CustomPage {
  context: BrowserContext;
  page?: Page;
  baseUrl: string;
  constructor({ context }: CustomPageArgs) {
    this.context = context;
    this.baseUrl = "";
  }

  async navigate(url = ""): Promise<void> {
    const pages = await this.context.pages();
    const matchingUrl = this.baseUrl + url;
    this.page = pages.length ? pages[0] : await this.context.newPage();
    await this.page.goto(matchingUrl);
  }

  async getLocatorByTestId(testId: string): Promise<Locator> {
    return await this.page!.locator(`[data-testid="${testId}"]`);
  }

  async wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default CustomPage;
