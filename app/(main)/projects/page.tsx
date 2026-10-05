import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsPagination from "@/components/projects/ProjectsPagination";
import { getPublishedProjects } from "@/lib/api/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects | Enviroshield",
  description:
    "Explore Enviroshield's completed waterproofing, flooring, heat insulation, injection grouting, polished concrete, and protective coating projects across residential, commercial, and industrial spaces.",
  keywords: [
    "Enviroshield projects",
    "waterproofing projects",
    "flooring projects",
    "epoxy flooring projects",
    "protective coating projects",
    "heat insulation projects",
    "construction projects Bangladesh",
  ],
  alternates: {
    canonical: "/projects",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Our Projects | Enviroshield",
    description:
      "Explore Enviroshield's completed waterproofing, flooring, insulation, and protective coating projects.",
    type: "website",
    url: "/projects",
    images: [
      {
        url: "/images/service-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Enviroshield completed projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Projects | Enviroshield",
    description:
      "Explore Enviroshield's completed waterproofing, flooring, insulation, and protective coating projects.",
    images: ["/images/service-hero.jpg"],
  },
};

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  const result = await getPublishedProjects({
    page,
    limit: 10,
  });

  const projects = result.data;

  return (
    <>
      <PageHero
        eyebrow="OUR PROJECTS"
        title="Projects built to perform."
        text="Explore our completed waterproofing, flooring, insulation, and protective coating projects across residential, commercial, and industrial spaces."
        image="/images/service-hero.jpg"
        imageAlt="Enviroshield completed project"
      />

      <section
        aria-labelledby="projects-page-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="SELECTED WORK"
            title="Solutions brought to life."
            text="Take a look at some of the projects where Enviroshield's waterproofing, flooring, insulation, and protective coating solutions have been put into practice."
            headingId="projects-page-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-12 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {projects.map((project, index) => {
              const featured = index === 0;

              return (
                <StaggerItem
                  key={project._id}
                  className={
                    featured
                      ? "col-span-7 max-[900px]:col-span-2 max-[600px]:col-span-1"
                      : "col-span-5 max-[900px]:col-span-1 max-[600px]:col-span-1"
                  }
                >
                  <ProjectCard
                    project={project}
                  />
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <ProjectsPagination
            currentPage={result.meta.page}
            totalPages={result.meta.totalPages}
          />
        </Container>
      </section>

      <ContactSection />
    </>
  );
}