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
import ServiceCard from "@/components/ServiceCard";
import ServicesPagination from "@/components/services/ServicesPagination";
import { getPublishedServices } from "@/lib/api/services";
import { ArrowUpRight, Briefcase, ListChecks } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
    ? "/services"
    : `/services?page=${page}`;

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

  // Spotlight: first featured service, first page only
  const featured =
    page === 1 ? services.find((s) => s.isFeatured) : undefined;

  const gridServices = featured
    ? services.filter((s) => s._id !== featured._id)
    : services;

  const featuredProjects = featured?.projects?.length ?? 0;
  const featuredSteps = featured?.process?.items?.length ?? 0;

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

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                              */}
      {/* ------------------------------------------------------------------ */}

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

      {/* ------------------------------------------------------------------ */}
      {/* SERVICES                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="services-page-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHAT WE DO"
            title="Complete waterproofing, flooring & protective coating solutions"
            text="Explore our 12 core services: waterproofing, waterproofing paint, heatproofing, epoxy flooring, PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floor, floor hardener, and ETP coating."
            headingId="services-page-heading"
          />

          {services.length > 0 ? (
            <>
              {/* Spotlight */}
              {featured && (
                <Reveal dir="up">
                  <Link
                    href={`/services/${featured.slug}`}
                    aria-label={`Learn more about ${featured.name}`}
                    className="group mt-12 grid grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-[20px] bg-navy max-[900px]:grid-cols-1"
                  >
                    <div className="relative min-h-[460px] overflow-hidden max-[900px]:aspect-[4/3] max-[900px]:min-h-0">
                      <Image
                        src={featured.primaryImage.url}
                        alt={
                          featured.primaryImage.alt || featured.name
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
                        FEATURED SERVICE
                      </div>

                      <h3 className="mb-4 text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
                        {featured.name}
                      </h3>

                      {featured.description && (
                        <p className="mb-6 line-clamp-4 text-[15px] leading-[1.75] text-white/70">
                          {featured.description}
                        </p>
                      )}

                      {(featuredProjects > 0 || featuredSteps > 0) && (
                        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[13px] text-white/75">
                          {featuredProjects > 0 && (
                            <span className="flex items-center gap-2">
                              <Briefcase
                                size={15}
                                aria-hidden="true"
                                className="text-paste"
                              />
                              {featuredProjects}{" "}
                              {featuredProjects === 1
                                ? "project"
                                : "projects"}
                            </span>
                          )}
                          {featuredSteps > 0 && (
                            <span className="flex items-center gap-2">
                              <ListChecks
                                size={15}
                                aria-hidden="true"
                                className="text-paste"
                              />
                              {featuredSteps}-step process
                            </span>
                          )}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-[gap] duration-200 group-hover:gap-3">
                        Explore service
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Grid */}
              {gridServices.length > 0 && (
                <>
                  {featured && (
                    <div className="mb-8 mt-16 flex items-end justify-between border-b border-line pb-4">
                      <h3 className="text-[24px] font-extrabold tracking-[-0.03em] text-navy">
                        More services
                      </h3>
                      <span className="text-[14px] text-ink">
                        {total} in total
                      </span>
                    </div>
                  )}

                  <StaggerContainer
                    className={`grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[22px] ${
                      featured ? "" : "mt-12"
                    }`}
                  >
                    {gridServices.map((service, index) => (
                      <StaggerItem key={service._id}>
                        <ServiceCard
                          service={service}
                          index={index}
                        />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </>
              )}

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