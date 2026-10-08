import { chromium, devices } from "@playwright/test";
const browser = await chromium.launch();
try {
  for (const [name, options] of [
    ["desktop", { viewport: { width: 1440, height: 1050 } }],
    ["mobile", devices["Pixel 7"]],
  ]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
    await page.locator(".product-art img").last().waitFor();
    await page.evaluate(async () => {
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    await page.screenshot({ path: `docs/preview-${name}.png`, fullPage: true });
    if (name === "desktop")
      await page.screenshot({ path: "docs/preview-cover.png" });
    await context.close();
    console.log(`Saved ${name} preview with decoded product images.`);
  }
} finally {
  await browser.close();
}
