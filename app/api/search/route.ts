import { NextResponse } from "next/server";
import { getPublishedServices } from "@/lib/api/services";
import { getPublishedProducts } from "@/lib/api/products";
import { getPublishedProjects } from "@/lib/api/projects";
import { getPublishedBlogs } from "@/lib/api/blogs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  if (!query || query.length < 2) {
    return NextResponse.json({
      services: [],
      products: [],
      projects: [],
      articles: [],
    });
  }

  try {
    const [servicesRes, productsRes, projectsRes, blogsRes] =
      await Promise.allSettled([
        getPublishedServices({ search: query, limit: 6 }),
        getPublishedProducts({ search: query, limit: 6 }),
        getPublishedProjects({ search: query, limit: 6 }),
        getPublishedBlogs({ search: query, limit: 6 }),
      ]);

    const services =
      servicesRes.status === "fulfilled"
        ? (servicesRes.value.data || []).map((s) => ({
            id: s._id,
            title: s.name,
            slug: s.slug,
            description: s.description || s.detailHeading || "",
            image: s.primaryImage?.url || "",
            type: "service" as const,
            url: `/services/${s.slug}`,
          }))
        : [];

    const products =
      productsRes.status === "fulfilled"
        ? (productsRes.value.data || []).map((p) => ({
            id: p._id,
            title: p.name,
            slug: p.slug,
            description:
              p.shortDescription || p.categoryId?.name || "",
            category: p.categoryId?.name || "",
            price:
              p.price ||
              (p.variants && p.variants[0]?.price) ||
              0,
            image: p.primaryImage?.url || "",
            type: "product" as const,
            url: `/products/${p.slug}`,
          }))
        : [];

    const projects =
      projectsRes.status === "fulfilled"
        ? (projectsRes.value.data || []).map((pr) => {
            const loc = pr.location
              ? [pr.location.area, pr.location.city].filter(Boolean).join(", ")
              : "";
            const clientName = pr.client?.name || "";
            const metaInfo = [clientName, loc].filter(Boolean).join(" • ");

            return {
              id: pr._id,
              title: pr.title,
              slug: pr.slug,
              description: metaInfo || pr.description || "",
              image: pr.primaryImage?.url || "",
              type: "project" as const,
              url: `/projects/${pr.slug}`,
            };
          })
        : [];

    const articles =
      blogsRes.status === "fulfilled"
        ? (blogsRes.value.data || []).map((b) => ({
            id: b._id,
            title: b.title,
            slug: b.slug,
            description: b.excerpt || "",
            tag: b.tags?.[0] || "",
            image: b.coverImage?.url || "",
            type: "article" as const,
            url: `/blog/${b.slug}`,
          }))
        : [];

    return NextResponse.json({
      services,
      products,
      projects,
      articles,
    });
  } catch (error) {
    console.error("Global search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}
