"use client";

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
import { fadeUp, viewportOnce } from "../animations/variants";

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
      className="group relative isolate flex h-[480px] flex-col overflow-hidden rounded-[28px] bg-navy shadow-[0_2px_8px_rgba(0,51,78,0.08)] transition-shadow duration-500 hover:shadow-[0_28px_56px_-14px_rgba(1,110,220,0.5)] md:h-[520px]"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: (index % 3) * 0.1 }}
      whileHover={reduce ? undefined : { y: -8 }}
    >
      {/* Image: clear, no overlay on the photo */}
      <div className="relative min-h-[240px] flex-1 overflow-hidden bg-mist">
        <Image
          src={service.primaryImage.url}
          alt={service.primaryImage.alt || service.name}
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />

        {/* Diagonal shine on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[500%] motion-reduce:hidden"
        />

        {service.isFeatured && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-[6px] rounded-full bg-white px-[12px] py-[7px] text-[12px] font-bold text-navy">
            <Sparkles
              size={13}
              aria-hidden="true"
              className="text-blue"
            />
            Featured
          </span>
        )}

        <span
          aria-hidden="true"
          className="absolute right-4 top-4 grid size-[44px] place-items-center rounded-full bg-white text-navy transition-colors duration-300 group-hover:bg-blue group-hover:text-white"
        >
          <ArrowUpRight
            size={18}
            strokeWidth={2.25}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </span>
      </div>

      {/* Info panel */}
      <div className="shrink-0 p-6 max-[600px]:p-5">
        <h3 className="mb-2 line-clamp-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-white">
          {service.name}
        </h3>

        <p className="mb-4 line-clamp-2 text-[14px] leading-[1.6] text-white/70">
          {service.description}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-white/15 pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/75">
            {stepCount > 0 && (
              <span className="inline-flex items-center gap-[6px]">
                <ListChecks
                  size={14}
                  aria-hidden="true"
                  className="text-paste"
                />
                {stepCount}-step process
              </span>
            )}

            {projectCount > 0 && (
              <span className="inline-flex items-center gap-[6px]">
                <Briefcase
                  size={14}
                  aria-hidden="true"
                  className="text-paste"
                />
                {projectCount}{" "}
                {projectCount === 1 ? "project" : "projects"}
              </span>
            )}
          </div>

          <span className="shrink-0 text-[13px] font-bold text-white transition-colors duration-300 group-hover:text-paste">
            Learn more
          </span>
        </div>
      </div>

      {/* Whole-card link */}
      <Link
        href={`/services/${service.slug}`}
        aria-label={`Learn more about ${service.name}`}
        className="absolute inset-0 z-20 rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      />
    </motion.article>
  );
}
