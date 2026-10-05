import { CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublishedProjectBySlug } from "@/lib/api/projects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  let project;

  try {
    project = await getPublishedProjectBySlug(slug);
  } catch {
    return {
      title: "Project not found | Enviroshield",
      description:
        "The requested Enviroshield project could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `https://enviroshieldbd.com/projects/${project.slug}`;

  const location = [
    project.location?.area,
    project.location?.city,
    project.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: `${project.title} | Enviroshield`,
    description: project.description,
    keywords: [
      project.title,
      project.serviceId?.name || "Enviroshield project",
      "Enviroshield projects",
      "Bangladesh construction projects",
      "waterproofing projects",
      "flooring projects",
      "protective coating projects",
    ],
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${project.title} | Enviroshield`,
      description: project.description,
      type: "article",
      url: canonical,
      images: [
        {
          url: project.primaryImage.url,
          alt: project.primaryImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Enviroshield`,
      description: project.description,
      images: [project.primaryImage.url],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  let project;

  try {
    project = await getPublishedProjectBySlug(slug);
  } catch {
    notFound();
  }

  const projectUrl = `https://enviroshieldbd.com/projects/${project.slug}`;

  const location = [
    project.location?.area,
    project.location?.city,
    project.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const serviceName =
    project.serviceId?.name || "Enviroshield Solution";

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#project`,
    name: project.title,
    description: project.description,
    url: projectUrl,
    image: project.primaryImage.url,
    creator: {
      "@type": "Organization",
      "@id": "https://enviroshieldbd.com/#organization",
      name: "Enviroshield",
      url: "https://enviroshieldbd.com",
    },
    locationCreated: {
      "@type": "Place",
      name: location,
    },
    about: {
      "@type": "Thing",
      name: serviceName,
    },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${projectUrl}#webpage`,
    url: projectUrl,
    name: project.title,
    description: project.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://enviroshieldbd.com/#website",
      url: "https://enviroshieldbd.com",
      name: "Enviroshield",
    },
    about: {
      "@id": `${projectUrl}#project`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${projectUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://enviroshieldbd.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://enviroshieldbd.com/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  const completionDate = new Date(
    project.completionDate,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const projectBenefits = [
    "Professional surface preparation",
    "Premium application materials",
    "Experienced installation team",
    "Durable long-term performance",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <PageHero
        eyebrow={
          project.isFeatured ? "FEATURED PROJECT" : "OUR PROJECTS"
        }
        title={project.title}
        text={project.description}
        image={project.primaryImage.url}
        imageAlt={project.primaryImage.alt}
      />

      <section
        aria-labelledby="project-overview-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
              <Image
                src={project.primaryImage.url}
                alt={project.primaryImage.alt}
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <SectionHeader
                eyebrow="PROJECT OVERVIEW"
                title="Built with purpose."
                text={project.description}
                headingId="project-overview-heading"
              />

              <div className="mb-[30px] grid gap-4">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-blue"
                  />

                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-navy">
                      Location
                    </p>

                    <p className="mt-1 text-[14px] leading-[1.6] text-ink">
                      {location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-blue"
                  />

                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-navy">
                      Completed
                    </p>

                    <p className="mt-1 text-[14px] leading-[1.6] text-ink">
                      {completionDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-blue"
                  />

                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-navy">
                      Service
                    </p>

                    <p className="mt-1 text-[14px] leading-[1.6] text-ink">
                      {serviceName}
                    </p>
                  </div>
                </div>
              </div>

              <StaggerContainer className="mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
                {projectBenefits.map((benefit) => (
                  <StaggerItem
                    key={benefit}
                    className="flex items-center gap-2 text-[13px] text-ink"
                  >
                    <CheckCircle2
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-blue"
                    />
                    {benefit}
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <Button href="/contact">Start a project</Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section
        aria-labelledby="project-details-heading"
        className="relative overflow-hidden bg-mist py-[120px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-180px] top-[100px] h-[420px] w-[420px] rounded-full bg-blue/5 blur-3xl"
        />

        <Container>
          <SectionHeader
            eyebrow="PROJECT DETAILS"
            title="The work behind the result."
            text={`A closer look at the ${serviceName.toLowerCase()} solution delivered for ${project.client.name}.`}
            headingId="project-details-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
            {[
              {
                number: "01",
                title: "Preparation",
                text: "The project begins with careful assessment and preparation of the existing surface.",
              },
              {
                number: "02",
                title: "Application",
                text: "The selected system is professionally installed using the appropriate materials and techniques.",
              },
              {
                number: "03",
                title: "Final result",
                text: "The completed surface is inspected to ensure a clean, durable, and high-quality finish.",
              },
            ].map((item) => (
              <StaggerItem key={item.number}>
                <article className="relative h-full rounded-[18px] border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,51,78,0.08)]">
                  <span className="mb-7 block text-[11px] font-extrabold tracking-[0.15em] text-blue">
                    {item.number}
                  </span>

                  <h3 className="mb-3 text-[22px] font-extrabold tracking-[-0.03em] text-navy">
                    {item.title}
                  </h3>

                  <p className="text-[14px] leading-[1.7] text-ink">
                    {item.text}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section
        aria-labelledby="project-gallery-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="PROJECT GALLERY"
            title="A closer look at the project."
            text="Explore selected views from this Enviroshield project."
            headingId="project-gallery-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-2 gap-5 max-[600px]:grid-cols-1">
            {project.gallery.map((image, index) => (
              <StaggerItem
                key={`${image.url}-${index}`}
                className={index === 0 ? "row-span-2" : ""}
              >
                <div
                  className={`relative overflow-hidden rounded-[18px] ${
                    index === 0
                      ? "h-[620px] max-[900px]:h-[500px] max-[600px]:h-[340px]"
                      : "h-[300px] max-[600px]:h-[280px]"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={
                      image.alt ||
                      `${project.title} — project image ${index + 1}`
                    }
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 600px) 100vw, 50vw"
                        : "(max-width: 600px) 100vw, 25vw"
                    }
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section
        aria-label="Project navigation"
        className="pb-[112px] max-[900px]:pb-20 max-[600px]:pb-16"
      >
        <Container>
          <Reveal dir="up">
            <div className="flex items-center justify-between gap-5 border-t border-line pt-8 max-[600px]:flex-col max-[600px]:items-start">
              <Link
                href="/projects"
                className="text-[13px] font-bold text-navy transition-colors hover:text-blue"
              >
                ← Back to all projects
              </Link>

              <Button href="/contact">Discuss your project</Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}
