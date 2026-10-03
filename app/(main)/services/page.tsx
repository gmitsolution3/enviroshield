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
    ? "Painting & Wall Finishing Services | Enviroshield"
    : `Painting & Wall Finishing Services — Page ${page} | Enviroshield`;

  const description = isFirstPage
    ? "Explore Enviroshield's professional painting and wall finishing services, including interior and exterior painting, wallpaper installation, decorative finishes, surface preparation, and more."
    : `Explore more of Enviroshield's professional painting and wall finishing services on page ${page}.`;

  const canonical = isFirstPage
    ? "/services"
    : `/services?page=${page}`;

  return {
    title,
    description,

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
        title="Painting and wall finishing, done with care."
        text="Whether it is one room or a whole building, we deliver finishes that feel considered, durable, and beautifully made."
        image="/images/service-hero.jpg"
      />

      <section
        aria-labelledby="services-page-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHAT WE DO"
            title="A full range of wall finishing services"
            text="Explore our services below, then reach out to talk through your space."
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
