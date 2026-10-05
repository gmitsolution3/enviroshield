import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsPagination from "@/components/projects/ProjectsPagination";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublishedProjects } from "@/lib/api/projects";
import type { Metadata } from "next";

type ProjectsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: ProjectsPageProps): Promise<Metadata> {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  const isFirstPage = page === 1;

  const title = isFirstPage
    ? "Our Projects | Enviroshield"
    : `Our Projects — Page ${page} | Enviroshield`;

  const description = isFirstPage
    ? "Explore Enviroshield's completed waterproofing, flooring, heat insulation, injection grouting, polished concrete, and protective coating projects across residential, commercial, and industrial spaces."
    : `Explore more of Enviroshield's completed waterproofing, flooring, insulation, and protective coating projects on page ${page}.`;

  const canonical = isFirstPage
    ? "/projects"
    : `/projects?page=${page}`;

  return {
    title,
    description,

    keywords: [
      "Enviroshield projects",
      "waterproofing projects",
      "waterproofing projects Bangladesh",
      "flooring projects",
      "epoxy flooring projects",
      "PU flooring projects",
      "heat insulation projects",
      "injection grouting projects",
      "polished concrete projects",
      "protective coating projects",
      "construction projects Bangladesh",
    ],

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: [
        {
          url: "/images/service-hero.jpg",
          width: 1200,
          height: 630,
          alt: "Enviroshield completed waterproofing, flooring and protective coating projects",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/service-hero.jpg"],
    },
  };
}

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

          {projects.length > 0 ? (
            <>
              <StaggerContainer className="mt-12 columns-3 gap-5 max-[900px]:columns-2 max-[600px]:columns-1">
                {projects.map((project, index) => {
                  const height =
                    masonryHeights[index % masonryHeights.length];

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

              <ProjectsPagination
                currentPage={result.meta.page}
                totalPages={result.meta.totalPages}
              />
            </>
          ) : (
            <div className="mt-12 rounded-[18px] border border-line bg-mist px-6 py-16 text-center max-[600px]:px-5 max-[600px]:py-12">
              <h3 className="text-[28px] font-extrabold tracking-[-0.03em] text-navy max-[600px]:text-[24px]">
                No projects available
              </h3>

              <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-[1.7] text-ink">
                We&apos;re currently updating our project portfolio.
                Please check back soon or contact our team if you need
                assistance.
              </p>

              <div className="mt-7">
                <Button href="/contact">Talk to our team</Button>
              </div>
            </div>
          )}
        </Container>
      </section>

      <ContactSection />
    </>
  );
}
