import * as Sentry from "@sentry/nextjs";
import { BrowserTracing } from "@sentry/nextjs/esm/index.client";
import pkj from "./package.json";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENV = process.env.NEXT_PUBLIC_VERCEL_ENV || "local";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [new BrowserTracing({ tracingOrigins: ["*"] })],
  environment: ENV,
  release: `vectis-dapp@${pkj.version}`,
});
