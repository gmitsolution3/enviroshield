import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Layers,
  MapPin,
} from "lucide-react";
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
import ProjectCard from "@/components/projects/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import {
  getPublishedProjectBySlug,
  getPublishedProjects,
} from "@/lib/api/projects";
import type { IProject } from "@/types";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const project = await getPublishedProjectBySlug(slug);

    const seo = project.seo;

    const title =
      seo?.metaTitle?.trim() || `${project.title} | Enviroshield`;

    const description =
      seo?.metaDescription?.trim() || project.description;

    const keywords = seo?.keywords?.filter(Boolean) ?? [];

    const defaultCanonical = `https://enviroshieldbd.com/projects/${project.slug}`;

    const canonical = (() => {
      const configuredCanonical = seo?.canonicalUrl?.trim();

      if (!configuredCanonical) {
        return defaultCanonical;
      }

      try {
        const parsed = new URL(
          configuredCanonical,
          "https://enviroshieldbd.com",
        );

        if (parsed.origin !== "https://enviroshieldbd.com") {
          return defaultCanonical;
        }

        return parsed.toString();
      } catch {
        return defaultCanonical;
      }
    })();

    const ogTitle = seo?.ogTitle?.trim() || title;

    const ogDescription = seo?.ogDescription?.trim() || description;

    const ogImage = seo?.ogImage?.trim() || project.primaryImage.url;

    return {
      title,
      description,
      keywords,

      alternates: {
        canonical,
      },

      robots: {
        index: seo?.noIndex !== true,
        follow: seo?.noIndex !== true,
      },

      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: "article",
        url: canonical,
        images: [
          {
            url: ogImage,
            alt: project.primaryImage.alt || project.title,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Project not found | Enviroshield",
      description:
        "The requested Enviroshield project could not be found.",
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }
}

export async function generateStaticParams() {
  try {
    const result = await getPublishedProjects({
      page: 1,
      limit: 100,
    });

    return result.data.map((project) => ({
      slug: project.slug,
    }));
  } catch {
    return [];
  }
}

const projectBenefits = [
  "Professional surface preparation",
  "Premium application materials",
  "Experienced installation team",
  "Durable long-term performance",
];

const steps = [
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
];

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

  const completionDate = project.completionDate
    ? new Date(project.completionDate).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const facts = [
    { icon: MapPin, label: "Location", value: location },
    { icon: CalendarDays, label: "Completed", value: completionDate },
    { icon: Layers, label: "Service", value: serviceName },
    { icon: Building2, label: "Client", value: project.client?.name },
  ].filter((fact) => Boolean(fact.value)) as {
    icon: typeof MapPin;
    label: string;
    value: string;
  }[];

  const gallery = project.gallery ?? [];

  // More projects: skip the current one
  let related: IProject[] = [];

  try {
    const result = await getPublishedProjects({ page: 1, limit: 4 });
    related = result.data
      .filter((item) => item._id !== project._id)
      .slice(0, 3);
  } catch {
    related = [];
  }

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

      {/* ------------------------------------------------------------------ */}
      {/* BREADCRUMB                                                         */}
      {/* ------------------------------------------------------------------ */}

      <nav
        aria-label="Breadcrumb"
        className="border-b border-line bg-white"
      >
        <Container>
          <ol className="flex flex-wrap items-center gap-1.5 py-4 text-[13px] text-ink">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-blue"
              >
                Home
              </Link>
            </li>
            <ChevronRight
              size={14}
              aria-hidden="true"
              className="text-ink/40"
            />
            <li>
              <Link
                href="/projects"
                className="transition-colors hover:text-blue"
              >
                Projects
              </Link>
            </li>
            <ChevronRight
              size={14}
              aria-hidden="true"
              className="text-ink/40"
            />
            <li
              aria-current="page"
              className="font-semibold text-navy"
            >
              {project.title}
            </li>
          </ol>
        </Container>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* OVERVIEW                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="project-overview-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[80px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[600px] overflow-hidden rounded-[16px] max-[600px]:h-[340px]">
              <Image
                src={project.primaryImage.url}
                alt={project.primaryImage.alt || project.title}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
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

              {/* Project details card */}
              {facts.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-[14px] border border-line bg-soft max-[600px]:grid-cols-1">
                  {facts.map((fact) => {
                    const Icon = fact.icon;

                    return (
                      <div
                        key={fact.label}
                        className="flex items-start gap-4 border-b border-r border-line p-5 [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 max-[600px]:border-r-0 max-[600px]:[&:nth-last-child(2)]:border-b"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-blue text-white">
                          <Icon size={19} aria-hidden="true" />
                        </span>

                        <div className="min-w-0">
                          <dt className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink/60">
                            {fact.label}
                          </dt>
                          <dd className="text-[15px] font-semibold leading-[1.4] text-navy">
                            {fact.value}
                          </dd>
                        </div>
                      </div>
                    );
                  })}
                </dl>
              )}

              <ul className="mb-12 mt-8 grid grid-cols-2 gap-x-6 gap-y-3 max-[600px]:grid-cols-1">
                {projectBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-[14px] text-navy"
                  >
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                      className="mt-px shrink-0 text-blue"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button href="/contact">Start a project</Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CLIENT (only if the project has client details)                    */}
      {/* ------------------------------------------------------------------ */}

      {project.client?.description && (
        <section
          aria-labelledby="project-client-heading"
          className="bg-soft py-[96px] max-[900px]:py-16"
        >
          <Container>
            <Reveal dir="up">
              <div className="grid grid-cols-[360px_1fr] items-stretch gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
                {/* Logo tile */}
                <div className="relative flex min-h-[300px] items-center justify-center rounded-[16px] border border-line bg-white p-10 max-[900px]:min-h-[220px]">
                  <span className="absolute left-0 top-0 rounded-br-[12px] rounded-tl-[16px] bg-blue px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
                    Our client
                  </span>

                  {project.client.logo?.url ? (
                    <div className="relative h-[120px] w-full max-w-[240px]">
                      <Image
                        src={project.client.logo.url}
                        alt={
                          project.client.logo.alt ||
                          project.client.name
                        }
                        fill
                        sizes="240px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-[110px] place-items-center rounded-full bg-navy text-[44px] font-extrabold text-white"
                    >
                      {project.client.name?.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Client details */}
                <div className="flex flex-col justify-center">
                  <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-ink/60">
                    Delivered for
                  </p>

                  <h2
                    id="project-client-heading"
                    className="mb-6 text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-navy"
                  >
                    {project.client.name}
                  </h2>

                  <p className="max-w-[680px] text-[18px] leading-[1.75] text-ink">
                    {project.client.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                    <p className="text-[14px] text-ink">
                      Service delivered:{" "}
                      <strong className="font-bold text-navy">
                        {serviceName}
                      </strong>
                    </p>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-[7px] text-[14px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
                    >
                      Start a similar project
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* THE WORK                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="project-details-heading"
        className="bg-navy py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="PROJECT DETAILS"
            title="The work behind the result."
            text={`A closer look at the ${serviceName.toLowerCase()} solution delivered${
              project.client?.name
                ? ` for ${project.client.name}`
                : ""
            }.`}
            light
            headingId="project-details-heading"
          />

          <StaggerContainer className="mt-14 grid grid-cols-3 gap-8 max-[900px]:grid-cols-1">
            {steps.map((item) => (
              <StaggerItem key={item.number}>
                <div className="h-full border-t-2 border-blue pt-6">
                  <span className="mb-10 block text-[64px] font-extrabold leading-none tracking-[-0.05em] text-white">
                    {item.number}
                  </span>

                  <h3 className="mb-3 text-[22px] font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="text-[14px] leading-[1.7] text-white/65">
                    {item.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* GALLERY                                                            */}
      {/* ------------------------------------------------------------------ */}

      {gallery.length > 0 && (
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

            <StaggerContainer className="mt-12 grid auto-rows-[260px] grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:auto-rows-[240px]">
              {gallery.map((image, index) => {
                const large = index === 0 && gallery.length > 2;

                return (
                  <StaggerItem
                    key={`${image.url}-${index}`}
                    className={
                      large
                        ? "col-span-2 row-span-2 max-[600px]:col-span-1 max-[600px]:row-span-1"
                        : ""
                    }
                  >
                    <div className="relative h-full overflow-hidden rounded-[14px] bg-mist">
                      <Image
                        src={image.url}
                        alt={
                          image.alt ||
                          `${project.title} — project image ${index + 1}`
                        }
                        fill
                        sizes={
                          large
                            ? "(max-width: 600px) 100vw, 66vw"
                            : "(max-width: 600px) 100vw, 33vw"
                        }
                        className="object-cover"
                      />
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MORE PROJECTS                                                      */}
      {/* ------------------------------------------------------------------ */}

      {related.length > 0 && (
        <section
          aria-labelledby="more-projects-heading"
          className="bg-soft py-[112px] max-[900px]:py-20 max-[600px]:py-16"
        >
          <Container>
            <div className="mb-12 flex items-end justify-between gap-6 max-[600px]:flex-col max-[600px]:items-start">
              <SectionHeader
                eyebrow="KEEP EXPLORING"
                title="More projects."
                headingId="more-projects-heading"
              />

              <Link
                href="/projects"
                className="inline-flex shrink-0 items-center gap-[7px] text-[14px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
              >
                View all projects
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <StaggerContainer className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
              {related.map((item) => (
                <StaggerItem key={item._id} className="h-[440px]">
                  <ProjectCard project={item} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      <ContactSection />
    </>
  );
}
