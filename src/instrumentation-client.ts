// Sentry client (browser) initialization. Next.js loads this file
// automatically on the client. INERT when NEXT_PUBLIC_SENTRY_DSN is unset:
// Sentry.init is skipped, so it is a no-op that cannot throw or break hydration.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    // Points at the self-hosted GlitchTip project DSN (Sentry-API compatible).
    dsn,
    enabled: Boolean(dsn),
    // Conservative default; tune per environment.
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    debug: false,
  });
}

// Instruments App Router client-side navigations (only relevant when tracing
// is enabled). Safe no-op when Sentry was not initialized.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
