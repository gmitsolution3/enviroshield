import type {
  ITestimonial,
  ITestimonialResponse,
} from "@/types/admin/testimonial.type";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

type GetPublishedTestimonialsOptions = {
  page?: number;
  limit?: number;
};

export async function getPublishedTestimonials({
  page = 1,
  limit = 10,
}: GetPublishedTestimonialsOptions = {}): Promise<ITestimonialResponse> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  const response = await fetch(
    `${baseUrl}/testimonial/published?page=${page}&limit=${limit}`,
    {
      next: {
        revalidate: 60,
        tags: ["published-testimonials"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch published testimonials: ${response.status} ${response.statusText}`,
    );
  }

  const result: ITestimonialResponse = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to fetch published testimonials.",
    );
  }

  return result;
}