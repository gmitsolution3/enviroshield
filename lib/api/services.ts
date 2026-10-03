import type { IService, IServiceResponse } from "@/types/admin/service.type";

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
}: GetPublishedServicesOptions = {}): Promise<IService[]> {
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
    throw new Error(result.message || "Failed to fetch published services.");
  }

  return result.data;
}
