import { expect, type Page } from "@playwright/test";
export class ShopPage {
  constructor(readonly page: Page) {}
  async goto() {
    await this.page.goto("/");
    await expect(
      this.page.getByRole("heading", { name: /Make room/ }),
    ).toBeVisible();
  }
  product(id: string) {
    return this.page.getByTestId(`product-${id}`);
  }
  async add(name: string) {
    await this.page
      .getByRole("button", { name: `Add ${name} to bag`, exact: true })
      .click();
  }
  async openBag() {
    await this.page.getByRole("button", { name: "Open bag" }).click();
  }
  async coupon(code: string) {
    await this.page.getByRole("textbox", { name: "Promo code" }).fill(code);
    await this.page.getByRole("button", { name: "Apply", exact: true }).click();
  }
  async checkout(
    name = "Alex Tester",
    email = "alex@example.com",
    address = "99 Test Lane, Bangkok",
  ) {
    await this.page.getByText("Checkout details ↗", { exact: true }).click();
    await this.page
      .getByRole("textbox", { name: "Full name", exact: true })
      .fill(name);
    await this.page.getByRole("textbox", { name: "Email address" }).fill(email);
    await this.page
      .getByRole("textbox", { name: "Delivery address" })
      .fill(address);
    await this.page.getByRole("button", { name: "Place demo order ↗" }).click();
  }
}
