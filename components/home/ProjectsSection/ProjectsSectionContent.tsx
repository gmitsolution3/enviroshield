"use client";

import { EASE, viewportOnce } from "@/components/animations/variants";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import type { IProject } from "@/types";
import { motion, useReducedMotion } from "motion/react";
import ProjectCard from "../../projects/ProjectCard";

interface ProjectsSectionContentProps {
  projects: IProject[];
}

const masonryHeights = [
  "h-[500px]",
  "h-[400px]",
  "h-[450px]",
  "h-[420px]",
  "h-[520px]",
  "h-[400px]",
  "h-[470px]",
  "h-[430px]",
  "h-[500px]",
] as const;

export default function ProjectsSectionContent({
  projects,
}: ProjectsSectionContentProps) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="projects-heading"
      className="bg-deep py-[112px] pb-[120px] max-[900px]:py-20 max-[900px]:pb-[120px] max-[600px]:py-16 max-[600px]:pb-[120px]"
    >
      <Container>
        <div className="mb-11 flex items-end justify-between max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[25px]">
          <SectionHeader
            eyebrow="OUR PROJECTS"
            title="Protection in action."
            text="Explore selected projects where our waterproofing, flooring, insulation, and protective construction solutions help buildings perform better and last longer."
            light
            headingId="projects-heading"
          />

          <Button href="/projects" variant="light">
            Explore our projects
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="columns-[320px] gap-[18px]">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                className={`mb-[18px] break-inside-avoid ${masonryHeights[index % masonryHeights.length]} max-[600px]:h-[400px]`}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: (index % 4) * 0.08,
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-12 text-center"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h3 className="text-2xl font-semibold text-white">
              Our project portfolio is being updated
            </h3>

            <p className="mt-3 max-w-[560px] text-sm leading-6 text-white/65">
              We&apos;re currently updating our featured projects.
              Explore our full portfolio to discover the protection
              and construction solutions we deliver across different
              applications.
            </p>

            <Button href="/projects" variant="light" className="mt-6">
              Explore our projects
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}