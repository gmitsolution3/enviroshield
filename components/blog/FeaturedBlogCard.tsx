import { Reveal } from "@/components/animations/reveal";
import type { IBlog } from "@/types/blog.type";
import { ArrowUpRight, CalendarDays, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedBlogCard({ post }: { post: IBlog }) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const authorName = post.author?.name;
  const primaryTag = post.tags?.[0];

  return (
    <Reveal dir="up">
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="group grid grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-[20px] bg-navy max-[900px]:grid-cols-1"
      >
        <div className="relative min-h-[460px] overflow-hidden max-[900px]:aspect-[4/3] max-[900px]:min-h-0">
          {post.coverImage?.url && (
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-12 max-[900px]:p-8 max-[600px]:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
            <span
              className="h-[2px] w-7 bg-current"
              aria-hidden="true"
            />
            LATEST ARTICLE
            {primaryTag && (
              <>
                <span aria-hidden="true">·</span>
                <span>{primaryTag}</span>
              </>
            )}
          </div>

          <h4 className="mb-4 text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
            {post.title}
          </h4>

          {post.excerpt && (
            <p className="mb-6 line-clamp-4 text-[15px] leading-[1.75] text-white/70">
              {post.excerpt}
            </p>
          )}

          {(authorName || publishedDate) && (
            <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[13px] text-white/75">
              {authorName && (
                <span className="flex items-center gap-2">
                  <User
                    size={15}
                    aria-hidden="true"
                    className="text-paste"
                  />
                  {authorName}
                </span>
              )}

              {publishedDate && (
                <span className="flex items-center gap-2">
                  <CalendarDays
                    size={15}
                    aria-hidden="true"
                    className="text-paste"
                  />
                  {publishedDate}
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
  );
}
