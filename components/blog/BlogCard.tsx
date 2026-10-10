"use client";

import type { IBlog } from "@/types/admin/blog.type";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { fadeUp, viewportOnce } from "../animations/variants";

export default function BlogCard({
  post,
  index = 0,
}: {
  post: IBlog;
  index?: number;
}) {
  const reduce = useReducedMotion();

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : null;

  const primaryTag = post.tags?.[0];
  const authorName = post.author?.name || "Enviroshield";
  const authorImage = post.author?.image;

  return (
    <motion.article
      className="group h-full"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: (index % 3) * 0.1 }}
      whileHover={
        reduce ? undefined : { y: -6, transition: { duration: 0.3 } }
      }
    >
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-[border-color,box-shadow] duration-300 hover:border-blue/40 hover:shadow-[0_18px_40px_-16px_rgba(0,51,78,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-mist">
          {post.coverImage?.url && (
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          )}

          {primaryTag && (
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-navy">
              {primaryTag}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6 max-[600px]:p-5">
          {publishedDate && (
            <time
              dateTime={post.publishedAt ?? undefined}
              className="mb-3 flex items-center gap-2 text-[12px] font-medium text-ink/70"
            >
              <CalendarDays
                size={14}
                aria-hidden="true"
                className="text-blue"
              />
              {publishedDate}
            </time>
          )}

          <h3 className="mb-3 line-clamp-2 text-[22px] font-extrabold leading-[1.2] tracking-[-0.03em] text-navy transition-colors duration-300 group-hover:text-blue">
            {post.title}
          </h3>

          <p className="mb-6 line-clamp-3 text-[14px] leading-[1.7] text-ink">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
            <div className="flex min-w-0 items-center gap-3">
              {authorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={authorImage}
                  alt=""
                  aria-hidden="true"
                  className="size-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-blue/10 text-[14px] font-extrabold text-blue"
                >
                  {authorName.charAt(0)}
                </span>
              )}

              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-navy">
                  {authorName}
                </p>
                <p className="text-[12px] text-ink/60">Author</p>
              </div>
            </div>

            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-navy transition-colors duration-300 group-hover:border-blue group-hover:bg-blue group-hover:text-white"
            >
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
