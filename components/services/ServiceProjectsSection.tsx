"use client";

import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import type { IProject } from "@/types/admin/project.type";

type ServiceProjectsSectionProps = {
  projects: IProject[];
  serviceName: string;
};

export default function ServiceProjectsSection({
  projects,
  serviceName,
}: ServiceProjectsSectionProps) {
  const reduce = useReducedMotion();

  if (!projects?.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="service-projects-heading"
      className="relative overflow-hidden bg-white py-[120px] max-[900px]:py-20 max-[600px]:py-16"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-220px] left-[-180px] h-[480px] w-[480px] rounded-full bg-deep/5 blur-3xl"
      />

      <Container>
        {/* Header */}
        <div className="mb-12 flex items-end justify-between gap-10 max-[900px]:flex-col max-[900px]:items-start">
          <SectionHeader
            eyebrow="SELECTED WORK"
            title={`Projects shaped through ${serviceName.toLowerCase()}`}
            text="Explore some of the projects where this service has been put into practice."
            headingId="service-projects-heading"
          />

          <div
            aria-hidden="true"
            className="hidden h-[1px] flex-1 bg-white/10 max-[900px]:hidden"
          />
        </div>

        {/* Projects */}
        <StaggerContainer className="grid grid-cols-12 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {projects.map((project, index) => {
            const location = [
              project.location?.area,
              project.location?.city,
              project.location?.country,
            ]
              .filter(Boolean)
              .join(", ");

            const completionDate = project.completionDate
              ? new Date(project.completionDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    year: "numeric",
                  },
                )
              : null;

            const isFeatured = index === 0;

            return (
              <StaggerItem
                key={project._id}
                className={
                  isFeatured
                    ? "col-span-7 max-[900px]:col-span-2 max-[600px]:col-span-1"
                    : "col-span-5"
                }
              >
                <ProjectItem
                  project={project}
                  location={location}
                  completionDate={completionDate}
                  featured={isFeatured}
                  reduce={reduce}
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}

function ProjectItem({
  project,
  location,
  completionDate,
  featured,
  reduce,
}: {
  project: IProject;
  location: string;
  completionDate: string | null;
  featured: boolean;
  reduce: boolean | null;
}) {
  return (
    <motion.article
      className={`group relative isolate overflow-hidden rounded-[24px] border border-line bg-navy shadow-[0_10px_40px_rgba(0,51,78,0.07)] transition-shadow duration-500 hover:shadow-[0_24px_48px_-12px_rgba(1,110,220,0.35)] ${
        featured
          ? "min-h-[540px] max-[900px]:min-h-[460px]"
          : "min-h-[420px]"
      }`}
      whileHover={reduce ? undefined : { y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Image */}
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
          sizes={
            featured
              ? "(max-width: 900px) 100vw, 58vw"
              : "(max-width: 900px) 50vw, 42vw"
          }
          className="object-cover"
        />
      </motion.div>

      {/* Gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,51,78,0.05)_15%,rgba(0,18,33,0.88)_100%)]"
      />

      {/* Inner hairline ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15"
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

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-7 max-[600px]:p-6">
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

        <div className="relative">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-paste transition-colors duration-500 group-hover:text-blue">
            {project.title}
          </p>

          <h3
            className={`font-extrabold leading-[1.05] tracking-[-0.045em] text-white transition-colors duration-500 group-hover:text-navy ${
              featured ? "text-[clamp(30px,4vw,48px)]" : "text-[28px]"
            }`}
          >
            {project.title}
          </h3>

          {/* Accent line grows on hover */}
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
  );
}