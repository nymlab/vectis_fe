import { Locator } from "@playwright/test";
import { CustomPageArgs } from "e2e/types/CustomPageArgs";
import CustomPage from "./custom";

class ValidatorsPage extends CustomPage {
  constructor({ context }: CustomPageArgs) {
    super({ context });
    this.baseUrl = `http://localhost:3000/validators`;
  }

  async getValidatorCards(): Promise<Locator> {
    return await this.page!.locator("#validator-cards > *");
  }

  async getValidatorTable(): Promise<Locator> {
    return await this.page!.locator("#validator-list");
  }

  async getValidatorTableTbody(): Promise<Locator> {
    return await this.page!.locator("#validator-list > tbody > *");
  }
}

export default ValidatorsPage;
