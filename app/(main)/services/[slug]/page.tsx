import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  ListChecks,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
import { SectionHeader } from "@/components/SectionHeader";
import ServiceFeatureCards from "@/components/services/ServiceFeatureCards";
import ServiceProjectsSection from "@/components/services/ServiceProjectsSection";
import {
  getPublishedServiceBySlug,
  getPublishedServices,
} from "@/lib/api/services";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const service = await getPublishedServiceBySlug(slug);

    const seo = service.seo;

    const title =
      seo?.metaTitle?.trim() || `${service.name} | Enviroshield`;

    const description =
      seo?.metaDescription?.trim() || service.description;

    const keywords = seo?.keywords?.filter(Boolean) ?? [];

    const defaultCanonical = `https://enviroshieldbd.com/services/${service.slug}`;

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

    const ogImage = seo?.ogImage?.trim() || service.primaryImage.url;

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
        type: "website",
        url: canonical,
        images: [
          {
            url: ogImage,
            alt: service.primaryImage.alt || service.name,
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
      title: "Service not found | Enviroshield",
      description:
        "The requested Enviroshield service could not be found.",
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
    const result = await getPublishedServices({
      page: 1,
      limit: 100,
    });

    return result.data.map((service) => ({
      slug: service.slug,
    }));
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* SHARED PIECES                                                              */
/* -------------------------------------------------------------------------- */

const imgClass =
  "object-cover transition-transform duration-[0.9s] ease-out group-hover:scale-[1.06]";

function PhotoFx() {
  return (
    <>
      <span
        className="pointer-events-none absolute inset-0 bg-navy/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[500%]"
        aria-hidden="true"
      />
    </>
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service;

  try {
    service = await getPublishedServiceBySlug(slug);
  } catch {
    notFound();
  }

  const benefits = [
    "Careful surface preparation",
    "Premium, low-odour materials",
    "Clean, respectful team",
    "Clear timeline and quote",
  ];

  const stepCount = service.process?.items?.length ?? 0;
  const benefitCount = service.benefits?.items?.length ?? 0;
  const projectCount = service.projects?.length ?? 0;

  // Only show the numbers this service actually has
  const stats = [
    stepCount > 0 && {
      value: stepCount,
      label: "Step process",
    },
    benefitCount > 0 && {
      value: benefitCount,
      label: "Key benefits",
    },
    projectCount > 0 && {
      value: projectCount,
      label: "Projects delivered",
    },
    {
      value: 17,
      suffix: "+",
      label: "Years of expertise",
    },
  ].filter(Boolean) as {
    value: number;
    suffix?: string;
    label: string;
  }[];

  const serviceUrl = `https://enviroshieldbd.com/services/${service.slug}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: serviceUrl,
    image: service.primaryImage.url,

    provider: {
      "@type": "Organization",
      "@id": "https://enviroshieldbd.com/#organization",
      name: "Enviroshield",
      url: "https://enviroshieldbd.com",
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${serviceUrl}#webpage`,
      url: serviceUrl,
      name: service.name,
    },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${serviceUrl}#webpage`,
    url: serviceUrl,
    name: service.name,
    description: service.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://enviroshieldbd.com/#website",
      url: "https://enviroshieldbd.com",
      name: "Enviroshield",
    },
    about: {
      "@id": `${serviceUrl}#service`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${serviceUrl}#breadcrumb`,
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
        name: "Services",
        item: "https://enviroshieldbd.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: serviceUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
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
          service.isFeatured ? "FEATURED SERVICE" : "OUR SERVICES"
        }
        title={service.name}
        text={service.description}
        image={service.primaryImage.url}
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
            <ChevronRight size={14} aria-hidden="true" className="text-ink/40" />
            <li>
              <Link
                href="/services"
                className="transition-colors hover:text-blue"
              >
                Services
              </Link>
            </li>
            <ChevronRight size={14} aria-hidden="true" className="text-ink/40" />
            <li aria-current="page" className="font-semibold text-navy">
              {service.name}
            </li>
          </ol>
        </Container>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* OVERVIEW                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="service-overview-heading"
        className="pb-[100px] pt-[112px] max-[900px]:pb-20 max-[900px]:pt-20 max-[600px]:pb-16 max-[600px]:pt-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[80px] max-[900px]:grid-cols-1 max-[900px]:gap-[60px]">
          <Reveal dir="image">
            <div className="relative pb-8 pr-6 max-[600px]:pr-0">
              <div className="group relative h-[560px] overflow-hidden rounded-[24px] max-[600px]:h-[380px]">
                <Image
                  src={service.primaryImage.url}
                  alt={service.primaryImage.alt || service.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  className={imgClass}
                />
                <PhotoFx />

                {/* caption, only if the service has one */}
                {service.primaryImage.caption && (
                  <span className="absolute inset-x-4 bottom-4 rounded-[14px] bg-navy/55 px-4 py-3 text-[12px] leading-[1.5] text-white ring-1 ring-white/20 backdrop-blur-xl">
                    {service.primaryImage.caption}
                  </span>
                )}
              </div>

              {/* floating badge: process steps */}
              {stepCount > 0 && (
                <div className="absolute left-5 top-5 flex items-center gap-3 rounded-[18px] bg-blue px-5 py-4 text-white shadow-[0_18px_36px_-10px_rgba(1,110,220,0.7)] max-[600px]:left-3 max-[600px]:top-3 max-[600px]:px-4 max-[600px]:py-3">
                  <ListChecks size={26} aria-hidden="true" />
                  <div>
                    <div className="text-[28px] font-extrabold leading-none tracking-[-0.04em] max-[600px]:text-[22px]">
                      {stepCount}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
                      Step process
                    </div>
                  </div>
                </div>
              )}

              {/* floating card: projects */}
              {projectCount > 0 && (
                <div className="absolute -bottom-0 right-0 flex items-center gap-3 rounded-[18px] border-[6px] border-white bg-navy px-5 py-4 text-white shadow-[0_20px_40px_-12px_rgba(0,51,78,0.45)] max-[600px]:right-3">
                  <Layers size={22} aria-hidden="true" className="text-paste" />
                  <div>
                    <div className="text-[22px] font-extrabold leading-none tracking-[-0.03em]">
                      {projectCount}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
                      {projectCount === 1 ? "Project" : "Projects"}
                    </div>
                  </div>
                </div>
              )}

              {/* dotted accent */}
              <span
                aria-hidden="true"
                className="absolute -left-6 bottom-16 -z-10 h-32 w-32 bg-[radial-gradient(circle,rgba(1,110,220,0.35)_1.5px,transparent_1.5px)] bg-[length:14px_14px] max-[600px]:hidden"
              />
            </div>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <SectionHeader
                eyebrow="OVERVIEW"
                title={service.detailHeading?.trim() || `About ${service.name}`}
                text={service.description}
                headingId="service-overview-heading"
              />

              <StaggerContainer className="mb-9 mt-8 grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                {benefits.map((benefit) => (
                  <StaggerItem
                    key={benefit}
                    className="flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3.5 text-[13px] font-medium text-navy shadow-[0_6px_18px_-10px_rgba(0,51,78,0.18)]"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue/10">
                      <CheckCircle2
                        size={16}
                        aria-hidden="true"
                        className="text-blue"
                      />
                    </span>
                    {benefit}
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div className="flex flex-wrap items-center gap-5">
                <Button href="/contact">Talk to an expert</Button>

                {projectCount > 0 && (
                  <Link
                    href="#service-projects"
                    className="inline-flex items-center gap-[7px] text-[13px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
                  >
                    See our work
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* HIGHLIGHTS BAND                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-label={`${service.name} at a glance`}
        className="pb-[100px] max-[900px]:pb-20 max-[600px]:pb-16"
      >
        <Container>
          <Reveal dir="up">
            <div className="relative overflow-hidden rounded-[28px] bg-navy px-12 py-12 max-[900px]:px-8 max-[900px]:py-10 max-[600px]:px-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue/30 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-paste/10 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:44px_44px]"
              />

              <div className="relative grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-y-10">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-l border-white/15 pl-7"
                  >
                    <div className="mb-3 text-[clamp(38px,4vw,58px)] font-extrabold leading-none tracking-[-0.05em] text-white">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                    <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-paste">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHY / PROCESS / BENEFITS (existing component)                      */}
      {/* ------------------------------------------------------------------ */}

      <ServiceFeatureCards
        whyEnviroshield={service.whyEnviroshield}
        process={service.process}
        benefits={service.benefits}
      />

      {/* ------------------------------------------------------------------ */}
      {/* PROJECTS (existing component)                                      */}
      {/* ------------------------------------------------------------------ */}

      <div id="service-projects" className="scroll-mt-24">
        <ServiceProjectsSection
          projects={service.projects}
          serviceName={service.name}
        />
      </div>

      <ContactSection />
    </>
  );
}