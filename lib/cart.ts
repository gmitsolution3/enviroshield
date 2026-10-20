/**
 * Minimal client-side cart stored in localStorage.
 * Swap these functions for your real cart / API when you have one —
 * AddToCart only depends on `addToCart`.
 */

export type CartItem = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const KEY = "enviroshield-cart";
export const CART_EVENT = "cart:updated";

export function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode, quota) — ignore */
  }
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
}

/** Adds `quantity` of a product, capped at `max` (e.g. stock). Returns the quantity now in the cart. */
export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity: number,
  max = Infinity,
): number {
  const items = readCart();
  const existing = items.find((i) => i.productId === item.productId);
  const next = Math.min((existing?.quantity ?? 0) + quantity, max);

  if (existing) existing.quantity = next;
  else items.push({ ...item, quantity: next });

  writeCart(items);
  return next;
}

export function cartCount(): number {
  return readCart().reduce((sum, i) => sum + i.quantity, 0);
}