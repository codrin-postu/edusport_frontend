// Sentry server-runtime initialization (Node.js).
// Loaded lazily from `instrumentation.ts` -> register().
//
// This is INERT when no DSN is set: if neither SENTRY_DSN nor
// NEXT_PUBLIC_SENTRY_DSN is present, Sentry.init is never called, so nothing
// is captured and nothing throws. Server env vars are read at runtime, which
// keeps the same build image promotable across environments.
import * as Sentry from "@sentry/nextjs";
import { scrubBreadcrumb, scrubEvent, scrubSpan } from "@/lib/portal/sentry-scrub";

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
    // Invite secrets and credentials never leave the process unmasked.
    beforeSend: (event) => scrubEvent(event),
    beforeSendTransaction: (event) => scrubEvent(event),
    beforeSendSpan: (span) => scrubSpan(span),
    beforeBreadcrumb: (crumb) => scrubBreadcrumb(crumb),
  });
}
