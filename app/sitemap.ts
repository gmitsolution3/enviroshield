import type { MetadataRoute } from "next";

import { getPublishedServices } from "@/lib/api/services";
import { blogPosts, products } from "@/lib/data/content";

const siteUrl = "https://enviroshieldbd.com";

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

  const productRoutes: MetadataRoute.Sitemap = products.map(
    (product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}
