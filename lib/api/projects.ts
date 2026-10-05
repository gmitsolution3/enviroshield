import type {
  IProject,
  IProjectResponse,
} from "@/types/admin/project.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

type GetPublishedProjectsOptions = {
  page?: number;
  limit?: number;
};

export async function getPublishedProjects({
  page = 1,
  limit = 10,
}: GetPublishedProjectsOptions = {}): Promise<IProjectResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/project/published?page=${page}&limit=${limit}`,
    {
      next: {
        revalidate: 60,
        tags: ["published-projects"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch published projects: ${response.status} ${response.statusText}`,
    );
  }

  const result: IProjectResponse = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch published projects.",
    );
  }

  return result;
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<IProject> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/project/slug/${encodeURIComponent(slug)}`,
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
    throw new Error(
      `Failed to fetch project: ${response.status} ${response.statusText}`,
    );
  }

  const result: {
    success: boolean;
    statusCode: number;
    message: string;
    data: IProject;
  } = await response.json();

  if (!result.success || !result.data) {
    throw new Error(
      result.message || "Failed to fetch project.",
    );
  }

  return result.data;
}