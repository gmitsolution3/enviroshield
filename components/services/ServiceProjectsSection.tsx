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

const masonryHeights = [
  "h-[560px]",
  "h-[390px]",
  "h-[470px]",
  "h-[430px]",
  "h-[580px]",
  "h-[380px]",
  "h-[500px]",
  "h-[420px]",
  "h-[540px]",
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

        <StaggerContainer className="columns-3 gap-5 max-[900px]:columns-2 max-[600px]:columns-1">
          {projects.map((project, index) => {
            const height = masonryHeights[index % masonryHeights.length];

            return (
              <StaggerItem
                key={project._id}
                className={`mb-5 break-inside-avoid ${height}`}
              >
                <ProjectCard project={project} />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}