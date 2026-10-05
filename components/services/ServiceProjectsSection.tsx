"use client";

import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ProjectCard from "@/components/projects/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { IProject } from "@/types/admin/project.type";

type ServiceProjectsSectionProps = {
  projects: IProject[];
  serviceName: string;
};

const collageLayouts = [
  // Big left
  "col-span-7 row-span-2 min-h-[540px] max-[900px]:col-span-2 max-[900px]:row-span-2 max-[600px]:col-span-1 max-[600px]:row-span-1 max-[600px]:min-h-[420px]",

  // Small right — top
  "col-span-5 min-h-[260px] max-[900px]:col-span-1 max-[600px]:col-span-1 max-[600px]:min-h-[420px]",

  // Small right — bottom
  "col-span-5 min-h-[260px] max-[900px]:col-span-1 max-[600px]:col-span-1 max-[600px]:min-h-[420px]",

  // Small left — top
  "col-span-5 min-h-[260px] max-[900px]:col-span-1 max-[600px]:col-span-1 max-[600px]:min-h-[420px]",

  // Small left — bottom
  "col-span-5 min-h-[260px] max-[900px]:col-span-1 max-[600px]:col-span-1 max-[600px]:min-h-[420px]",

  // Big right
  "col-span-7 row-span-2 min-h-[540px] max-[900px]:col-span-2 max-[900px]:row-span-2 max-[600px]:col-span-1 max-[600px]:row-span-1 max-[600px]:min-h-[420px]",
] as const;

export default function ServiceProjectsSection({
  projects,
  serviceName,
}: ServiceProjectsSectionProps) {
  if (!projects?.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="service-projects-heading"
      className="relative overflow-hidden bg-white py-[120px] max-[900px]:py-20 max-[600px]:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-220px] left-[-180px] h-[480px] w-[480px] rounded-full bg-deep/5 blur-3xl"
      />

      <Container>
        <div className="mb-12 flex items-end justify-between gap-10 max-[900px]:flex-col max-[900px]:items-start">
          <SectionHeader
            eyebrow="SELECTED WORK"
            title={`Projects shaped through ${serviceName.toLowerCase()}`}
            text="Explore some of the projects where this service has been put into practice."
            headingId="service-projects-heading"
          />
        </div>

        <StaggerContainer className="grid grid-cols-12 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {projects.map((project, index) => {
            const className =
              collageLayouts[index % collageLayouts.length];

            return (
              <StaggerItem key={project._id} className={className}>
                <ProjectCard project={project} />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
