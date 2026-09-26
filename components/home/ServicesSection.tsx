"use client";

import { EASE, viewportOnce } from "@/components/animations/variants";
import { services } from "@/lib/data/content";
import {
  ArrowUpRight,
  Paintbrush,
  Sparkles,
  Wallpaper,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import Container from "../Container";
import { SectionHeader } from "../SectionHeader";

const cards = [
  {
    ...services[0],
    title: "Precision Painting Services",
    description:
      "Our precision painting services focus on delivering smooth, long-lasting finishes that bring your vision to life.",
    icon: Paintbrush,
  },

  {
    ...services[3],
    title: "Wallpaper Removal & Prep",
    description:
      "Preparing your walls for new wallpaper or paint starts with professional removal of old layers and careful surface prep.",
    icon: Wallpaper,
  },

  {
    ...services[2],
    title: "Custom Wallpapering",
    description:
      "With our custom wallpapering services, we offer a variety of textures, patterns, and designs to suit any aesthetic.",
    icon: Sparkles,
  },
];

export default function ServicesSection() {
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
            title="Design-Driven Painting & Wallpapering Services"
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

        <div
          className="
            mr-[-16px] overflow-x-auto pb-[10px] pr-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            md:mr-0 md:overflow-visible md:pb-0 md:pr-0
          "
          role="region"
          aria-label="Our services"
        >
          <div
            className="
              flex w-max gap-[14px]
              md:grid md:w-auto md:grid-cols-2 md:gap-5
              lg:grid-cols-3
            "
          >
            {cards.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.article
                  key={service.id}
                  className="
                    w-[min(86vw,330px)] shrink-0 snap-start
                    overflow-visible rounded-[13px]
                    border border-[#dfe4e7]
                    bg-white text-ink
                    shadow-[0_4px_12px_rgba(0,51,78,0.04)]
                    transition-[box-shadow] duration-300 ease-in-out
                    hover:shadow-[0_18px_35px_rgba(0,51,78,0.12)]
                    motion-reduce:transition-none
                    md:w-auto md:shrink md:snap-none
                    md:last-of-type:hidden
                    lg:last-of-type:block
                  "
                  initial={reduce ? false : { opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: 0.55,
                    ease: EASE,
                    delay: index * 0.1,
                  }}
                  whileHover={reduce ? undefined : { y: -6 }}
                >
                  <div
                    className="
                      relative h-[235px] overflow-visible rounded-t-[12px]
                      lg:h-[253px]
                    "
                  >
                    <motion.div
                      className="
                        absolute inset-0 overflow-hidden rounded-t-[12px]
                        motion-reduce:transition-none
                      "
                      whileHover={
                        reduce ? undefined : { scale: 1.04 }
                      }
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                    >
                      <Image
                        src={service.image}
                        alt={`${service.title} service`}
                        fill
                        sizes="(max-width: 767px) 86vw, (max-width: 1100px) 44vw, 300px"
                        className="block"
                      />
                    </motion.div>

                    <motion.span
                      className="
                        absolute right-[18px] bottom-[-19px]
                        grid h-[44px] w-[44px] place-items-center
                        rounded-[9px]
                        border border-[#e6eaed]
                        bg-white text-navy
                        shadow-[0_6px_16px_rgba(0,51,78,0.09)]
                        motion-reduce:transition-none
                      "
                      whileHover={
                        reduce ? undefined : { scale: 1.05 }
                      }
                      transition={{ duration: 0.25 }}
                      aria-hidden="true"
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </motion.span>
                  </div>

                  <div
                    className="
                      min-h-[190px] px-[18px] pt-[29px] pb-[21px]
                      lg:min-h-[187px] lg:px-[17px]
                    "
                  >
                    <h3 className="mb-4 text-[16px] leading-[1.25] tracking-[-0.02em] text-navy">
                      {service.title}
                    </h3>

                    <p className="mb-4 min-h-[60px] text-[13px] leading-[1.48] text-[#69747b]">
                      {service.description}
                    </p>

                    <Link
                      href={`/services/${service.slug}`}
                      className="
                        inline-flex items-center gap-[6px]
                        text-[12px] font-extrabold text-navy
                        transition-[color,gap] duration-200 ease-in-out
                        hover:gap-[10px] hover:text-blue
                        motion-reduce:transition-none
                      "
                    >
                      Learn More
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}