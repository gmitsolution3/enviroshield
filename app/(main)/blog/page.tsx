import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublishedBlogs } from "@/lib/api/blogs";
import type { Metadata } from "next";

type BlogPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  const isFirstPage = page === 1;

  const title = isFirstPage
    ? "Painting, Waterproofing & Flooring Journal | Enviroshield"
    : `Painting, Waterproofing & Flooring Journal — Page ${page} | Enviroshield`;

  const description = isFirstPage
    ? "Read Enviroshield's latest guides, insights, and practical advice on waterproofing, flooring, painting, protective coatings, heat insulation, and better-finished spaces."
    : `Explore more Enviroshield guides and insights on waterproofing, flooring, painting, protective coatings, insulation, and better-finished spaces — page ${page}.`;

  const canonical = isFirstPage ? "/blog" : `/blog?page=${page}`;

  return {
    title,
    description,

    keywords: [
      "Enviroshield blog",
      "waterproofing blog",
      "waterproofing solutions",
      "flooring solutions",
      "epoxy flooring",
      "PU flooring",
      "painting services",
      "wall finishing",
      "protective coating",
      "heat insulation",
      "construction solutions Bangladesh",
      "waterproofing Bangladesh",
      "flooring Bangladesh",
    ],

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: [
        {
          url: "https://images.pexels.com/photos/7546558/pexels-photo-7546558.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
          width: 1200,
          height: 630,
          alt: "Enviroshield painting, flooring and protective coating journal",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        "https://images.pexels.com/photos/7546558/pexels-photo-7546558.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
      ],
    },
  };
}

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  let result;

  try {
    result = await getPublishedBlogs({
      page: currentPage,
      limit: 10,
    });
  } catch {
    result = {
      success: false,
      statusCode: 500,
      message: "Failed to load blog articles.",
      meta: {
        page: currentPage,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      data: [],
    };
  }

  const blogs = result.data;

  return (
    <>
      <PageHero
        eyebrow="JOURNAL"
        title="Ideas, guides and inspiration for better spaces."
        text="Practical advice and thoughtful ideas from our team — from choosing a colour to preparing a wall properly."
        image="https://images.pexels.com/photos/7546558/pexels-photo-7546558.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
      />

      <section
        aria-labelledby="blog-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="ALL ARTICLES"
            title="Latest from the journal"
            headingId="blog-heading"
          />

          {blogs.length > 0 ? (
            <>
              <StaggerContainer className="mt-11 grid grid-cols-3 gap-[25px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:gap-10">
                {blogs.map((blog, index) => (
                  <StaggerItem key={blog._id}>
                    <BlogCard post={blog} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <BlogPagination
                currentPage={result.meta.page}
                totalPages={result.meta.totalPages}
              />
            </>
          ) : (
            <div className="mt-11 flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-line bg-[#f8fbfd] px-6 py-12 text-center">
              <h3 className="text-2xl font-semibold text-navy">
                No articles available
              </h3>

              <p className="mt-3 max-w-[560px] text-sm leading-6 text-ink">
                We&apos;re currently updating our journal. Please
                check back soon or contact our team if you need
                assistance.
              </p>

              <Button href="/contact" className="mt-6">
                Talk to our team
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
