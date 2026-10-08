"use client";

import { EASE, viewportOnce } from "@/components/animations/variants";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import type { IService } from "@/types";
import { motion, useReducedMotion } from "motion/react";

interface ServicesSectionContentProps {
  services: IService[];
}

export default function ServicesSectionContent({
  services,
}: ServicesSectionContentProps) {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="services-heading"
    >
      {/* Blue band: bottom padding = half card height + breathing room */}
      <div className="bg-[var(--deep)] pt-[76px] pb-[280px] md:pt-[58px] md:pb-[310px]">
        <Container>
          <motion.div
            className="block md:flex md:items-start md:justify-between md:gap-8"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <SectionHeader
              eyebrow="OUR SERVICES"
              title="Complete Protection for Every Surface"
              text="From waterproofing and flooring to heat insulation and protective construction solutions, Enviro Shield delivers reliable systems designed to protect, strengthen, and extend the life of your property."
              light
              headingId="services-heading"
            />

            <Button
              href="/services"
              variant="light"
              className="mt-[25px] shrink-0 md:mt-[38px]"
            >
              View all services
            </Button>
          </motion.div>
        </Container>
      </div>

      {/* Cards: pulled up by exactly half the card height (220px / 240px) */}
      <Container className="relative z-10 -mt-[220px] pb-[106px] md:-mt-[240px] md:pb-[76px]">
        {services.length > 0 ? (
          <div
            className="
              mr-[-16px] overflow-x-auto pb-[10px] pr-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              md:mr-0 md:overflow-visible md:pb-0 md:pr-0
            "
            role="region"
            aria-label="Featured services"
          >
            <div
              className="
                flex w-max gap-[14px]
                md:grid md:w-auto md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] md:gap-5
              "
            >
              {services.map((service, index) => (
                <div
                  key={service._id}
                  className="
                    w-[min(86vw,330px)] shrink-0 snap-start
                    md:w-auto md:shrink md:snap-none
                  "
                >
                  <ServiceCard service={service} index={index} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            className="
              flex min-h-[280px] flex-col items-center justify-center
              rounded-[24px]
              border border-white/10
              bg-white
              px-6 py-12
              text-center shadow
            "
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
              No featured services available
            </h3>

            <p className="mt-3 max-w-[520px] text-[14px] leading-[1.6] text-ink/65">
              We&apos;re currently updating our featured services.
              Please check back soon or explore all of our available
              services.
            </p>

            <Button href="/services" className="mt-6">
              Explore all services
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}