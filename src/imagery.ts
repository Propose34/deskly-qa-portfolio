import { products } from "./catalog";

/** AI-generated studio product photography, shipped with the local app. */
export function productImage(id: string): string {
  const product = products.find((item) => item.id === id)!;
  return `<img src="/images/${id}.png" alt="${product.name}" width="1024" height="1024" decoding="async">`;
}
