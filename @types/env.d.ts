import { BrowserContext, Page } from "playwright";

declare global {
  interface NextPageWithLayout extends React.FC {
    layout: string;
  }
  namespace NodeJS {
    interface Global {
      context: BrowserContext;
      page: Page;
    }
    interface ProcessEnv {
      readonly NEXT_ENV: string;
      readonly NEXT_PUBLIC_NETWORK: string;
      readonly NEXT_PUBLIC_SENTRY_DSN: string;
      readonly NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS: string;
    }
  }
  var context: BrowserContext;
  var page: Page;
}
