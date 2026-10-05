import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { IProject } from "@/types/admin/project.type";

interface ProjectCardProps {
  project: IProject;
  featured?: boolean;
}

export default function ProjectCard({
  project,
  featured = false,
}: ProjectCardProps) {
  const location = [
    project.location?.area,
    project.location?.city,
    project.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <article
        className={`relative overflow-hidden rounded-[18px] bg-navy ${
          featured
            ? "min-h-[540px] max-[900px]:min-h-[460px]"
            : "min-h-[420px]"
        }`}
      >
        {/* Project image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={project.primaryImage.url}
            alt={
              project.primaryImage.alt ||
              `${project.title} project completed by Enviroshield`
            }
            fill
            sizes={
              featured
                ? "(max-width: 900px) 100vw, 58vw"
                : "(max-width: 900px) 50vw, 42vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        {/* Gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,51,78,0.05)_15%,rgba(0,18,33,0.9)_100%)]"
        />

        {/* Top information */}
        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-navy/60 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            <span className="size-[6px] rounded-full bg-paste" />
            {project.isFeatured ? "FEATURED PROJECT" : "PROJECT"}
          </span>

          <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-blue">
            <ArrowUpRight
              size={18}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-7 max-[600px]:p-6">
          <div className="relative">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-paste">
              {project.serviceId?.name || "PROJECT"}
            </p>

            <h2
              className={`font-extrabold leading-[1.05] tracking-[-0.045em] text-white ${
                featured
                  ? "text-[clamp(30px,4vw,48px)]"
                  : "text-[28px]"
              }`}
            >
              {project.title}
            </h2>

            <span
              aria-hidden="true"
              className="mt-3 block h-[2px] w-[28px] rounded-full bg-paste transition-all duration-500 group-hover:w-[64px] group-hover:bg-blue"
            />

            <p className="mt-3 max-w-[620px] text-[13px] leading-[1.7] text-white/75">
              {project.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-4">
              {location && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/75">
                  <MapPin size={13} aria-hidden="true" />
                  {location}
                </span>
              )}

              {project.completionDate && (
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/75">
                  <CalendarDays size={13} aria-hidden="true" />

                  {new Date(
                    project.completionDate,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
