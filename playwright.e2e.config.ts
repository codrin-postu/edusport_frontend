import { defineConfig, devices } from "@playwright/test";

// Browser tests of whole flows against a mock Strapi (tests/e2e/mock-strapi.mjs),
// never the real CMS: the app is built with both Strapi URLs pointing at the mock.
const PORT = 3200;
const MOCK_PORT = 18890;
const MOCK_URL = `http://localhost:${MOCK_PORT}`;

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
      command: `NEXT_DIST_DIR=.next-e2e npm run build && NEXT_DIST_DIR=.next-e2e npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}/api/health`,
      env: { STRAPI_INTERNAL_URL: MOCK_URL, NEXT_PUBLIC_STRAPI_URL: MOCK_URL },
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
});
