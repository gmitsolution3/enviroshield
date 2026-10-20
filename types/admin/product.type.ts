
import { ICategory } from "./category.type";

export interface IProductImage {
  url: string;
  publicId: string;
  alt: string;
}

export interface IProductSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImagePublicId: string;
  noIndex: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: ICategory;
  shortDescription: string;
  description: Record<string, unknown>;
  primaryImage: IProductImage;
  gallery: IProductImage[];
  price: number;
  costPrice: number;
  weight: number;
  tdsUrl: string;
  tdsPublicId: string;
  stockQuantity: number;
  lowStockThreshold: number;
  status: string;
  isFeatured: boolean;
  publishedAt: string | null;
  seo: IProductSeo;
  createdAt: string;
  updatedAt: string;
}

/** Shape returned for public products, where private cost data is omitted. */
export interface IPublishedProduct
  extends Omit<IProduct, "categoryId" | "costPrice"> {
  categoryId: Pick<ICategory, "_id" | "name" | "slug">;
}

export interface IProductResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IProduct[];
}

export interface IPublishedProductResponse
  extends Omit<IProductResponse, "data"> {
  data: IPublishedProduct[];
}

export interface IProductSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IProduct;
}

