import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import BlogCard from "@/components/blog/BlogCard";
import BlogPagination from "@/components/blog/BlogPagination";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublishedBlogs } from "@/lib/api/blogs";
import { ArrowUpRight, CalendarDays, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
      limit: 12,
    });
  } catch {
    result = {
      success: false,
      statusCode: 500,
      message: "Failed to load blog articles.",
      meta: {
        page: currentPage,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
      data: [],
    };
  }

  const blogs = result.data;
  const total = result.meta.total;

  // Spotlight: the latest article, first page only
  const featured = currentPage === 1 ? blogs[0] : undefined;
  const gridBlogs = featured ? blogs.slice(1) : blogs;

  const featuredDate = featured?.publishedAt
    ? new Date(featured.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const featuredAuthor = featured?.author?.name;
  const featuredTag = featured?.tags?.[0];

  return (
    <>
      <PageHero
        eyebrow="JOURNAL"
        title="Ideas, guides and inspiration for better spaces."
        text="Practical advice and thoughtful ideas from our team — from choosing a colour to preparing a wall properly."
        image="/images/service-hero.jpg"
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
              {/* Spotlight */}
              {featured && (
                <Reveal dir="up">
                  <Link
                    href={`/blog/${featured.slug}`}
                    aria-label={`Read ${featured.title}`}
                    className="group mt-12 grid grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-[20px] bg-navy max-[900px]:grid-cols-1"
                  >
                    <div className="relative min-h-[460px] overflow-hidden max-[900px]:aspect-[4/3] max-[900px]:min-h-0">
                      <Image
                        src={featured.coverImage.url}
                        alt={
                          featured.coverImage.alt || featured.title
                        }
                        fill
                        sizes="(max-width: 900px) 100vw, 55vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="flex flex-col justify-center p-12 max-[900px]:p-8 max-[600px]:p-6">
                      <div className="mb-5 flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
                        <span
                          className="h-[2px] w-7 bg-current"
                          aria-hidden="true"
                        />
                        LATEST ARTICLE
                        {featuredTag && (
                          <>
                            <span aria-hidden="true">·</span>
                            {featuredTag}
                          </>
                        )}
                      </div>

                      <h3 className="mb-4 text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
                        {featured.title}
                      </h3>

                      {featured.excerpt && (
                        <p className="mb-6 line-clamp-4 text-[15px] leading-[1.75] text-white/70">
                          {featured.excerpt}
                        </p>
                      )}

                      {(featuredDate || featuredAuthor) && (
                        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[13px] text-white/75">
                          {featuredAuthor && (
                            <span className="flex items-center gap-2">
                              <User
                                size={15}
                                aria-hidden="true"
                                className="text-paste"
                              />
                              {featuredAuthor}
                            </span>
                          )}
                          {featuredDate && (
                            <span className="flex items-center gap-2">
                              <CalendarDays
                                size={15}
                                aria-hidden="true"
                                className="text-paste"
                              />
                              {featuredDate}
                            </span>
                          )}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-[gap] duration-200 group-hover:gap-3">
                        Read article
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Grid */}
              {gridBlogs.length > 0 && (
                <>
                  {featured && (
                    <div className="mb-8 mt-16 flex items-end justify-between border-b border-line pb-4">
                      <h3 className="text-[24px] font-extrabold tracking-[-0.03em] text-navy">
                        More articles
                      </h3>
                      <span className="text-[14px] text-ink">
                        {total} in total
                      </span>
                    </div>
                  )}

                  <StaggerContainer
                    className={`grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[25px] max-[600px]:gap-10 ${
                      featured ? "" : "mt-11"
                    }`}
                  >
                    {gridBlogs.map((blog, index) => (
                      <StaggerItem key={blog._id}>
                        <BlogCard post={blog} index={index} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </>
              )}

              <BlogPagination
                currentPage={result.meta.page}
                totalPages={result.meta.totalPages}
              />
            </>
          ) : (
            <div className="mt-11 flex min-h-[280px] flex-col items-center justify-center rounded-[18px] border border-line bg-mist px-6 py-12 text-center">
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
