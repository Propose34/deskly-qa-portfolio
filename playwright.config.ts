import { defineConfig, devices } from "@playwright/test";
const mode = process.env.APP_MODE === "fixed" ? "fixed" : "buggy";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One worker avoids observed Firefox teardown errors on this Windows host.
  // Tests remain independent and may be parallelized by an explicit CLI override.
  retries: 0,
  workers: 1,
  timeout: 20_000,
  expect: { timeout: 2500 },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  metadata: { appMode: mode, audit: process.env.AUDIT === "1" },
  use: {
    baseURL: "http://127.0.0.1:5174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx vite --mode ${mode === "fixed" ? "fixed" : "development"} --host 127.0.0.1 --port 5174 --strictPort`,
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
