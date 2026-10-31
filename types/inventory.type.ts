import type { IProduct } from "./product.type";

export interface InventoryStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalUnitsInStock: number;
}

export interface InventoryStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: InventoryStats;
}

export interface InventoryProductImage {
  url: string;
  publicId: string;
  alt: string;
}

export interface InventoryProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  primaryImage: InventoryProductImage | null;
  stockQuantity: number;
  lowStockThreshold: number;
  status: string;
}

export interface InventoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LowStockResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    products: InventoryProduct[];
    pagination: InventoryPagination;
  };
}

export type InventoryMovementType = "initial" | "increase" | "decrease";

export interface InventoryMovementPerformer {
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface InventoryMovement {
  _id: string;
  productId:
    | string
    | {
        _id: string;
        name: string;
        sku: string;
        primaryImage?: {
          url?: string;
          alt?: string;
          publicId?: string;
        };
      };
  movementType: InventoryMovementType;
  quantity: number;
  previousStock: number;
  resultingStock: number;
  reason: string;
  performedBy: string | InventoryMovementPerformer | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovementsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    movements: InventoryMovement[];
    pagination: InventoryPagination;
  };
}

export interface StockAdjustmentPayload {
  movementType: "increase" | "decrease";
  quantity: number;
  reason: string;
}

export interface StockAdjustmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    product: IProduct;
    movement: InventoryMovement;
  };
}

export type InventoryAdjustmentResponse = StockAdjustmentResponse;
