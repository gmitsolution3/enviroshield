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
      className="group block h-full rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      aria-label={`View ${project.title} project`}
    >
      <motion.article
        className="relative isolate h-full overflow-hidden rounded-[24px] bg-mist shadow-[0_10px_30px_rgba(0,18,33,0.12)] transition-shadow duration-500 hover:shadow-[0_28px_56px_-14px_rgba(1,110,220,0.45)]"
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Full-bleed photo, no overlay */}
        <Image
          src={project.primaryImage.url}
          alt={
            project.primaryImage.alt ||
            `${project.title} project completed by Enviroshield`
          }
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />

        {/* diagonal shine on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[500%] motion-reduce:hidden"
        />

        {/* Featured tag, top-left corner */}
        {isFeatured && (
          <span className="absolute left-0 top-0 rounded-br-[16px] bg-blue px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
            Featured
          </span>
        )}

        {/* Caption tab, cut into the bottom-left corner */}
        <div className="absolute bottom-0 left-0 w-[calc(100%-72px)] rounded-tr-[24px] bg-white px-6 pb-6 pt-5 transition-colors duration-300 group-hover:bg-navy max-[600px]:px-5 max-[600px]:pb-5">
          {location && (
            <p className="mb-2 flex items-center gap-1.5 text-[12px] font-bold text-blue transition-colors duration-300 group-hover:text-paste">
              <MapPin
                size={13}
                aria-hidden="true"
                className="shrink-0"
              />
              <span className="line-clamp-1">{location}</span>
            </p>
          )}

          <h3 className="line-clamp-2 text-[22px] font-extrabold leading-[1.15] tracking-[-0.03em] text-navy transition-colors duration-300 group-hover:text-white">
            {project.title}
          </h3>

          {completionDate && (
            <p className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-ink/70 transition-colors duration-300 group-hover:text-white/70">
              <CalendarDays
                size={13}
                aria-hidden="true"
                className="shrink-0"
              />
              Completed {completionDate}
            </p>
          )}
        </div>

        {/* Arrow tab, cut into the bottom-right corner */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 grid size-[72px] place-items-center rounded-tl-[24px] bg-blue text-white transition-colors duration-300 group-hover:bg-white group-hover:text-navy"
        >
          <ArrowUpRight
            size={24}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </span>
      </motion.article>
    </Link>
  );
}
