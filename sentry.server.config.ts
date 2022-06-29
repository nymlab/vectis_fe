import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const PKJ_VERSION = process.env.npm_package_version;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: "local",
  release: `vectis-dapp@${PKJ_VERSION}`,
});
