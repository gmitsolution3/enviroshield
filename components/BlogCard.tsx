"use client";
import { BlogPost } from "@/lib/data/content";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { fadeUp, viewportOnce } from "./animations/variants";
import Link from "next/link";

export function BlogCard({
  post,
  index = 0,
}: {
  post: BlogPost;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="blog-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={
        reduce ? undefined : { y: -5, transition: { duration: 0.3 } }
      }
    >
      <div className="blog-image">
        <motion.div
          className="blog-image-inner"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      </div>
      <div className="blog-meta">
        <span>{post.category}</span>
        <span>{post.date}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="text-link">
        Read article <ArrowUpRight size={16} />
      </Link>
    </motion.article>
  );
}
