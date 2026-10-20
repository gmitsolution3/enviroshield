import type { InventoryPagination } from "./inventory.type";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  primaryImage: {
    url: string;
    publicId: string;
    alt: string;
  };
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  deliveryAddress: {
    addressLine: string;
    area: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  deliveryZone: "dhaka" | "outside_dhaka";
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  currency: "BDT";
  paymentMethod: "cod";
  paymentStatus: OrderPaymentStatus;
  status: OrderStatus;
  customerNote?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: InventoryPagination;
  data: AdminOrder[];
}
