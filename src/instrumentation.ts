// Next.js instrumentation hook. Runs once per server/edge runtime at startup
// and wires Sentry's request-error capture for the App Router.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures errors thrown in Server Components, route handlers, and middleware.
// No-op unless a runtime Sentry client was initialized (i.e. a DSN was set).
export const onRequestError = Sentry.captureRequestError;
