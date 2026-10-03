import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
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

      <section
        aria-labelledby="service-overview-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
              <Image
                src={service.primaryImage.url}
                alt={service.primaryImage.alt || service.name}
                fill
                sizes="45vw"
              />
            </div>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <SectionHeader
                eyebrow="OVERVIEW"
                title={`About ${service.name}`}
                text={service.description}
                headingId="service-overview-heading"
              />

              <StaggerContainer className="mt-[26px] mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
                {benefits.map((benefit) => (
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

              <Button href="/contact">Talk to an expert</Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <ServiceFeatureCards
        whyEnviroshield={service.whyEnviroshield}
        process={service.process}
        benefits={service.benefits}
      />

      <ServiceProjectsSection
        projects={service.projects}
        serviceName={service.name}
      />

      <ContactSection />
    </>
  );
}
