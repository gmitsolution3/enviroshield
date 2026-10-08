"use client";

import { images } from "@/lib/data/content";
import { Layers, Paintbrush, ShieldCheck, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

// Swap these with the exact assets from your design.
const DECOR_SRC = "/images/work-paint.webp"; // paint brushes + blue splash, top-left
const BIG_IMAGE = {
  src: images.painter,
  alt: "Painter carefully preparing an interior wall",
};
const SMALL_IMAGE = {
  src: "https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  alt: "Man painting a patterned blue wall",
};

const imgClass =
  "object-cover transition-transform duration-[0.6s] group-hover:scale-[1.04]";

function PhotoFx() {
  return (
    <>
      {/* soft darken */}
      <span
        className="pointer-events-none absolute inset-0 bg-navy/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* inner frame */}
      <span
        className="pointer-events-none absolute inset-3 scale-110 rounded-[12px] border border-white/80 opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* diagonal shine */}
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[500%]"
        aria-hidden="true"
      />
    </>
  );
}

const steps = [
  {
    number: "01",
    coat: "1st Coat",
    title: "LatexShield — Structural Strength",
    description:
      "Seals microscopic pores on the roof surface and helps enhance structural strength, creating a solid foundation for the waterproofing system.",
    icon: Layers,
  },
  {
    number: "02",
    coat: "2nd & 3rd Coat",
    title: "BondShield — Surface Preparation",
    description:
      "Smooths and prepares the roof surface, creating a strong and uniform base for the subsequent waterproofing layers.",
    icon: Paintbrush,
  },
  {
    number: "03",
    coat: "4th & 5th Coat",
    title: "GumShield — Flexible Waterproofing",
    description:
      "Provides a highly elastic waterproof gum-coat with up to 300% elongation, helping accommodate surface movement.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    coat: "6th & 7th Coat",
    title: "PU AquaShield — Complete Protection",
    description:
      "Provides robust waterproofing with heat and UV protection while creating a durable, walkable, non-slip finish.",
    icon: Sun,
  },
];

export default function WorkProcessSection() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-mist py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      {/* decorative paint brushes, top-left (floating) */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 w-[240px] origin-top-left max-[900px]:w-[150px] max-[600px]:w-[110px]"
        aria-hidden="true"
        animate={
          reduce ? undefined : { y: [0, -20, 0], rotate: [0, 3, 0] }
        }
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src={DECOR_SRC}
          alt=""
          width={240}
          height={240}
          className="h-auto w-full"
        />
      </motion.div>

      <Container className="relative grid grid-cols-[1.1fr_0.9fr] items-center gap-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        <Reveal dir="up">
          <SectionHeader
            eyebrow="OUR SPECIALTY"
            title="Enviro Supreme 7-Layer Roof Waterproofing System"
            text="A multi-layer waterproofing system engineered to seal, strengthen, protect, and extend the life of your roof with advanced surface preparation, flexible waterproofing, and durable protective coatings."
            headingId="process-heading"
          />

          <StaggerContainer className="mt-10 flex flex-col gap-[18px]">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem
                  key={step.number}
                  className="group relative pl-12 max-[600px]:pl-9"
                >
                  {/* timeline: line down to the next node (hidden on the last item) */}
                  <span
                    className="pointer-events-none absolute left-[9px] top-[63px] -bottom-[18px] w-0.5 bg-blue/20 max-[600px]:top-[50px] last:hidden"
                    aria-hidden="true"
                  />

                  {/* timeline: connector from node to card */}
                  <span
                    className="pointer-events-none absolute left-5 top-[62px] h-0.5 w-7 bg-blue/30 transition-colors duration-300 group-hover:bg-blue max-[600px]:top-[49px] max-[600px]:w-4"
                    aria-hidden="true"
                  />

                  {/* timeline: node */}
                  <span
                    className="pointer-events-none absolute left-0 top-[53px] z-[1] grid size-5 place-items-center rounded-full bg-white ring-4 ring-mist transition-colors duration-300 group-hover:bg-blue max-[600px]:top-10"
                    aria-hidden="true"
                  >
                    <span className="size-2 rounded-full bg-blue transition-colors duration-300 group-hover:bg-white" />
                  </span>

                  {/* hover lives on this inner div so it doesn't fight the stagger animation */}
                  <div className="flex cursor-pointer items-start gap-7 rounded-[6px] bg-white p-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,51,78,0.12)] max-[600px]:gap-4 max-[600px]:p-4">
                    <div className="relative grid h-[90px] w-[90px] flex-none place-items-center rounded-full bg-mist transition-colors duration-300 group-hover:bg-blue max-[600px]:h-[68px] max-[600px]:w-[68px]">
                      <Icon
                        size={40}
                        strokeWidth={1.5}
                        className="text-navy transition-colors duration-300 group-hover:text-white max-[600px]:size-8"
                        aria-hidden="true"
                      />
                      <span
                        className="absolute top-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-blue text-[12px] font-bold text-white ring-0 transition-all duration-300 group-hover:bg-navy max-[600px]:h-6 max-[600px]:w-6 max-[600px]:text-[11px]"
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                    </div>

                    <div className="pt-px">
                      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-blue">
                        {step.coat}
                      </span>
                      <h3 className="mb-3 text-[20px] font-semibold leading-[26px] text-navy transition-colors duration-300 group-hover:text-blue max-[600px]:text-[18px]">
                        {step.title}
                      </h3>
                      <p className="m-0 text-[14px] leading-[23px] text-[#666]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Reveal>

        <Reveal dir="image" delay={0.2}>
          <div className="relative h-[585px] max-[900px]:mx-auto max-[900px]:h-[470px] max-[900px]:w-full max-[900px]:max-w-[600px] max-[600px]:h-[380px]">
            <div className="group absolute top-0 right-0 h-[64.6%] w-[75%] overflow-hidden rounded-[18px]">
              <Image
                src={BIG_IMAGE.src}
                alt={BIG_IMAGE.alt}
                fill
                sizes="(max-width: 900px) 70vw, 32vw"
                className={imgClass}
              />
              <PhotoFx />
            </div>

            <div className="group absolute bottom-0 left-0 box-border h-[53.8%] w-[65.4%] overflow-hidden rounded-[18px] border-[8px] border-white bg-white">
              <Image
                src={SMALL_IMAGE.src}
                alt={SMALL_IMAGE.alt}
                fill
                sizes="(max-width: 900px) 60vw, 25vw"
                className={imgClass}
              />
              <PhotoFx />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}