import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import BlogCard from "@/components/blog/BlogCard";
import BlogContent from "@/components/blog/BlogContent";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import {
  getPublishedBlogBySlug,
  getPublishedBlogs,
} from "@/lib/api/blogs";
import type { IBlog } from "@/types/admin/blog.type";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPublishedBlogBySlug(slug);

    const seo = post.seo;

    const title =
      seo?.metaTitle?.trim() || `${post.title} | Enviroshield`;

    const description = seo?.metaDescription?.trim() || post.excerpt;

    const keywords = seo?.keywords?.filter(Boolean) ?? [];

    const defaultCanonical = `https://enviroshieldbd.com/blog/${post.slug}`;

    const canonical = (() => {
      const configuredCanonical = seo?.canonicalUrl?.trim();

      if (!configuredCanonical) {
        return defaultCanonical;
      }

      try {
        const parsed = new URL(
          configuredCanonical,
          "https://enviroshieldbd.com",
        );

        if (parsed.origin !== "https://enviroshieldbd.com") {
          return defaultCanonical;
        }

        return parsed.toString();
      } catch {
        return defaultCanonical;
      }
    })();

    const ogTitle = seo?.ogTitle?.trim() || title;

    const ogDescription = seo?.ogDescription?.trim() || description;

    const ogImage = seo?.ogImage?.trim() || post.coverImage.url;

    return {
      title,
      description,
      keywords,

      alternates: {
        canonical,
      },

      robots: {
        index: seo?.noIndex !== true,
        follow: seo?.noIndex !== true,
        googleBot: {
          index: seo?.noIndex !== true,
          follow: seo?.noIndex !== true,
        },
      },

      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: "article",
        url: canonical,
        images: [
          {
            url: ogImage,
            alt: post.coverImage.alt || post.title,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Article not found | Enviroshield",
      description:
        "The requested Enviroshield article could not be found.",

      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }
}

export async function generateStaticParams() {
  try {
    const result = await getPublishedBlogs({
      page: 1,
      limit: 100,
    });

    return result.data.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatPublishedDate(publishedAt?: string | null) {
  if (!publishedAt) {
    return null;
  }

  return new Date(publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Walks the TipTap JSON and collects all text, to estimate reading time
function collectText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const n = node as { text?: string; content?: unknown[] };
  const own = typeof n.text === "string" ? n.text : "";
  const children = Array.isArray(n.content)
    ? n.content.map(collectText).join(" ")
    : "";

  return `${own} ${children}`;
}

function getReadingMinutes(content: unknown) {
  const words = collectText(content)
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

const articleBodyClass = [
  "blog-content-wrapper font-serif text-[20px] leading-[1.85] text-navy/90 max-[600px]:text-[18px]",
  "[&_p]:my-6",
  "[&_h1]:mb-4 [&_h1]:mt-14 [&_h1]:font-sans [&_h1]:text-[34px] [&_h1]:font-extrabold [&_h1]:leading-[1.15] [&_h1]:tracking-[-0.03em] [&_h1]:text-navy",
  "[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-sans [&_h2]:text-[28px] [&_h2]:font-extrabold [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.03em] [&_h2]:text-navy",
  "[&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:font-sans [&_h3]:text-[22px] [&_h3]:font-bold [&_h3]:leading-[1.3] [&_h3]:text-navy",
  "[&_a]:text-blue [&_a]:underline [&_a]:underline-offset-4",
  "[&_strong]:font-bold [&_strong]:text-navy",
  "[&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:my-2",
  "[&_blockquote]:my-10 [&_blockquote]:border-l-[3px] [&_blockquote]:border-navy [&_blockquote]:pl-6 [&_blockquote]:text-[24px] [&_blockquote]:italic [&_blockquote]:leading-[1.5] [&_blockquote]:text-navy",
  "[&_img]:my-10 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[12px]",
  "[&_hr]:my-12 [&_hr]:border-line",
  "[&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-[10px] [&_pre]:bg-navy [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-[15px] [&_pre]:text-white",
  "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-mist [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.85em]",
].join(" ");

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  let post: IBlog;

  try {
    post = await getPublishedBlogBySlug(slug);
  } catch {
    notFound();
  }

  const publishedDate = formatPublishedDate(post.publishedAt);
  const readingMinutes = getReadingMinutes(post.content);
  const authorName = post.author?.name || "Enviroshield";
  const authorImage = post.author?.image;
  const tags = post.tags ?? [];

  const articleUrl = `https://enviroshieldbd.com/blog/${post.slug}`;

  // More articles: the latest ones, excluding this post
  let related: IBlog[] = [];

  try {
    const result = await getPublishedBlogs({ page: 1, limit: 4 });
    related = result.data
      .filter((item) => item._id !== post._id)
      .slice(0, 3);
  } catch {
    related = [];
  }

  const shareLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(post.title)}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${articleUrl}`)}`,
    },
  ];

  /*
   * BlogPosting structured data
   *
   * This describes the actual article and connects it
   * to the Enviroshield organization and webpage.
   */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,

    headline: post.title,
    description: post.excerpt,
    url: articleUrl,

    image: [post.coverImage.url],

    datePublished: post.publishedAt || post.createdAt,

    dateModified:
      post.updatedAt || post.publishedAt || post.createdAt,

    author: {
      "@type": "Person",
      name: post.author?.name || "Enviroshield",

      ...(post.author?.image
        ? {
            image: post.author.image,
          }
        : {}),
    },

    publisher: {
      "@type": "Organization",
      "@id": "https://enviroshieldbd.com/#organization",
      name: "Enviroshield",
      url: "https://enviroshieldbd.com",
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${articleUrl}#webpage`,
      url: articleUrl,
      name: post.title,
    },

    ...(post.tags?.length
      ? {
          keywords: post.tags.join(", "),
        }
      : {}),
  };

  /*
   * WebPage structured data
   *
   * Connects the article page to the Enviroshield
   * website entity.
   */
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${articleUrl}#webpage`,

    url: articleUrl,
    name: post.title,
    description: post.excerpt,

    isPartOf: {
      "@type": "WebSite",
      "@id": "https://enviroshieldbd.com/#website",
      url: "https://enviroshieldbd.com",
      name: "Enviroshield",
    },

    about: {
      "@id": `${articleUrl}#article`,
    },

    primaryImageOfPage: {
      "@type": "ImageObject",
      url: post.coverImage.url,
    },
  };

  /*
   * Breadcrumb structured data
   *
   * Home → Blog → Article
   */
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${articleUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://enviroshieldbd.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://enviroshieldbd.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* ARTICLE HEADER                                                     */}
      {/* ------------------------------------------------------------------ */}

      <header
        aria-labelledby="article-heading"
        className="pt-[72px] max-[900px]:pt-14 max-[600px]:pt-10"
      >
        <Container>
          <Reveal dir="up">
            <div className="mx-auto max-w-[760px]">
              <Link
                href="/blog"
                className="mb-8 inline-flex items-center gap-2 text-[14px] font-bold text-ink transition-colors hover:text-blue"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Journal
              </Link>

              {tags.length > 0 && (
                <ul className="mb-5 flex flex-wrap gap-2">
                  {tags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-mist px-3 py-1.5 text-[12px] font-bold capitalize text-blue"
                    >
                      {tag.replace(/-/g, " ")}
                    </li>
                  ))}
                </ul>
              )}

              <h1
                id="article-heading"
                className="mb-6 text-[clamp(36px,5.4vw,58px)] font-extrabold leading-[1.06] tracking-[-0.045em] text-navy"
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mb-9 text-[clamp(19px,2.2vw,23px)] leading-[1.55] text-ink/80">
                  {post.excerpt}
                </p>
              )}

              {/* Author row */}
              <div className="flex items-center gap-4 border-y border-line py-5">
                {authorImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={authorImage}
                    alt=""
                    aria-hidden="true"
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-blue text-[18px] font-extrabold text-white"
                  >
                    {authorName.charAt(0)}
                  </span>
                )}

                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-navy">
                    {authorName}
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 text-[14px] text-ink/70">
                    {publishedDate && (
                      <time dateTime={post.publishedAt ?? undefined}>
                        {publishedDate}
                      </time>
                    )}
                    {publishedDate && (
                      <span aria-hidden="true">·</span>
                    )}
                    <span>{readingMinutes} min read</span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* COVER                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section aria-label="Cover image" className="pt-10">
        <Container>
          <Reveal dir="image" delay={0.1}>
            <figure className="mx-auto max-w-[1040px]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[16px] bg-mist max-[600px]:aspect-[4/3]">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.alt || post.title}
                  fill
                  priority
                  sizes="(max-width: 1100px) 100vw, 1040px"
                  className="object-cover"
                />
              </div>

              {post.coverImage.caption && (
                <figcaption className="mt-3 text-center text-[14px] leading-[1.6] text-ink/70">
                  {post.coverImage.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ARTICLE BODY                                                       */}
      {/* ------------------------------------------------------------------ */}

      <article className="pb-[96px] pt-12 max-[900px]:pb-16 max-[600px]:pt-8">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <div className={articleBodyClass}>
              <BlogContent content={post.content} />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <ul className="mt-14 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-mist px-4 py-2 text-[14px] font-medium capitalize text-navy"
                  >
                    {tag.replace(/-/g, " ")}
                  </li>
                ))}
              </ul>
            )}

            {/* Share */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-5">
              <span className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-ink/60">
                Share
              </span>
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-bold text-navy transition-colors hover:text-blue"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Author card */}
            <div className="mt-10 flex items-center gap-5 rounded-[16px] bg-mist p-6 max-[600px]:flex-col max-[600px]:items-start">
              {authorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={authorImage}
                  alt=""
                  aria-hidden="true"
                  className="size-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-16 shrink-0 place-items-center rounded-full bg-blue text-[24px] font-extrabold text-white"
                >
                  {authorName.charAt(0)}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink/60">
                  Written by
                </p>
                <p className="text-[20px] font-extrabold tracking-[-0.02em] text-navy">
                  {authorName}
                </p>
              </div>

              <Link
                href="/blog"
                className="inline-flex shrink-0 items-center gap-[7px] text-[14px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
              >
                More from the journal
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </article>

      {/* ------------------------------------------------------------------ */}
      {/* MORE ARTICLES                                                      */}
      {/* ------------------------------------------------------------------ */}

      {related.length > 0 && (
        <section
          aria-labelledby="more-articles-heading"
          className="border-t border-line bg-mist/50 py-[96px] max-[900px]:py-16"
        >
          <Container>
            <div className="mb-10 flex items-end justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start">
              <h2
                id="more-articles-heading"
                className="text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.04em] text-navy"
              >
                Keep reading
              </h2>

              <Link
                href="/blog"
                className="inline-flex shrink-0 items-center gap-[7px] text-[14px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
              >
                View all articles
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <StaggerContainer className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[25px]">
              {related.map((item, index) => (
                <StaggerItem key={item._id} className="h-full">
                  <BlogCard post={item} index={index} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CTA                                                                */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-label="Talk to an expert"
        className="py-[96px] max-[900px]:py-16"
      >
        <Container>
          <div className="flex items-center justify-between gap-8 rounded-[20px] bg-navy p-12 max-[900px]:flex-col max-[900px]:items-start max-[900px]:p-8 max-[600px]:p-6">
            <div className="max-w-[620px]">
              <h2 className="mb-3 text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
                Need advice for your own property?
              </h2>
              <p className="text-[16px] leading-[1.7] text-white/70">
                Talk to our team about waterproofing, flooring, and
                protective solutions that fit your project.
              </p>
            </div>

            <Button href="/contact" variant="light">
              Talk to an expert
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
