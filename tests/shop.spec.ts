import { test as base, expect } from "@playwright/test";
import { ShopPage } from "./pages/shop.page";
const test = base.extend<{ shop: ShopPage }>({
  shop: [
    async ({ page }, use) => {
      const shop = new ShopPage(page);
      await shop.goto();
      await use(shop);
    },
    { auto: true },
  ],
});

test("TC-001 catalog shows six products @smoke", async ({ page }) => {
  await expect(page.locator(".product")).toHaveCount(6);
});
test("TC-002 category filters Tech @smoke", async ({ page }) => {
  await page.getByRole("button", { name: "Tech", exact: true }).click();
  await expect(page.locator(".product")).toHaveCount(2);
  await expect(page.getByTestId("product-keyboard")).toBeVisible();
  await expect(page.getByTestId("product-headphones")).toBeVisible();
});
test("TC-003 exact-name search", async ({ page }) => {
  await page.getByRole("searchbox", { name: "Search products" }).fill("Arc");
  await expect(page.locator(".product")).toHaveCount(1);
  await expect(page.getByTestId("product-lamp")).toBeVisible();
});
test("TC-004 unknown search has empty state", async ({ page }) => {
  await page
    .getByRole("searchbox", { name: "Search products" })
    .fill("unicorn");
  await expect(
    page.getByRole("heading", { name: "No essentials found" }),
  ).toBeVisible();
  await expect(page.locator(".product")).toHaveCount(0);
});
test("TC-005 add item and calculate total @smoke", async ({ shop, page }) => {
  await shop.add("Arc desk lamp");
  await shop.openBag();
  await expect(page.getByTestId("subtotal")).toHaveText("฿1,200");
  await expect(page.getByTestId("total")).toHaveText("฿1,300");
});
test("TC-006 empty bag", async ({ shop, page }) => {
  await shop.openBag();
  await expect(
    page.getByRole("heading", { name: "Your bag is a blank canvas." }),
  ).toBeVisible();
});
test("TC-007 remove final item", async ({ shop, page }) => {
  await shop.add("Arc desk lamp");
  await shop.openBag();
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your bag is a blank canvas." }),
  ).toBeVisible();
});
test("TC-008 cart survives reload", async ({ shop, page }) => {
  await shop.add("Arc desk lamp");
  await page.reload();
  await shop.openBag();
  await expect(page.getByTestId("quantity-lamp")).toHaveText("1");
});
test("TC-009 sold-out item is disabled", async ({ shop }) => {
  await expect(shop.product("plant").getByRole("button")).toBeDisabled();
});
test("TC-010 valid coupon discounts subtotal", async ({ shop, page }) => {
  await shop.add("Arc desk lamp");
  await shop.openBag();
  await shop.coupon("DESK10");
  await expect(page.getByTestId("discount")).toHaveText("−฿120");
  await expect(page.getByTestId("total")).toHaveText("฿1,180");
});
test("TC-011 invalid coupon rejected", async ({ shop, page }) => {
  await shop.add("Arc desk lamp");
  await shop.openBag();
  await shop.coupon("INVALID");
  await expect(
    page.getByText("Invalid promo code", { exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("discount")).toHaveText("−฿0");
});
test("TC-012 free shipping above threshold", async ({ shop, page }) => {
  await shop.add("Pebble keyboard");
  await shop.openBag();
  await expect(page.getByTestId("shipping")).toHaveText("฿0");
});
test("TC-013 valid checkout clears cart @smoke", async ({ shop, page }) => {
  await shop.add("Arc desk lamp");
  await shop.openBag();
  await shop.checkout();
  await expect(page.getByTestId("order-success")).toBeVisible();
  await page.getByRole("button", { name: "Close bag" }).click();
  await shop.openBag();
  await expect(
    page.getByRole("heading", { name: "Your bag is a blank canvas." }),
  ).toBeVisible();
});
test("TC-014 malformed email rejected", async ({ shop, page }) => {
  await shop.add("Arc desk lamp");
  await shop.openBag();
  await shop.checkout("Alex", "invalid", "99 Test Lane");
  await expect(page.getByRole("alert")).toHaveText(
    "Enter a name, valid email, and delivery address.",
  );
  await expect(page.getByTestId("order-success")).toHaveCount(0);
});
test("TC-015 viewport has no horizontal overflow", async ({ page }) => {
  const sizes = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.viewport);
});
test("TC-016 Escape closes bag", async ({ shop, page }) => {
  await shop.openBag();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("TC-023 product photographs load with accessible descriptions", async ({
  page,
}) => {
  const images = page.locator(".product-art img");
  await expect(images).toHaveCount(6);
  await expect
    .poll(() =>
      images.evaluateAll((nodes) =>
        nodes.every((node) => {
          const image = node as HTMLImageElement;
          return (
            image.complete &&
            image.naturalWidth > 0 &&
            image.alt.trim().length > 0
          );
        }),
      ),
    )
    .toBe(true);
});

test.describe("Requirement checks for seeded defects @bug", () => {
  test.beforeEach(async ({}, info) => {
    const id = info.title.match(/BUG-\d+/)?.[0] || "known defect";
    info.annotations.push({
      type: "defect",
      description: `docs/BUG_REPORTS.md#${id.toLowerCase()}`,
    });
    test.fail(
      process.env.APP_MODE !== "fixed" && process.env.AUDIT !== "1",
      `${id}: intentionally seeded; assertion checks correct behavior`,
    );
  });
  test("TC-017 BUG-001 search ignores letter case", async ({ page }) => {
    await page.getByRole("searchbox", { name: "Search products" }).fill("arc");
    await expect(page.getByTestId("product-lamp")).toBeVisible();
  });
  test("TC-018 BUG-002 price sorting is numeric", async ({ page }) => {
    await page
      .getByRole("combobox", { name: "Sort products" })
      .selectOption("asc");
    const prices = await page
      .locator('.product [data-testid="price"]')
      .allTextContents();
    expect(prices).toEqual([
      "฿400",
      "฿600",
      "฿800",
      "฿1,200",
      "฿2,400",
      "฿3,200",
    ]);
  });
  test("TC-019 BUG-003 quantity cannot exceed stock", async ({
    shop,
    page,
  }) => {
    await shop.add("Arc desk lamp");
    await shop.openBag();
    const plus = page.getByRole("button", {
      name: "Increase Arc desk lamp",
      exact: true,
    });
    await plus.click();
    await plus.click();
    if (await plus.isEnabled()) await plus.click();
    await expect(page.getByTestId("quantity-lamp")).toHaveText("3");
    await expect(plus).toBeDisabled();
  });
  test("TC-020 BUG-004 repeated coupon is idempotent", async ({
    shop,
    page,
  }) => {
    await shop.add("Arc desk lamp");
    await shop.openBag();
    await shop.coupon("DESK10");
    await shop.coupon("DESK10");
    await expect(page.getByTestId("discount")).toHaveText("−฿120");
  });
  test("TC-021 BUG-005 free shipping includes exact threshold", async ({
    shop,
    page,
  }) => {
    await shop.add("Arc desk lamp");
    await shop.add("Everyday catchall");
    await shop.openBag();
    await expect(page.getByTestId("subtotal")).toHaveText("฿2,000");
    await expect(page.getByTestId("shipping")).toHaveText("฿0");
  });
  test("TC-022 BUG-006 whitespace name and address rejected", async ({
    shop,
    page,
  }) => {
    await shop.add("Arc desk lamp");
    await shop.openBag();
    await shop.checkout("   ", "alex@example.com", "   ");
    await expect(page.getByRole("alert")).toHaveText(
      "Enter a name, valid email, and delivery address.",
    );
    await expect(page.getByTestId("order-success")).toHaveCount(0);
  });
});
