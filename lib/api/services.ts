import type { IServiceResponse, IService } from "@/types/admin/service.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

type GetPublishedServicesOptions = {
  page?: number;
  limit?: number;
};

export async function getPublishedServices({
  page = 1,
  limit = 10,
}: GetPublishedServicesOptions = {}): Promise<IServiceResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/service/published?page=${page}&limit=${limit}`,
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

export async function getFeaturedServices(): Promise<IService[]> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(`${baseUrl}/service/featured`, {
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

  return result.data ?? [];
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