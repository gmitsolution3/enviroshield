import type { IServiceResponse, IService } from "@/types/service.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

type GetPublishedServicesOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getPublishedServices({
  page = 1,
  limit = 10,
  search = "",
}: GetPublishedServicesOptions = {}): Promise<IServiceResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${baseUrl}/service/published?${params.toString()}`,
    {
      next: {
        revalidate: 60,
        tags: ["published-services"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch published services: ${response.status} ${response.statusText}`,
    );
  }

  const result: IServiceResponse = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch published services.",
    );
  }

  return result;
}

export async function getFeaturedServices(limit: number = 8): Promise<IService[]> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/service/featured?limit=${limit}`, {
    next: {
      revalidate: 60,
      tags: ["featured-services"],
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch featured services: ${response.status} ${response.statusText}`,
    );
  }

  const result: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IService[];
  } = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch featured services.",
    );
  }

  return (result.data ?? []).slice(0, limit);
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<IService> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/service/slug/${encodeURIComponent(slug)}`,
    {
      next: {
        revalidate: 60,
        tags: ["published-services", `published-service-${slug}`],
      },
    },
  );

  if (response.status === 404) {
    throw new Error("Service not found.");
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch service: ${response.status} ${response.statusText}`,
    );
  }

  const result: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IService;
  } = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to fetch service.");
  }

  return result.data;
}