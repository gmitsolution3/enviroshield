import {
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
    ? "Explore Enviroshield's professional waterproofing, flooring, heat insulation, injection grouting, polished concrete, and protective coating solutions for residential, commercial, and industrial spaces."
    : `Explore more of Enviroshield's waterproofing, flooring, insulation, and protective coating services on page ${page}.`;

  const canonical = isFirstPage
    ? "/services"
    : `/services?page=${page}`;

  return {
    title,
    description,

    keywords: [
      "waterproofing solutions",
      "waterproofing services",
      "waterproofing paint",
      "heat insulation",
      "epoxy flooring",
      "PU flooring",
      "injection grouting",
      "sports flooring",
      "polished concrete",
      "3D epoxy flooring",
      "floor hardener",
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

  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="Professional waterproofing, flooring & protective coating solutions."
        text="From waterproofing and heat insulation to epoxy, PU, sports flooring, injection grouting, polished concrete, and protective coatings, Enviroshield delivers durable solutions for residential, commercial, and industrial spaces."
        image="/images/service-hero.jpg"
      />

      <section
        aria-labelledby="services-page-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHAT WE DO"
            title="Complete waterproofing, flooring & protective coating solutions"
            text="Explore our full range of professional solutions for waterproofing, flooring, insulation, grouting, concrete finishing, and protective coatings."
            headingId="services-page-heading"
          />

          {services.length > 0 ? (
            <>
              <StaggerContainer className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
                {services.map((service, index) => (
                  <StaggerItem key={service._id}>
                    <ServiceCard service={service} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

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
