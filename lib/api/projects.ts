import type {
  IProject,
  IProjectResponse,
  IProjectSingleResponse,
} from "@/types/project.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

type PaginationOptions = {
  page?: number;
  limit?: number;
};

function getBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }
  return API_BASE_URL.replace(/\/+$/, "");
}

export async function getPublishedProjects({
  page = 1,
  limit = 10,
}: PaginationOptions = {}): Promise<IProjectResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const response = await fetch(`${getBaseUrl()}/project/published?${params}`, {
    next: { revalidate: 60, tags: ["published-projects"] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch published projects: ${response.status}`);
  }

  const result: IProjectResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch published projects.");
  }
  return result;
}

export async function getFeaturedProjects(): Promise<IProject[]> {
  const response = await fetch(`${getBaseUrl()}/project/featured`, {
    next: { revalidate: 60, tags: ["featured-projects"] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch featured projects: ${response.status}`);
  }

  const result: { success: boolean; message: string; data: IProject[] } =
    await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch featured projects.");
  }
  return result.data ?? [];
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<IProject> {
  const response = await fetch(
    `${getBaseUrl()}/project/slug/${encodeURIComponent(slug)}`,
    {
      next: {
        revalidate: 60,
        tags: ["published-projects", `published-project-${slug}`],
      },
    },
  );

  if (response.status === 404) {
    throw new Error("Project not found.");
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.status}`);
  }

  const result: IProjectSingleResponse = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to fetch project.");
  }
  return result.data;
}
