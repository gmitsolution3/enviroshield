import { axiosInstance } from "@/lib/axios";

export type DeliveryZone = "dhaka" | "outside_dhaka";

export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  customer: { name: string; phone: string };
  deliveryAddress: {
    addressLine: string;
    area: string;
    city: string;
    district: string;
    postalCode?: string;
  };
  deliveryZone: DeliveryZone;
  customerNote?: string;
}

export interface CreatedOrderConfirmation {
  _id: string;
  orderNumber: string;
  items: {
    productId: string;
    name: string;
    slug: string;
    sku?: string;
    primaryImage?: { url?: string; alt?: string };
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  deliveryZone: DeliveryZone;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt?: string;
  deliveryAddress?: {
    addressLine: string;
    area: string;
    city: string;
    district: string;
    postalCode?: string;
  };
}

type CreateOrderResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: CreatedOrderConfirmation | null;
};

export async function createOrder(payload: CreateOrderRequest) {
  const response = await axiosInstance.post<CreateOrderResponse>("/order", payload);
  const result = response.data;
  if (!result.success || !result.data?._id || !result.data.orderNumber) {
    throw new Error(result.message || "The order response was incomplete.");
  }
  return result.data;
}

export async function getMyOrderById(orderId: string) {
  const response = await axiosInstance.get<{
    success: boolean;
    statusCode: number;
    message: string;
    data: CreatedOrderConfirmation | null;
  }>(`/order/mine/${encodeURIComponent(orderId)}`);
  const result = response.data;
  if (!result.success || !result.data?._id || !result.data.orderNumber) {
    throw new Error(result.message || "The order could not be retrieved.");
  }
  return result.data;
}
