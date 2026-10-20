import type { MetadataRoute } from "next";

import { getPublishedBlogs } from "@/lib/api/blogs";
import { getPublishedProjects } from "@/lib/api/projects";
import { getPublishedServices } from "@/lib/api/services";
import { getPublishedProducts } from "@/lib/api/products";
import { siteUrl } from "@/lib/site-url";

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

  let serviceRoutes: MetadataRoute.Sitemap = [];

  try {
    const result = await getPublishedServices({
      page: 1,
      limit: 100,
    });

    serviceRoutes = result.data
      .filter(
        (service) =>
          service.status === "published" &&
          service.seo?.noIndex !== true,
      )
      .map((service) => ({
        url: `${siteUrl}/services/${service.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
  } catch {
    serviceRoutes = [];
  }

  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const result = await getPublishedProjects({
      page: 1,
      limit: 100,
    });

    projectRoutes = result.data
      .filter(
        (project) =>
          project.status === "published" &&
          project.seo?.noIndex !== true,
      )
      .map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
  } catch {
    projectRoutes = [];
  }

  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const result = await getPublishedBlogs({
      page: 1,
      limit: 100,
    });

    blogRoutes = result.data
      .filter(
        (post) =>
          post.status === "published" &&
          post.seo?.noIndex !== true,
      )
      .map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    blogRoutes = [];
  }

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const firstPage = await getPublishedProducts({ page: 1, limit: 100 });
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(0, firstPage.meta.totalPages - 1) }, (_, index) =>
        getPublishedProducts({ page: index + 2, limit: firstPage.meta.limit || 100 }),
      ),
    );

    productRoutes = [firstPage, ...remainingPages]
      .flatMap(({ data }) => data)
      .filter((product) => product.seo?.noIndex !== true)
      .map((product) => ({
        url: `${siteUrl}/products/${product.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    productRoutes = [];
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}
