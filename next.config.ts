import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Optimize static generation and caching
  experimental: {
    // Enable optimized server components
    optimizeServerReact: true,
    // Tree-shake barrel imports for icon/animation libs
    optimizePackageImports: ["lucide-react", "motion/react"],
  },

  // Standalone output ships only the files server.js needs at runtime.
  // Required by Dockerfile.production.
  output: "standalone",

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.strapi.io",
        pathname: "/uploads/**",
      },
      // Production Strapi host — set NEXT_PUBLIC_STRAPI_IMAGE_HOST in env.
      ...(process.env.NEXT_PUBLIC_STRAPI_IMAGE_HOST
        ? [
          {
            protocol: "https" as const,
            hostname: process.env.NEXT_PUBLIC_STRAPI_IMAGE_HOST,
            pathname: "/uploads/**",
          },
        ]
        : []),
    ],
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header

  // Compression
  compress: true,
};

// Wrap with Sentry last so its build-time instrumentation (onRequestError
// wiring, tunnelling, optional source-map upload) sees the final config.
// Source-map upload only runs when SENTRY_AUTH_TOKEN is present, so this stays
// inert for local/self-hosted GlitchTip builds where the token is unset.
export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  // Sentry SaaS org/project — only used for source-map upload; harmless when
  // unset (e.g. self-hosted GlitchTip, which does not require them).
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a wider set of client source maps for readable stack traces.
  widenClientFileUpload: true,

  // Only print plugin output in CI.
  silent: !process.env.CI,
});
