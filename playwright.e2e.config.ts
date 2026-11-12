import { defineConfig, devices } from "@playwright/test";

// Browser tests of whole flows against a mock Strapi (tests/e2e/mock-strapi.mjs),
// never the real CMS: the app is built with both Strapi URLs pointing at the mock.
const PORT = 3200;
const MOCK_PORT = 18890;
const MOCK_URL = `http://localhost:${MOCK_PORT}`;
const PORTAL_PORT = 18891;
const PORTAL_URL = `http://localhost:${PORTAL_PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
    colorScheme: "light",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Started in order: the mock must answer before `next build` prerenders the pages.
  webServer: [
    {
      command: `node tests/e2e/mock-strapi.mjs ${MOCK_PORT}`,
      url: `${MOCK_URL}/api/club/public`,
      reuseExistingServer: false,
    },
    {
      command: `node tests/e2e/mock-portal.mjs ${PORTAL_PORT}`,
      url: `${PORTAL_URL}/__mock/log`,
      reuseExistingServer: false,
    },
    {
      command: `NEXT_DIST_DIR=.next-e2e npm run build && NEXT_DIST_DIR=.next-e2e npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}/api/health`,
      env: {
        STRAPI_INTERNAL_URL: MOCK_URL,
        NEXT_PUBLIC_STRAPI_URL: MOCK_URL,
        PORTAL_BFF_SECRET: "test-bff-secret-000000000000000000",
        PORTAL_STRAPI_URL: PORTAL_URL,
        // The production build accepts antrenor.localhost only through this setting.
        PORTAL_HOST_ANTRENOR: "antrenor.localhost:3200",
        PORTAL_HOST_SPORTIV: "sportiv.localhost:3200",
        NEXT_PUBLIC_UMAMI_WEBSITE_ID: "e2e-umami",
      },
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
});
