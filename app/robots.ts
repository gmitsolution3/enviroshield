import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/api/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
      ],
    },

    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}