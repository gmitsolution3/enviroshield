"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  type CartItem,
  getCartServerSnapshot,
  getCartSnapshot,
  initializeCartStore,
  isCartInitialized,
  removeFromCart,
  subscribeToCart,
  updateCartQuantity,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  refresh: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeToCart,
    isCartInitialized,
    () => false,
  );
  const refresh = useCallback(() => initializeCartStore(), []);

  // Initializes browser storage after hydration. The store notifies subscribers when ready.
  useEffect(() => initializeCartStore(), []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    hydrated,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    setQuantity: updateCartQuantity,
    removeItem: removeFromCart,
    refresh,
  }), [items, hydrated, refresh]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}
