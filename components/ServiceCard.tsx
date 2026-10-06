"use client";

import { Button } from "@/components/Button";
import { IService } from "@/types";
import {
  ArrowUpRight,
  Briefcase,
  ListChecks,
  Sparkles,
} from "lucide-react";
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

  const projectCount = service.projects?.length ?? 0;
  const stepCount = service.process?.items?.length ?? 0;

  return (
    <motion.article
      className="group relative isolate flex aspect-[4/5.4] flex-col justify-end overflow-hidden rounded-[32px] bg-navy shadow-[0_2px_8px_rgba(0,51,78,0.08)] transition-shadow duration-500 hover:shadow-[0_24px_48px_-12px_rgba(1,110,220,0.35)]"
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
        alt={service.primaryImage.alt || service.name}
        fill
        sizes="(max-width: 768px) 90vw, 33vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* Fade: image melts into the dark panel */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-navy from-45% via-navy/85 via-60% to-transparent to-85%"
      />

      {/* Hairline ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/15"
      />

      {/* Top-right glass button (decorative, link overlay handles click) */}
      <span
        aria-hidden="true"
        className="absolute right-[16px] top-[16px] grid size-[44px] place-items-center rounded-full bg-white/20 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 group-hover:bg-blue"
      >
        <ArrowUpRight
          size={18}
          strokeWidth={2.25}
          className="transition-transform duration-300 group-hover:rotate-45"
        />
      </span>

      {/* Content */}
      <div className="relative flex flex-col gap-[14px] p-[20px]">
        {/* Title + pill */}
        <div className="flex items-start justify-between gap-[12px]">
          <h3 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
            {service.name}
          </h3>

          {projectCount > 0 && (
            <span className="shrink-0 rounded-full bg-white/15 px-[12px] py-[6px] text-[13px] font-semibold text-white ring-1 ring-white/10 backdrop-blur-md">
              {projectCount}{" "}
              {projectCount === 1 ? "Project" : "Projects"}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-3 text-[15px] leading-[1.55] text-white/70">
          {service.description}
        </p>

        {/* Chips */}
        <div className="flex flex-wrap items-center gap-[8px]">
          {service.isFeatured && (
            <span className="inline-flex items-center gap-[6px] rounded-full bg-blue/80 px-[12px] py-[7px] text-[12px] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md">
              <Sparkles size={13} aria-hidden="true" />
              Featured
            </span>
          )}

          {stepCount > 0 && (
            <span className="inline-flex items-center gap-[6px] rounded-full bg-white/10 px-[12px] py-[7px] text-[12px] font-medium text-white ring-1 ring-white/10 backdrop-blur-md">
              <ListChecks size={13} aria-hidden="true" />
              {stepCount}-Step Process
            </span>
          )}

          {projectCount > 0 && (
            <span className="inline-flex items-center gap-[6px] rounded-full bg-white/10 px-[12px] py-[7px] text-[12px] font-medium text-white ring-1 ring-white/10 backdrop-blur-md">
              <Briefcase size={13} aria-hidden="true" />
              Proven Work
            </span>
          )}
        </div>

        {/* CTA: collapsed until the card is hovered or focused */}
        <div
          className="
    relative z-30 -mt-[14px] grid grid-rows-[0fr]
    transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
    group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]
    [@media(hover:none)]:grid-rows-[1fr]
    motion-reduce:transition-none
  "
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className="
        pt-[18px] opacity-0 translate-y-3
        transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        group-hover:opacity-100 group-hover:translate-y-0 group-hover:delay-100
        group-focus-within:opacity-100 group-focus-within:translate-y-0
        [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0
        motion-reduce:transition-none
      "
            >
              <Button
                href={`/services/${service.slug}`}
                variant="light"
                fullWidth
                className="h-[56px] text-[16px]"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Whole-card link */}
      <Link
        href={`/services/${service.slug}`}
        aria-label={`Learn more about ${service.name}`}
        className="absolute inset-0 z-20 rounded-[32px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      />
    </motion.article>
  );
}
