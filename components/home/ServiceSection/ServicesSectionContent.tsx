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
      className="
        relative overflow-hidden
        bg-[linear-gradient(to_bottom,var(--deep)_0,var(--deep)_368px,#fff_368px,#fff_100%)]
        py-[76px] pb-[106px]
        md:bg-[linear-gradient(to_bottom,var(--deep)_0,var(--deep)_330px,#fff_330px,#fff_100%)]
        md:py-[58px] md:pb-[76px]
      "
      aria-labelledby="services-heading"
    >
      <Container>
        <motion.div
          className="
            mb-[31px] block min-h-0
            md:flex md:min-h-[165px] md:items-start md:justify-between md:gap-8
          "
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionHeader
            eyebrow="OUR SERVICES"
            title="Professional Waterproofing & Protective Solutions"
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
                md:grid md:w-auto md:grid-cols-2 md:gap-5
                lg:grid-cols-3
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
              bg-white/[0.04]
              px-6 py-12
              text-center
            "
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-white">
              No featured services available
            </h3>

            <p className="mt-3 max-w-[520px] text-[14px] leading-[1.6] text-white/65">
              We&apos;re currently updating our featured services.
              Please check back soon or explore all of our available
              services.
            </p>

            <Button href="/services" variant="light" className="mt-6">
              Explore all services
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
