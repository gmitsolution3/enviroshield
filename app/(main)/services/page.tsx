import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import ServicesPagination from "@/components/services/ServicesPagination";
import { getPublishedServices } from "@/lib/api/services";
import type { Metadata } from "next";

/* export const metadata = {
  title: "Painting & Wall Finishing Services | Enviroshield",
  description:
    "Explore Enviroshield's painting and wall finishing services, including interior and exterior painting, wallpaper installation, decorative finishes, surface preparation, and more.",
  keywords: [
    "painting services",
    "wall finishing services",
    "interior painting",
    "exterior painting",
    "wallpaper installation",
    "decorative finishes",
    "surface preparation",
    "Enviroshield",
  ],
  alternates: {
    canonical: "/services",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Painting & Wall Finishing Services | Enviroshield",
    description:
      "Explore Enviroshield's professional painting and wall finishing services.",
    type: "website",
    url: "/services",
  },
}; */

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
    limit: 10,
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

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-[22px] max-[900px]:grid-cols-2 max-[600px]:flex max-[600px]:overflow-auto max-[600px]:snap-x max-[600px]:snap-mandatory max-[600px]:mr-[-16px] max-[600px]:pr-4 max-[600px]:pb-2">
            {services.map((service, index) => (
              <StaggerItem
                key={service._id}
                className="max-[600px]:min-w-[280px] max-[600px]:snap-start"
              >
                <ServiceCard service={service} index={index} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <ServicesPagination
            currentPage={result.meta.page}
            totalPages={result.meta.totalPages}
          />
        </Container>
      </section>

      <ContactSection />
    </>
  );
}
