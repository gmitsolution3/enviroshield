"use client";

import { BlogPost } from "@/lib/data/content";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { fadeUp, viewportOnce } from "./animations/variants";

export default function BlogCard({
  post,
  index = 0,
}: {
  post: BlogPost;
  index?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="group"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={
        reduce ? undefined : { y: -5, transition: { duration: 0.3 } }
      }
    >
      <div className="relative mb-[20px] h-[240px] overflow-hidden rounded-[14px]">
        <motion.div
          className="absolute inset-0"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Image
            src={post.image}
            alt={`${post.title} - ${post.category}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      </div>

      <div className="mb-[12px] flex items-center gap-[10px] text-[10px] font-extrabold uppercase tracking-[0.12em]">
        <span className="text-blue">{post.category}</span>

        <span
          className="h-[3px] w-[3px] rounded-full bg-[#aebcc3]"
          aria-hidden="true"
        />

        <span className="text-[#71838d]">{post.date}</span>
      </div>

      <h3 className="mb-[10px] text-[22px] font-extrabold leading-[1.2] tracking-[-0.035em] text-navy">
        {post.title}
      </h3>

      <p className="mb-[18px] text-[14px] leading-[1.7] text-ink">
        {post.excerpt}
      </p>

      <Link
        href={`/blog/${post.slug}`}
        className="group/link inline-flex items-center gap-[7px] text-[13px] font-bold text-navy transition-colors duration-200 hover:text-blue"
      >
        Read article
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/link:translate-x-1"
        />
      </Link>
    </motion.article>
  );
}
