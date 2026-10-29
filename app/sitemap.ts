import type { MetadataRoute } from "next";

import { getPublishedBlogs } from "@/lib/api/blogs";
import { getPublishedProjects } from "@/lib/api/projects";
import { getPublishedServices } from "@/lib/api/services";
import { getPublishedProducts } from "@/lib/api/products";
import { siteUrl } from "@/lib/site-url";

type PaginatedResult<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
};

/**
 * Fetch every page of a paginated API response.
 */
async function fetchAllPages<T>(
  fetchPage: (
    page: number,
    limit: number,
  ) => Promise<PaginatedResult<T>>,
  pageSize = 100,
): Promise<T[]> {
  const firstPage = await fetchPage(1, pageSize);

  const totalPages = Math.max(1, firstPage.meta.totalPages || 1);
  const limit = firstPage.meta.limit || pageSize;

  if (totalPages === 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchPage(index + 2, limit),
    ),
  );

  return [firstPage, ...remainingPages].flatMap(
    (result) => result.data,
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  /* ------------------------------------------------------------------------ */
  /* SERVICES                                                                 */
  /* ------------------------------------------------------------------------ */

  let serviceRoutes: MetadataRoute.Sitemap = [];

  try {
    const services = await fetchAllPages((page, limit) =>
      getPublishedServices({ page, limit }),
    );

    serviceRoutes = services
      .filter(
        (service) =>
          service.status === "published" &&
          service.seo?.noIndex !== true,
      )
      .map((service) => ({
        url: `${siteUrl}/services/${service.slug}`,
        lastModified: service.updatedAt
          ? new Date(service.updatedAt)
          : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error("Failed to generate service sitemap routes:", error);
  }

  /* ------------------------------------------------------------------------ */
  /* PROJECTS                                                                 */
  /* ------------------------------------------------------------------------ */

  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const projects = await fetchAllPages((page, limit) =>
      getPublishedProjects({ page, limit }),
    );

    projectRoutes = projects
      .filter(
        (project) =>
          project.status === "published" &&
          project.seo?.noIndex !== true,
      )
      .map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        lastModified: project.updatedAt
          ? new Date(project.updatedAt)
          : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error("Failed to generate project sitemap routes:", error);
  }

  /* ------------------------------------------------------------------------ */
  /* PRODUCTS                                                                 */
  /* ------------------------------------------------------------------------ */

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const firstPage = await getPublishedProducts({
      page: 1,
      limit: 100,
    });

    const remainingPages = await Promise.all(
      Array.from(
        {
          length: Math.max(
            0,
            firstPage.meta.totalPages - 1,
          ),
        },
        (_, index) =>
          getPublishedProducts({
            page: index + 2,
            limit: firstPage.meta.limit || 100,
          }),
      ),
    );

    productRoutes = [firstPage, ...remainingPages]
      .flatMap(({ data }) => data)
      .filter(
        (product) =>
          product.status === "published" &&
          product.seo?.noIndex !== true,
      )
      .map((product) => ({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error("Failed to generate product sitemap routes:", error);
  }

  /* ------------------------------------------------------------------------ */
  /* BLOG                                                                     */
  /* ------------------------------------------------------------------------ */

  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const blogs = await fetchAllPages((page, limit) =>
      getPublishedBlogs({ page, limit }),
    );

    blogRoutes = blogs
      .filter(
        (post) =>
          post.status === "published" &&
          post.seo?.noIndex !== true,
      )
      .map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt
          ? new Date(post.updatedAt)
          : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error("Failed to generate blog sitemap routes:", error);
  }

  /* ------------------------------------------------------------------------ */
  /* FINAL SITEMAP                                                            */
  /* ------------------------------------------------------------------------ */

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}