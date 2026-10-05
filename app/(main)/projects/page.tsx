import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects | Enviroshield",
  description:
    "Explore Enviroshield's completed waterproofing, flooring, heat insulation, injection grouting, polished concrete, and protective coating projects across residential, commercial, and industrial spaces.",
  keywords: [
    "Enviroshield projects",
    "waterproofing projects",
    "flooring projects",
    "epoxy flooring projects",
    "protective coating projects",
    "heat insulation projects",
    "construction projects Bangladesh",
  ],
  alternates: {
    canonical: "/projects",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Our Projects | Enviroshield",
    description:
      "Explore Enviroshield's completed waterproofing, flooring, insulation, and protective coating projects.",
    type: "website",
    url: "/projects",
    images: [
      {
        url: "/images/service-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Enviroshield completed projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Projects | Enviroshield",
    description:
      "Explore Enviroshield's completed waterproofing, flooring, insulation, and protective coating projects.",
    images: ["/images/service-hero.jpg"],
  },
};

const projects = [
  {
    slug: "dhaka-corporate-office-waterproofing",
    title: "Dhaka Corporate Office Waterproofing",
    description:
      "Complete roof and terrace waterproofing solution for a large commercial office facility.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
    location: "Gulshan, Dhaka, Bangladesh",
    service: "Waterproofing Solution",
    completionDate: "2026-02-01",
    featured: true,
  },
  {
    slug: "premium-residential-epoxy-flooring",
    title: "Premium Residential Epoxy Flooring",
    description:
      "Seamless decorative epoxy flooring designed for a premium residential interior.",
    image:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1600",
    location: "Banani, Dhaka, Bangladesh",
    service: "Epoxy Flooring",
    completionDate: "2026-01-01",
    featured: false,
  },
  {
    slug: "industrial-floor-protection",
    title: "Industrial Floor Protection",
    description:
      "Heavy-duty floor protection system engineered for demanding industrial conditions.",
    image:
      "https://images.pexels.com/photos/4481327/pexels-photo-4481327.jpeg?auto=compress&cs=tinysrgb&w=1600",
    location: "Patenga, Chattogram, Bangladesh",
    service: "Floor Hardener",
    completionDate: "2025-11-01",
    featured: false,
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR PROJECTS"
        title="Projects built to perform."
        text="Explore our completed waterproofing, flooring, insulation, and protective coating projects across residential, commercial, and industrial spaces."
        image="/images/service-hero.jpg"
        imageAlt="Enviroshield completed project"
      />

      <section
        aria-labelledby="projects-page-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <Reveal dir="up">
            <SectionHeader
              eyebrow="SELECTED WORK"
              title="Solutions brought to life."
              text="Take a look at some of the projects where Enviroshield's waterproofing, flooring, insulation, and protective coating solutions have been put into practice."
              headingId="projects-page-heading"
            />
          </Reveal>

          <StaggerContainer className="mt-12 grid grid-cols-12 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {projects.map((project, index) => {
              const featured = index === 0;

              return (
                <StaggerItem
                  key={project.slug}
                  className={
                    featured
                      ? "col-span-7 max-[900px]:col-span-2 max-[600px]:col-span-1"
                      : "col-span-5 max-[900px]:col-span-1 max-[600px]:col-span-1"
                  }
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <article
                      className={`relative overflow-hidden rounded-[18px] bg-navy ${
                        featured
                          ? "min-h-[540px] max-[900px]:min-h-[460px]"
                          : "min-h-[420px]"
                      }`}
                    >
                      {/* Project image */}
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes={
                            featured
                              ? "(max-width: 900px) 100vw, 58vw"
                              : "(max-width: 900px) 50vw, 42vw"
                          }
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>

                      {/* Gradient */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,51,78,0.05)_15%,rgba(0,18,33,0.9)_100%)]"
                      />

                      {/* Top information */}
                      <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-navy/60 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                          <span className="size-[6px] rounded-full bg-paste" />
                          {project.featured
                            ? "FEATURED PROJECT"
                            : "PROJECT"}
                        </span>

                        <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-blue">
                          <ArrowUpRight
                            size={18}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:rotate-45"
                          />
                        </span>
                      </div>

                      {/* Bottom content */}
                      <div className="absolute inset-x-0 bottom-0 p-7 max-[600px]:p-6">
                        <div className="relative">
                          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-paste">
                            {project.service}
                          </p>

                          <h2
                            className={`font-extrabold leading-[1.05] tracking-[-0.045em] text-white ${
                              featured
                                ? "text-[clamp(30px,4vw,48px)]"
                                : "text-[28px]"
                            }`}
                          >
                            {project.title}
                          </h2>

                          <span
                            aria-hidden="true"
                            className="mt-3 block h-[2px] w-[28px] rounded-full bg-paste transition-all duration-500 group-hover:w-[64px] group-hover:bg-blue"
                          />

                          <p className="mt-3 max-w-[620px] text-[13px] leading-[1.7] text-white/75">
                            {project.description}
                          </p>

                          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-4">
                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/75">
                              <MapPin size={13} aria-hidden="true" />
                              {project.location}
                            </span>

                            <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/75">
                              <CalendarDays
                                size={13}
                                aria-hidden="true"
                              />
                              {new Date(
                                project.completionDate,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}