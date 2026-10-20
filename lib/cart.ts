export type CartItem = {
  productId: string;
  slug: string;
  sku?: string;
  name: string;
  price: number;
  image: string;
  imageAlt: string;
  quantity: number;
  /** Cached stock is only used to keep the cart controls within known limits. */
  stockQuantity?: number;
};

const KEY = "enviroshield-cart";
export const CART_EVENT = "cart:updated";
const EMPTY_CART: CartItem[] = [];
let cartSnapshot: CartItem[] = EMPTY_CART;
let cartInitialized = false;
const cartListeners = new Set<() => void>();

function notifyCartListeners() {
  cartListeners.forEach((listener) => listener());
}

export function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener(CART_EVENT, notifyCartListeners);
    window.addEventListener("storage", onStorage);
  }
  return () => {
    cartListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener(CART_EVENT, notifyCartListeners);
      window.removeEventListener("storage", onStorage);
    }
  };
}

function onStorage(event: StorageEvent) {
  if (event.key !== KEY) return;
  cartSnapshot = readCart();
  notifyCartListeners();
}

export function getCartSnapshot() {
  return cartSnapshot;
}

export function getCartServerSnapshot() {
  return EMPTY_CART;
}

export function isCartInitialized() {
  return cartInitialized;
}

export function initializeCartStore() {
  if (typeof window === "undefined" || cartInitialized) return;
  cartSnapshot = readCart();
  cartInitialized = true;
  notifyCartListeners();
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.image === "string" &&
    Number.isInteger(item.quantity) &&
    (item.quantity as number) >= 1
  );
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    const validItems = parsed.filter(isCartItem).map((item) => ({
      ...item,
      sku: typeof item.sku === "string" ? item.sku : "",
      imageAlt: typeof item.imageAlt === "string" ? item.imageAlt : item.name,
      quantity: Math.min(99, item.quantity),
    }));

    return validItems;
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  cartSnapshot = items;
  cartInitialized = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage can be disabled or full. Keep the in-memory UI responsive.
  }
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
}

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity: number,
  max = Infinity,
): number {
  if (!Number.isFinite(quantity) || quantity < 1) return 0;
  const items = readCart();
  const existing = items.find((candidate) => candidate.productId === item.productId);
  const limit = Math.max(1, Math.min(99, max));
  const next = Math.min((existing?.quantity ?? 0) + Math.floor(quantity), limit);

  if (existing) {
    Object.assign(existing, item, { quantity: next });
  } else {
    items.push({ ...item, quantity: next });
  }

  writeCart(items);
  return next;
}

export function updateCartQuantity(productId: string, quantity: number) {
  const items = readCart()
    .map((item) => {
      if (item.productId !== productId) return item;
      const stockLimit = Number.isFinite(item.stockQuantity)
        ? Math.max(1, item.stockQuantity ?? 1)
        : 99;
      return {
        ...item,
        quantity: Math.max(1, Math.min(99, stockLimit, Math.floor(quantity) || 1)),
      };
    });
  writeCart(items);
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((item) => item.productId !== productId));
}

export function clearCart() {
  writeCart([]);
}

export function cartCount(items = readCart()): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
