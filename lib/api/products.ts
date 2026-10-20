
import type {
  IPublishedProduct,
  IPublishedProductResponse,
} from "@/types/admin/product.type";
import type {
  ICategoryResponse,
} from "@/types/admin/category.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

export type GetPublishedProductsOptions = {
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

  return API_BASE_URL.replace(/\/$/, "");
}

export async function getPublishedProducts({
  page = 1,
  limit = 10,
  search = "",
  categoryId = "",
  minPrice,
  maxPrice,
}: GetPublishedProductsOptions = {}): Promise<IPublishedProductResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) params.set("search", search.trim());
  if (categoryId) params.set("categoryId", categoryId);
  if (minPrice != null) params.set("minPrice", String(minPrice));
  if (maxPrice != null) params.set("maxPrice", String(maxPrice));

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

  const result: IPublishedProductResponse = await response.json();

  if (
    !result.success ||
    !Array.isArray(result.data) ||
    !result.meta ||
    !Number.isInteger(result.meta.page) ||
    !Number.isInteger(result.meta.totalPages)
  ) {
    throw new Error(
      result.message || "The published products response was invalid.",
    );
  }

  return result;
}

export async function getPublishedProductBySlug(
  slug: string,
): Promise<IPublishedProduct> {
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

  const result: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IPublishedProduct;
  } = await response.json();

  if (
    !result.success ||
    !result.data ||
    typeof result.data !== "object" ||
    typeof result.data._id !== "string" ||
    typeof result.data.slug !== "string"
  ) {
    throw new Error(result.message || "Failed to fetch product.");
  }

  return result.data;
}

export async function getCategories({
  page = 1,
  limit = 100,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<ICategoryResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const response = await fetch(
    `${getBaseUrl()}/category?${params.toString()}`,
    {
      next: {
        revalidate: 300,
        tags: ["product-categories"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories: ${response.status} ${response.statusText}`,
    );
  }

  const result: ICategoryResponse = await response.json();

  if (
    !result.success ||
    !Array.isArray(result.data) ||
    !result.meta ||
    !Number.isInteger(result.meta.page) ||
    !Number.isInteger(result.meta.totalPages)
  ) {
    throw new Error(
      result.message || "The categories response was invalid.",
    );
  }

  return result;
}

export async function getAllCategories(): Promise<ICategoryResponse["data"]> {
  const firstPage = await getCategories({ page: 1, limit: 100 });
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, firstPage.meta.totalPages - 1) }, (_, i) =>
      getCategories({ page: i + 2, limit: firstPage.meta.limit || 100 }),
    ),
  );
  return [firstPage, ...remainingPages].flatMap(({ data }) => data);
}
