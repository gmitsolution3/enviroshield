import type { CreatedOrderConfirmation } from "@/lib/api/orders";

const KEY = "enviroshield-order-confirmation";
let memoryConfirmation: CreatedOrderConfirmation | null = null;

export function saveOrderConfirmation(order: CreatedOrderConfirmation) {
  if (typeof window === "undefined") return;
  const confirmation: CreatedOrderConfirmation = {
    _id: order._id,
    orderNumber: order.orderNumber,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      primaryImage: item.primaryImage
        ? { url: item.primaryImage.url, alt: item.primaryImage.alt }
        : undefined,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    deliveryZone: order.deliveryZone,
    deliveryFee: order.deliveryFee,
    subtotal: order.subtotal,
    totalAmount: order.totalAmount,
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    createdAt: order.createdAt,
  };
  memoryConfirmation = confirmation;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(confirmation));
  } catch {
    // Navigation still succeeds; direct refresh may require a new order lookup.
  }
}

export function readOrderConfirmation(): CreatedOrderConfirmation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return memoryConfirmation;
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const order = value as Partial<CreatedOrderConfirmation>;
    if (
      typeof order._id !== "string" ||
      typeof order.orderNumber !== "string" ||
      !Array.isArray(order.items) ||
      typeof order.totalAmount !== "number" ||
      typeof order.subtotal !== "number" ||
      typeof order.deliveryFee !== "number"
    ) return null;
    return order as CreatedOrderConfirmation;
  } catch {
    return memoryConfirmation;
  }
}
