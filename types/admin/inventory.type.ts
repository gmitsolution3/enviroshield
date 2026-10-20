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

export type InventoryMovementType = "increase" | "decrease";

export interface InventoryMovementPerformer {
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface InventoryMovement {
  _id: string;
  productId: string;
  movementType: InventoryMovementType;
  quantity: number;
  previousStock: number;
  resultingStock: number;
  reason: string;
  performedBy: InventoryMovementPerformer | null;
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

export interface InventoryAdjustedProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  status: string;
}

export type InventoryAdjustmentMovement = Omit<
  InventoryMovement,
  "performedBy"
> & {
  performedBy: string;
};

export interface InventoryAdjustmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    product: InventoryAdjustedProduct;
    movement: InventoryAdjustmentMovement;
  };
}
