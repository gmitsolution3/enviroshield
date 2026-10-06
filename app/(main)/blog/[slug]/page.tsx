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

    return {
      title: seo?.metaTitle?.trim() || `${post.title} | Enviroshield`,
      description: seo?.metaDescription?.trim() || post.excerpt,
      keywords: seo?.keywords?.filter(Boolean) ?? post.tags ?? [],
      alternates: seo?.canonicalUrl
        ? {
            canonical: seo.canonicalUrl,
          }
        : undefined,
      robots: {
        index: seo?.noIndex !== true,
        follow: seo?.noIndex !== true,
      },
      openGraph: {
        title:
          seo?.ogTitle?.trim() ||
          seo?.metaTitle?.trim() ||
          post.title,
        description:
          seo?.ogDescription?.trim() ||
          seo?.metaDescription?.trim() ||
          post.excerpt,
        type: "article",
        images: [
          {
            url: seo?.ogImage?.trim() || post.coverImage.url,
            alt: post.coverImage.alt || post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title:
          seo?.ogTitle?.trim() ||
          seo?.metaTitle?.trim() ||
          post.title,
        description:
          seo?.ogDescription?.trim() ||
          seo?.metaDescription?.trim() ||
          post.excerpt,
        images: [seo?.ogImage?.trim() || post.coverImage.url],
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

  return (
    <>
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
