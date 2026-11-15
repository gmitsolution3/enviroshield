import { AnimatedCounter } from "@/components/animations/animated-counter";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import ServiceCard from "@/components/services/ServiceCard";
import ServicesPagination from "@/components/services/ServicesPagination";
import { getPublishedServices } from "@/lib/api/services";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

type ServicesPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: ServicesPageProps): Promise<Metadata> {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  const isFirstPage = page === 1;

  const title = isFirstPage
    ? "Waterproofing, Flooring & Protective Coating Services | Enviroshield"
    : `Waterproofing, Flooring & Protective Coating Services — Page ${page} | Enviroshield`;

  const description = isFirstPage
    ? "Explore Enviroshield's waterproofing, waterproofing paint, heatproofing, epoxy and PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floors, floor hardeners, and ETP coating in Bangladesh."
    : `Explore more of Enviroshield's waterproofing, flooring, heatproofing, grouting, and protective coating services on page ${page}.`;

  const canonical = isFirstPage
    ? `${siteUrl}/services`
    : `${siteUrl}/services?page=${page}`;

  return {
    title,
    description,

    keywords: [
      "waterproofing",
      "waterproofing solutions",
      "waterproofing services",
      "waterproofing paint",
      "heatproofing",
      "heat insulation",
      "epoxy flooring",
      "PU flooring",
      "injection grouting",
      "expansion joint sealing",
      "sports flooring",
      "polished concrete",
      "3D epoxy floor",
      "3D epoxy flooring",
      "floor hardener",
      "ETP coating",
      "ETP protective coating",
      "Enviroshield",
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
          alt: "Enviroshield waterproofing, flooring and protective coating services",
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

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1,
  );

  const result = await getPublishedServices({
    page,
    limit: 12,
  });

  const services = result.data;
  const total = result.meta.total;

  const stats = [
    { value: total, label: "Services offered" },
    { value: 17, suffix: "+", label: "Years of experience" },
    { value: 500, suffix: "+", label: "Projects completed" },
    { value: 99, suffix: "%", label: "Customer satisfaction" },
  ];

  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="Professional waterproofing, flooring & protective coating solutions."
        text="Our core services include waterproofing, waterproofing paint, heatproofing, epoxy flooring, PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floors, floor hardener, and ETP coating for residential, commercial, and industrial properties."
        image="/images/service-hero.jpg"
      />

      {/* STATS */}
      {total > 0 && (
        <section
          aria-label="Services at a glance"
          className="bg-blue text-white"
        >
          <Container>
            <div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-l border-white/20 px-8 py-12 first:border-l-0 max-[900px]:border-b max-[900px]:[&:nth-child(odd)]:border-l-0 max-[600px]:border-l-0 max-[600px]:px-0 max-[600px]:py-8"
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

      {/* SERVICES */}
      <section
        aria-labelledby="services-page-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow="WHAT WE DO"
              title="Complete waterproofing, flooring & protective coating solutions"
              text="Explore our 12 core services: waterproofing, waterproofing paint, heatproofing, epoxy flooring, PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floor, floor hardener, and ETP coating."
              headingId="services-page-heading"
            />

            {services.length > 0 && (
              <span className="mb-6 inline-flex shrink-0 items-center rounded-full border border-line bg-mist/80 px-4 py-1.5 text-xs font-semibold text-ink/80">
                Showing{" "}
                <strong className="mx-1 font-bold text-navy">
                  {services.length}
                </strong>{" "}
                {services.length === 1 ? "service" : "services"} out of{" "}
                <strong className="mx-1 font-bold text-navy">
                  {total}
                </strong>{" "}
                {total === 1 ? "service" : "services"}
              </span>
            )}
          </div>

          {services.length > 0 ? (
            <>
              <StaggerContainer
                key={`services-grid-page-${page}`}
                className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[22px]"
              >
                {services.map((service, index) => (
                  <StaggerItem key={service._id}>
                    <ServiceCard
                      service={service}
                      index={index}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* PAGINATION */}
              <ServicesPagination
                currentPage={result.meta.page}
                totalPages={result.meta.totalPages}
              />
            </>
          ) : (
            <div className="mt-12 rounded-[18px] border border-line bg-mist px-6 py-16 text-center max-[600px]:px-5 max-[600px]:py-12">
              <h3 className="text-[28px] font-extrabold tracking-[-0.03em] text-navy max-[600px]:text-[24px]">
                No services available
              </h3>

              <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-[1.7] text-ink">
                We&apos;re currently updating our service offerings.
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
