import type {
  IBlog,
  IBlogResponse,
  IBlogSingleResponse,
} from "@/types/admin/blog.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

type GetPublishedBlogsOptions = {
  page?: number;
  limit?: number;
};

export async function getPublishedBlogs({
  page = 1,
  limit = 10,
}: GetPublishedBlogsOptions = {}): Promise<IBlogResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/blog/published?page=${page}&limit=${limit}`,
    {
      next: {
        revalidate: 60,
        tags: ["published-blogs"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch published blogs: ${response.status} ${response.statusText}`,
    );
  }

  const result: IBlogResponse = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch published blogs.",
    );
  }

  return result;
}

export async function getPublishedBlogBySlug(
  slug: string,
): Promise<IBlog> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/blog/slug/${encodeURIComponent(slug)}`,
    {
      next: {
        revalidate: 60,
        tags: [
          "published-blogs",
          `published-blog-${slug}`,
        ],
      },
    },
  );

  if (response.status === 404) {
    throw new Error("Blog article not found.");
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch blog article: ${response.status} ${response.statusText}`,
    );
  }

  const result: IBlogSingleResponse =
    await response.json();

  if (!result.success || !result.data) {
    throw new Error(
      result.message || "Failed to fetch blog article.",
    );
  }

  return result.data;
}