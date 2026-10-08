"use client";

import { IProject } from "@/types";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({
  project,
}: {
  project: IProject;
}) {
  const reduce = useReducedMotion();

  const location = [
    project?.location?.area,
    project?.location?.city,
    project?.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const completionDate = project?.completionDate
    ? new Date(project.completionDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const isFeatured = project?.isFeatured;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block h-full rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      aria-label={`View ${project.title} project`}
    >
      <motion.article
        className="relative isolate h-full overflow-hidden rounded-[28px] bg-navy shadow-[0_10px_30px_rgba(0,18,33,0.2)] ring-1 ring-inset ring-white/10 transition-shadow duration-500 hover:shadow-[0_28px_56px_-14px_rgba(1,110,220,0.5)]"
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Full-bleed photo */}
        <Image
          src={project.primaryImage.url}
          alt={
            project.primaryImage.alt ||
            `${project.title} project completed by Enviroshield`
          }
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />

        {/* shade: top for the badges, bottom for the panel */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,18,33,0.4)_0%,transparent_28%,transparent_45%,rgba(0,18,33,0.7)_100%)] transition-opacity duration-500 group-hover:opacity-90"
        />

        {/* diagonal shine on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[500%] motion-reduce:hidden"
        />

        {/* Top row */}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          {isFeatured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-navy shadow-sm">
              <span
                className="size-[6px] rounded-full bg-blue"
                aria-hidden="true"
              />
              Featured
            </span>
          ) : (
            <span />
          )}

          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full bg-white/20 text-white ring-1 ring-white/30 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-white group-hover:text-navy"
          >
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </span>
        </div>

        {/* Floating glass info panel */}
        <div className="absolute inset-x-3 bottom-3 rounded-[22px] bg-navy/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/20 backdrop-blur-xl transition-colors duration-500 group-hover:bg-navy/65 max-[600px]:p-4">
          <h3 className="line-clamp-2 text-[22px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white">
            {project.title}
          </h3>

          {/* accent line grows on hover */}
          <span
            aria-hidden="true"
            className="mt-3 block h-[2px] w-7 rounded-full bg-paste transition-all duration-500 group-hover:w-16"
          />

          {/* description: collapsed until hover/focus (always open on touch) */}
          {project.description && (
            <div
              className="
                grid grid-rows-[0fr]
                transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]
                [@media(hover:none)]:grid-rows-[1fr]
                motion-reduce:transition-none
              "
            >
              <div className="min-h-0 overflow-hidden">
                <p
                  className="
                    line-clamp-3 pt-3 text-[13px] leading-[1.6] text-white/75
                    opacity-0 translate-y-2
                    transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-100
                    group-focus-visible:translate-y-0 group-focus-visible:opacity-100
                    [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100
                    motion-reduce:transition-none
                  "
                >
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {(location || completionDate) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/15 pt-3 text-[11px] font-medium text-white/80">
              {location && (
                <span className="flex min-w-0 items-center gap-1.5">
                  <MapPin
                    size={13}
                    aria-hidden="true"
                    className="shrink-0 text-paste"
                  />
                  <span className="line-clamp-1">{location}</span>
                </span>
              )}

              {completionDate && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays
                    size={13}
                    aria-hidden="true"
                    className="shrink-0 text-paste"
                  />
                  {completionDate}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}
