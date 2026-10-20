
import type {
  IProduct,
  IProductResponse,
  IProductSingleResponse,
} from "@/types/admin/product.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

type GetPublishedProductsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
};

function getBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  return API_BASE_URL.replace(/\/+$/, "");
}

export async function getPublishedProducts({
  page = 1,
  limit = 10,
  search = "",
  categoryId = "",
  minPrice,
  maxPrice,
}: GetPublishedProductsOptions = {}): Promise<IProductResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    categoryId,
    minPrice: minPrice == null ? "" : String(minPrice),
    maxPrice: maxPrice == null ? "" : String(maxPrice),
  });

  const response = await fetch(
    `${getBaseUrl()}/product/published?${params.toString()}`,
    {
      next: {
        revalidate: 60,
        tags: ["published-products"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch published products: ${response.status} ${response.statusText}`,
    );
  }

  const result: IProductResponse = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch published products.",
    );
  }

  return result;
}

export async function getPublishedProductBySlug(
  slug: string,
): Promise<IProduct> {
  const response = await fetch(
    `${getBaseUrl()}/product/slug/${encodeURIComponent(slug)}`,
    {
      next: {
        revalidate: 60,
        tags: [
          "published-products",
          `published-product-${slug}`,
        ],
      },
    },
  );

  if (response.status === 404) {
    throw new Error("Product not found.");
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product: ${response.status} ${response.statusText}`,
    );
  }

  const result: IProductSingleResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(
      result.message || "Failed to fetch product.",
    );
  }

  return result.data;
}
