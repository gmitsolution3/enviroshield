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

const projects = [
  {
    slug: "dhaka-corporate-office-waterproofing",
    title: "Dhaka Corporate Office Waterproofing",
    description:
      "Complete roof and terrace waterproofing solution for a large commercial office facility.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Commercial office building project",
    location: "Gulshan, Dhaka, Bangladesh",
    service: "Waterproofing Solution",
    completionDate: "2026-02-01",
    client: "Dhaka Corporate Office",
    featured: true,
    gallery: [
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
  {
    slug: "premium-residential-epoxy-flooring",
    title: "Premium Residential Epoxy Flooring",
    description:
      "Seamless decorative epoxy flooring designed for a premium residential interior.",
    image:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Premium residential flooring project",
    location: "Banani, Dhaka, Bangladesh",
    service: "Epoxy Flooring",
    completionDate: "2026-01-01",
    client: "Private Residence",
    featured: false,
    gallery: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
  {
    slug: "industrial-floor-protection",
    title: "Industrial Floor Protection",
    description:
      "Heavy-duty floor protection system engineered for demanding industrial conditions.",
    image:
      "https://images.pexels.com/photos/4481327/pexels-photo-4481327.jpeg?auto=compress&cs=tinysrgb&w=1600",
    imageAlt: "Industrial floor protection project",
    location: "Patenga, Chattogram, Bangladesh",
    service: "Floor Hardener",
    completionDate: "2025-11-01",
    client: "Industrial Facility",
    featured: false,
    gallery: [
      "https://images.pexels.com/photos/4481327/pexels-photo-4481327.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1600",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
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

  return {
    title: `${project.title} | Enviroshield`,
    description: project.description,
    keywords: [
      project.title,
      project.service,
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
          url: project.image,
          alt: project.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Enviroshield`,
      description: project.description,
      images: [project.image],
    },
  };
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const projectUrl = `https://enviroshieldbd.com/projects/${project.slug}`;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#project`,
    name: project.title,
    description: project.description,
    url: projectUrl,
    image: project.image,
    creator: {
      "@type": "Organization",
      "@id": "https://enviroshieldbd.com/#organization",
      name: "Enviroshield",
      url: "https://enviroshieldbd.com",
    },
    locationCreated: {
      "@type": "Place",
      name: project.location,
    },
    about: {
      "@type": "Thing",
      name: project.service,
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
          project.featured ? "FEATURED PROJECT" : "OUR PROJECTS"
        }
        title={project.title}
        text={project.description}
        image={project.image}
        imageAlt={project.imageAlt}
      />

      <section
        aria-labelledby="project-overview-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
              <Image
                src={project.image}
                alt={project.imageAlt}
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
                      {project.location}
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
                      {project.service}
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
            text={`A closer look at the ${project.service.toLowerCase()} solution delivered for ${project.client}.`}
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
                key={image}
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
                    src={image}
                    alt={`${project.title} — project image ${index + 1}`}
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
