"use client";

import { IService } from "@/types";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { fadeUp, viewportOnce } from "./animations/variants";

export default function ServiceCard({
  service,
  index = 0,
}: {
  service: IService;
  index?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="group relative isolate aspect-[4/5] overflow-hidden rounded-[24px] bg-navy shadow-[0_2px_8px_rgba(0,51,78,0.08)] transition-shadow duration-500 hover:shadow-[0_24px_48px_-12px_rgba(1,110,220,0.35)]"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={reduce ? undefined : { y: -8 }}
    >
      {/* Image */}
      <Image
        src={service.primaryImage.url}
        alt={service.name}
        fill
        sizes="(max-width: 768px) 90vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      {/* Gradient for text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-navy via-navy/55 via-45% to-transparent to-75%"
      />

      {/* Inner hairline ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15"
      />

      {/* Featured pill */}
      {service.isFeatured && (
        <span className="absolute left-[20px] top-[20px] inline-flex items-center gap-[8px] rounded-full bg-blue/80 px-[12px] py-[6px] text-[11px] font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/15 backdrop-blur-md">
          <span className="size-[6px] rounded-full bg-white" />
          Featured
        </span>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-[16px] p-[24px]">
        {/* Blue ribbon layer (rises first, peeks above the white panel) */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -top-[52px] bottom-0 bg-blue transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:polygon(0_100%,100%_100%,100%_100%,0_100%)] group-hover:[clip-path:polygon(0_46px,100%_0,100%_100%,0_100%)]"
        />

        {/* Tilted white panel */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -top-[40px] bottom-0 bg-white transition-[clip-path] delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:polygon(0_100%,100%_100%,100%_100%,0_100%)] group-hover:[clip-path:polygon(0_40px,100%_0,100%_100%,0_100%)]"
        />

        <div className="relative min-w-0">
          <h3 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] text-white transition-colors duration-500 group-hover:text-navy">
            {service.name}
          </h3>

          {/* Accent line grows on hover */}
          <span
            aria-hidden="true"
            className="mb-[12px] mt-[12px] block h-[2px] w-[28px] rounded-full bg-paste transition-all duration-500 group-hover:w-[74px] group-hover:bg-blue"
          />

          <p className="line-clamp-2 text-[15px] leading-[1.55] text-white/75 transition-colors duration-500 group-hover:text-ink/75">
            {service.description}
          </p>
        </div>

        {/* Arrow (decorative, the link overlay below handles the click) */}
        <span
          aria-hidden="true"
          className="relative grid size-[48px] shrink-0 place-items-center rounded-full bg-white text-navy ring-1 ring-transparent transition-all duration-300 group-hover:bg-blue group-hover:text-white"
        >
          <ArrowUpRight
            size={20}
            strokeWidth={2.25}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </span>
      </div>

      {/* Whole-card link */}
      <Link
        href={`/services/${service.slug}`}
        aria-label={`Learn more about ${service.name}`}
        className="absolute inset-0 z-20 rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      />
    </motion.article>
  );
}
