// Sentry edge-runtime initialization (middleware, edge routes).
// Loaded lazily from `instrumentation.ts` -> register().
//
// INERT when no DSN is set: without SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN,
// Sentry.init is never called, so this is a no-op that cannot throw.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

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
