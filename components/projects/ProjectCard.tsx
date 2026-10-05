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
      className="group block h-full"
      aria-label={`View ${project.title} project`}
    >
      <motion.article
        className="relative isolate h-full min-h-0 overflow-hidden rounded-[24px] bg-navy shadow-[0_10px_40px_rgba(0,51,78,0.07)] transition-shadow duration-500 hover:shadow-[0_24px_48px_-12px_rgba(1,110,220,0.35)]"
        whileHover={reduce ? undefined : { y: -8 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Image
            src={project.primaryImage.url}
            alt={
              project.primaryImage.alt ||
              `${project.title} project completed by Enviroshield`
            }
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,51,78,0.05)_15%,rgba(0,18,33,0.88)_100%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15"
        />

        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-navy/60 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            <span className="size-[6px] rounded-full bg-paste" />
            {isFeatured ? "Featured PROJECT" : "PROJECT"}
          </span>

          <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-blue/70 text-white backdrop-blur-lg transition-all duration-300 group-hover:bg-blue">
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-7 max-[600px]:p-6">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -top-[52px] bottom-0 bg-blue transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:polygon(0_100%,100%_100%,100%_100%,0_100%)] group-hover:[clip-path:polygon(0_46px,100%_0,100%_100%,0_100%)]"
          />

          <span
            aria-hidden="true"
            className="absolute inset-x-0 -top-[40px] bottom-0 bg-white transition-[clip-path] delay-75 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:polygon(0_100%,100%_100%,100%_100%,0_100%)] group-hover:[clip-path:polygon(0_40px,100%_0,100%_100%,0_100%)]"
          />

          <div className="relative">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-paste transition-colors duration-500 group-hover:text-blue">
              {project.title}
            </p>

            <h3 className="text-[clamp(28px,3.5vw,48px)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white transition-colors duration-500 group-hover:text-navy">
              {project.title}
            </h3>

            <span
              aria-hidden="true"
              className="mt-3 block h-[2px] w-[28px] rounded-full bg-paste transition-all duration-500 group-hover:w-[64px] group-hover:bg-blue"
            />

            {project.description && (
              <p className="mt-3 max-w-[620px] text-[13px] leading-[1.7] text-white/75 transition-colors duration-500 group-hover:text-ink/75">
                {project.description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-4 transition-colors duration-500 group-hover:border-line">
              {location && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/75 transition-colors duration-500 group-hover:text-ink/70">
                  <MapPin size={13} aria-hidden="true" />
                  {location}
                </span>
              )}

              {completionDate && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/75 transition-colors duration-500 group-hover:text-ink/70">
                  <CalendarDays size={13} aria-hidden="true" />
                  {completionDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
