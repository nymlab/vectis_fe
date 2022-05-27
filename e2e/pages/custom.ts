import { BrowserContext, Page } from "@playwright/test";
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
    const [matchedPage] = pages.filter((page) => page.url().includes(matchingUrl));
    if (matchedPage) {
      this.page = matchedPage;
      this.page.waitForLoadState();
    } else {
      this.page = pages.length ? pages[0] : await this.context.newPage();
      await this.page.goto(matchingUrl);
    }
  }
}

export default CustomPage;
