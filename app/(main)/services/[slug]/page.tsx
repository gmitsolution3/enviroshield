import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimatedCounter } from "@/components/animations/animated-counter";
import { Reveal } from "@/components/animations/reveal";
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
            <ChevronRight
              size={14}
              aria-hidden="true"
              className="text-ink/40"
            />
            <li>
              <Link
                href="/services"
                className="transition-colors hover:text-blue"
              >
                Services
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
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[80px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <figure>
              <div className="relative h-[520px] overflow-hidden rounded-[16px] max-[600px]:h-[340px]">
                <Image
                  src={service.primaryImage.url}
                  alt={service.primaryImage.alt || service.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>

              {service.primaryImage.caption && (
                <figcaption className="mt-3 text-[13px] leading-[1.6] text-ink/70">
                  {service.primaryImage.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <SectionHeader
                eyebrow="OVERVIEW"
                title={
                  service.detailHeading?.trim() ||
                  `About ${service.name}`
                }
                text={service.description}
                headingId="service-overview-heading"
              />

              <ul className="mb-9 mt-8 divide-y divide-line border-y border-line">
                {benefits.map((benefit) => (
                  <>
                    <li
                      key={benefit}
                      className="flex items-center gap-3 py-3.5 text-[15px] font-medium text-navy"
                    >
                      <span
                        className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-bold bg-blue/10 text-blue`}
                      >
                        <Check
                          size={18}
                          aria-hidden="true"
                          className="shrink-0 text-blue"
                        />
                      </span>
                      {benefit}
                    </li>
                  </>
                ))}
              </ul>

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
      {/* HIGHLIGHTS                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-label={`${service.name} at a glance`}
        className="bg-blue text-white"
      >
        <Container>
          <div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-l border-white/20 px-8 py-14 first:border-l-0 max-[900px]:border-b max-[900px]:[&:nth-child(odd)]:border-l-0 max-[600px]:border-l-0 max-[600px]:px-0 max-[600px]:py-8"
              >
                <div className="mb-2 text-[clamp(42px,4.6vw,64px)] font-extrabold leading-none tracking-[-0.05em]">
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
