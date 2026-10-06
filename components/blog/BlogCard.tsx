"use client";

import type { IBlog } from "@/types/admin/blog.type";
import { ArrowUpRight } from "lucide-react";
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

  return (
    <motion.article
      className="group bg-white p-[30px] transition-shadow duration-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -5,
              transition: {
                duration: 0.3,
              },
            }
      }
    >
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="block"
      >
        <div className="relative mb-[20px] h-[240px] overflow-hidden rounded-[14px]">
          <motion.div
            className="absolute inset-0"
            whileHover={
              reduce
                ? undefined
                : {
                    scale: 1.04,
                  }
            }
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <Image
              src={post?.coverImage?.url}
              alt={post?.coverImage?.alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="mb-[12px] flex items-center gap-[10px] text-[10px] font-extrabold uppercase tracking-[0.12em]">
          {primaryTag ? (
            <span className="text-blue">{primaryTag}</span>
          ) : null}

          {primaryTag && publishedDate ? (
            <span
              className="h-[3px] w-[3px] rounded-full bg-[#aebcc3]"
              aria-hidden="true"
            />
          ) : null}

          {publishedDate ? (
            <time
              dateTime={post.publishedAt ?? undefined}
              className="text-[#71838d]"
            >
              {publishedDate}
            </time>
          ) : null}
        </div>

        <h3 className="mb-[10px] text-[22px] font-extrabold leading-[1.2] tracking-[-0.035em] text-navy">
          {post.title}
        </h3>

        <p className="mb-[18px] text-[14px] leading-[1.7] text-ink">
          {post.excerpt}
        </p>

        <span className="group/link inline-flex items-center gap-[7px] text-[13px] font-bold text-navy transition-colors duration-200 group-hover:text-blue">
          Read article
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          />
        </span>
      </Link>
    </motion.article>
  );
}
