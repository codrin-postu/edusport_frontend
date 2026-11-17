// Sentry client (browser) initialization. Next.js loads this file
// automatically on the client. INERT when NEXT_PUBLIC_SENTRY_DSN is unset:
// Sentry.init is skipped, so it is a no-op that cannot throw or break hydration.
import * as Sentry from "@sentry/nextjs";
import { scrubBreadcrumb, scrubEvent, tracesSampler } from "@/lib/portal/sentry-scrub";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    // Points at the self-hosted GlitchTip project DSN (Sentry-API compatible).
    dsn,
    enabled: Boolean(dsn),
    // No personal data by default (no IP, no cookies); no session replay is configured.
    sendDefaultPii: false,
    // 0 on portal paths, the site's 0.1 elsewhere.
    tracesSampler,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || process.env.NEXT_PUBLIC_COMMIT_SHA,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    debug: false,
    // Invite secrets and credentials never leave the process unmasked.
    beforeSend: (event) => scrubEvent(event),
    beforeSendTransaction: (event) => scrubEvent(event),
    beforeBreadcrumb: (crumb) => scrubBreadcrumb(crumb),
  });
}

// Instruments App Router client-side navigations (only relevant when tracing
// is enabled). Safe no-op when Sentry was not initialized.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
