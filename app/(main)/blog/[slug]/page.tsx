import { Reveal } from "@/components/animations/reveal";
import BlogContent from "@/components/blog/BlogContent";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import {
  getPublishedBlogBySlug,
  getPublishedBlogs,
} from "@/lib/api/blogs";
import type { IBlog } from "@/types/admin/blog.type";
import type { Metadata } from "next";
import Image from "next/image";
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

function formatPublishedDate(publishedAt?: string | null) {
  if (!publishedAt) {
    return null;
  }

  return new Date(publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

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

  const articleUrl = `https://enviroshieldbd.com/blog/${post.slug}`;

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

      <section
        aria-labelledby="article-heading"
        className="pt-[112px] max-[900px]:pt-20 max-[600px]:pt-16"
      >
        <Container>
          <div className="mx-auto max-w-[850px]">
            <Reveal dir="up">
              <div className="mb-6 flex flex-wrap gap-[15px] text-[12px] text-ink">
                {post.tags?.[0] ? <span>{post.tags[0]}</span> : null}

                {publishedDate ? (
                  <time dateTime={post.publishedAt ?? undefined}>
                    {publishedDate}
                  </time>
                ) : null}

                {post.author?.name ? (
                  <span>{post.author.name}</span>
                ) : null}
              </div>

              <h1
                id="article-heading"
                className="mb-[30px] text-[clamp(40px,6vw,68px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-navy max-[600px]:text-[42px]"
              >
                {post.title}
              </h1>
            </Reveal>

            <Reveal dir="image" delay={0.1}>
              <div className="relative mb-10 h-[480px] overflow-hidden rounded-[18px] max-[600px]:h-[300px]">
                <Image
                  src={post.coverImage.url}
                  alt={post.coverImage.alt || post.title}
                  fill
                  priority
                  sizes="(max-width: 600px) 100vw, 850px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <article>
        <section
          aria-label="Article content"
          className="pb-[112px] max-[900px]:pb-20 max-[600px]:pb-16"
        >
          <Container>
            <Reveal dir="up" className="mx-auto max-w-[850px]">
              <p className="mb-8 text-[17px] leading-[1.8] text-ink">
                {post.excerpt}
              </p>

              <div className="blog-content-wrapper text-[17px] leading-[1.8] text-ink">
                <BlogContent content={post.content} />
              </div>

              <div className="mt-10">
                <Button href="/contact">Talk to an expert</Button>
              </div>
            </Reveal>
          </Container>
        </section>
      </article>
    </>
  );
}
