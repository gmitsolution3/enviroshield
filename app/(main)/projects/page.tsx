import { AnimatedCounter } from "@/components/animations/animated-counter";
import {
  Reveal,
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
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
      "waterproofing paint",
      "flooring projects",
      "epoxy flooring projects",
      "PU flooring projects",
      "heatproofing",
      "heat insulation projects",
      "injection grouting projects",
      "expansion joint sealing",
      "sports flooring",
      "polished concrete projects",
      "3D epoxy floor",
      "floor hardener",
      "ETP coating",
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
    limit: 12,
  });

  const projects = result.data;
  const total = result.meta.total;

  // Spotlight: first featured project, first page only
  const featured =
    page === 1 ? projects.find((p) => p.isFeatured) : undefined;

  const gridProjects = featured
    ? projects.filter((p) => p._id !== featured._id)
    : projects;

  const featuredLocation = featured
    ? [
        featured.location?.area,
        featured.location?.city,
        featured.location?.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const featuredDate = featured?.completionDate
    ? new Date(featured.completionDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const stats = [
    { value: total, suffix: "+", label: "Projects completed" },
    { value: 17, suffix: "+", label: "Years of experience" },
    { value: 99, suffix: "%", label: "Customer satisfaction" },
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR PROJECTS"
        title="Projects built to perform."
        text="Explore our completed waterproofing, flooring, insulation, and protective coating projects across residential, commercial, and industrial spaces."
        image="/images/service-hero.jpg"
        imageAlt="Enviroshield completed project"
      />

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                              */}
      {/* ------------------------------------------------------------------ */}

      {total > 0 && (
        <section
          aria-label="Projects at a glance"
          className="bg-blue text-white"
        >
          <Container>
            <div className="grid grid-cols-3 max-[700px]:grid-cols-1">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-l border-white/20 px-8 py-12 first:border-l-0 max-[700px]:border-l-0 max-[700px]:border-t max-[700px]:px-0 max-[700px]:py-8 max-[700px]:first:border-t-0"
                >
                  <div className="mb-2 text-[clamp(40px,4.4vw,60px)] font-extrabold leading-none tracking-[-0.05em]">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-[14px] text-white/80">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PROJECTS                                                           */}
      {/* ------------------------------------------------------------------ */}

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
              {/* Spotlight */}
              {featured && (
                <Reveal dir="up">
                  <Link
                    href={`/projects/${featured.slug}`}
                    aria-label={`View ${featured.title} project`}
                    className="group mt-12 grid grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-[20px] bg-navy max-[900px]:grid-cols-1"
                  >
                    <div className="relative min-h-[460px] overflow-hidden max-[900px]:aspect-[4/3] max-[900px]:min-h-0">
                      <Image
                        src={featured.primaryImage.url}
                        alt={
                          featured.primaryImage.alt ||
                          `${featured.title} project completed by Enviroshield`
                        }
                        fill
                        sizes="(max-width: 900px) 100vw, 55vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="flex flex-col justify-center p-12 max-[900px]:p-8 max-[600px]:p-6">
                      <div className="mb-5 flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
                        <span
                          className="h-[2px] w-7 bg-current"
                          aria-hidden="true"
                        />
                        FEATURED PROJECT
                      </div>

                      <h3 className="mb-4 text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
                        {featured.title}
                      </h3>

                      {featured.description && (
                        <p className="mb-6 line-clamp-4 text-[15px] leading-[1.75] text-white/70">
                          {featured.description}
                        </p>
                      )}

                      {(featuredLocation || featuredDate) && (
                        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[13px] text-white/75">
                          {featuredLocation && (
                            <span className="flex items-center gap-2">
                              <MapPin
                                size={15}
                                aria-hidden="true"
                                className="text-paste"
                              />
                              {featuredLocation}
                            </span>
                          )}
                          {featuredDate && (
                            <span className="flex items-center gap-2">
                              <CalendarDays
                                size={15}
                                aria-hidden="true"
                                className="text-paste"
                              />
                              {featuredDate}
                            </span>
                          )}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-[gap] duration-200 group-hover:gap-3">
                        View project
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Grid */}
              {gridProjects.length > 0 && (
                <>
                  {featured && (
                    <div className="mb-8 mt-16 flex items-end justify-between border-b border-line pb-4">
                      <h3 className="text-[24px] font-extrabold tracking-[-0.03em] text-navy">
                        More projects
                      </h3>
                      <span className="text-[14px] text-ink">
                        {total} in total
                      </span>
                    </div>
                  )}

                  <StaggerContainer
                    className={`columns-[320px] gap-[18px] ${
                      featured ? "" : "mt-12"
                    }`}
                  >
                    {gridProjects.map((project, index) => {
                      const height =
                        masonryHeights[index % masonryHeights.length];

                      return (
                        <StaggerItem
                          key={project._id}
                          className={`mb-[18px] break-inside-avoid ${height} max-[600px]:h-[400px]`}
                        >
                          <ProjectCard project={project} />
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </>
              )}

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
