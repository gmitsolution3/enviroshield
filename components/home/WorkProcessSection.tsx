"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  CheckCircle2,
  Droplets,
  Layers,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import Container from "../Container";
import DottedBackground from "../DottedBackground";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

const PROCESS_IMAGE = {
  src: "/images/enviro-supreme-7-layers-waterproofing-method.png",
  alt: "Enviro Supreme Seven Layers Waterproofing System diagram",
};

const steps = [
  {
    number: "01",
    coat: "1st Coat",
    title: "LatexShield — Structural Strength",
    description:
      "Seals microscopic pores on the roof surface and helps enhance structural strength, creating a solid foundation for the waterproofing system.",
    icon: Layers,
    badgeText: "Layer 01 • LatexShield (200µm)",
    badgeDetail: "Structural Micro-Pore Sealing & Adhesion",
  },
  {
    number: "02",
    coat: "2nd & 3rd Coat",
    title: "BondShield — Surface Preparation",
    description:
      "Smooths and prepares the roof surface, creating a strong and uniform base for the subsequent waterproofing layers.",
    icon: Paintbrush,
    badgeText: "Layers 02–03 • BondShield (1.0–1.5mm)",
    badgeDetail: "Surface Leveling & Polymer Bedding",
  },
  {
    number: "03",
    coat: "4th & 5th Coat",
    title: "GumShield — Flexible Waterproofing",
    description:
      "Provides a highly elastic waterproof gum-coat with up to 300% elongation, helping accommodate surface movement.",
    icon: ShieldCheck,
    badgeText: "Layers 04–05 • GumShield (200µm)",
    badgeDetail: "300% Elastic Joint-Free Membrane",
  },
  {
    number: "04",
    coat: "6th & 7th Coat",
    title: "PU AquaShield — Complete Protection",
    description:
      "Provides robust waterproofing with heat and UV protection while creating a durable, walkable, non-slip finish.",
    icon: Sun,
    badgeText: "Layers 06–07 • PU AquaShield (150µm)",
    badgeDetail: "UV, Heat Reflective & 100% Watertight",
  },
];

export default function WorkProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [activeStep, setActiveStep] = useState<number>(0);

  // Concept 1: Scroll-driven layer unmasking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "center 35%"],
  });

  // Smooth unmasking of the 7-layer diagram from left to right as the user scrolls
  const unmaskProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPathStyle = useTransform(
    unmaskProgress,
    (v) => `inset(0% ${v}% 0% 0%)`,
  );

  // Roller applicator position following the unmasking edge
  const rollerX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const rollerOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.2]);

  // Floating badges reveal
  const badgesOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const badgesY = useTransform(scrollYProgress, [0.35, 0.65], [20, 0]);

  const activeStepData = useMemo(() => steps[activeStep] ?? steps[0], [activeStep]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-mist py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      <DottedBackground />

      {/* Decorative paint roller at top-left (upgraded from old clipart) */}
      <motion.div
        className="pointer-events-none absolute -top-8 -left-10 z-0 w-[220px] origin-top-left drop-shadow-[0_16px_28px_rgba(26,47,110,0.12)] max-[900px]:w-[160px] max-[600px]:w-[110px]"
        aria-hidden="true"
        animate={
          reduce
            ? undefined
            : {
                y: [0, -14, 0],
                rotate: [0, 3, 0],
              }
        }
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src="/images/roller-paint-green.png"
          alt=""
          width={400}
          height={400}
          className="h-auto w-full object-contain opacity-75"
        />
      </motion.div>

      <Container className="relative z-10 grid grid-cols-[1.1fr_0.9fr] items-center gap-[70px] max-[1100px]:gap-[50px] max-[900px]:grid-cols-1">
        {/* Left Column: Section Header & Interactive Step Timeline (Concept 2) */}
        <Reveal dir="up">
          <SectionHeader
            eyebrow="OUR SPECIALTY"
            title="Enviro Supreme 7-Layer Roof Waterproofing System"
            text="A multi-layer waterproofing system engineered to seal, strengthen, protect, and extend the life of your roof with advanced surface preparation, flexible waterproofing, and durable protective coatings."
            headingId="process-heading"
          />

          <StaggerContainer className="mt-10 flex flex-col gap-[18px]">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isSelected = activeStep === index;

              return (
                <StaggerItem
                  key={step.number}
                  className="group relative pl-12 max-[600px]:pl-9"
                >
                  {/* Timeline connector down to next step */}
                  <span
                    className="pointer-events-none absolute -bottom-[18px] left-[9px] top-[63px] w-0.5 bg-blue/20 max-[600px]:top-[50px] last:hidden"
                    aria-hidden="true"
                  />

                  {/* Connector from node to card */}
                  <span
                    className={`pointer-events-none absolute left-5 top-[62px] h-0.5 w-7 transition-all duration-300 max-[600px]:top-[49px] max-[600px]:w-4 ${
                      isSelected
                        ? "w-8 bg-blue"
                        : "bg-blue/30 group-hover:bg-blue"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Timeline node */}
                  <span
                    className={`pointer-events-none absolute left-0 top-[53px] z-[1] grid size-5 place-items-center rounded-full bg-white ring-4 transition-all duration-300 max-[600px]:top-10 ${
                      isSelected
                        ? "bg-blue ring-blue/20"
                        : "ring-mist group-hover:bg-blue"
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`size-2 rounded-full transition-colors duration-300 ${
                        isSelected ? "bg-white" : "bg-blue group-hover:bg-white"
                      }`}
                    />
                  </span>

                  {/* Interactive Step Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setActiveStep(index)}
                    className={`flex cursor-pointer items-start gap-6 rounded-2xl border p-5 shadow-sm transition-all duration-300 max-[600px]:gap-4 max-[600px]:p-4 ${
                      isSelected
                        ? "scale-[1.01] border-blue bg-white shadow-[0_16px_36px_rgba(1,110,220,0.15)] ring-2 ring-blue/10"
                        : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-blue/30 hover:shadow-md"
                    }`}
                  >
                    {/* Icon container */}
                    <div
                      className={`relative grid h-[80px] w-[80px] flex-none place-items-center rounded-2xl transition-all duration-300 max-[600px]:h-[64px] max-[600px]:w-[64px] ${
                        isSelected
                          ? "bg-blue text-white shadow-md shadow-blue/25"
                          : "bg-blue/10 text-blue group-hover:bg-blue group-hover:text-white"
                      }`}
                    >
                      <Icon
                        size={36}
                        strokeWidth={1.5}
                        className="transition-colors duration-300 max-[600px]:size-7"
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full text-[11px] font-extrabold shadow-md transition-all duration-300 max-[600px]:h-6 max-[600px]:w-6 max-[600px]:text-[10px] ${
                          isSelected
                            ? "bg-navy text-paste"
                            : "bg-navy text-paste group-hover:bg-navy"
                        }`}
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                    </div>

                    <div className="pt-px">
                      <div className="flex items-center gap-2">
                        <span
                          className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider transition-colors ${
                            isSelected
                              ? "bg-blue text-white"
                              : "bg-blue/10 text-blue"
                          }`}
                        >
                          {step.coat}
                        </span>
                        {isSelected && (
                          <span className="mb-1.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-blue">
                            <span className="size-1.5 animate-ping rounded-full bg-blue" />
                            Inspecting Layer
                          </span>
                        )}
                      </div>

                      <h3
                        className={`mb-2 text-[18px] font-bold leading-snug transition-colors duration-300 max-[600px]:text-[16px] ${
                          isSelected ? "text-blue" : "text-navy group-hover:text-blue"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="m-0 text-[14px] leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Reveal>

        {/* Right Column: 7-Layer Diagram with Scroll-Driven Active Reveal & Inspector (Concepts 1 + 2) */}
        <Reveal dir="image" delay={0.2}>
          <div className="relative mx-auto w-full max-w-[590px]">
            {/* Floating Top Indicator: Active Layer Inspection Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepData.number}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mb-3 flex items-center justify-between rounded-xl border border-blue/20 bg-white/95 px-4 py-2.5 shadow-md backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-blue text-xs font-black text-white">
                    {activeStepData.number}
                  </span>
                  <div>
                    <span className="block text-xs font-black text-navy">
                      {activeStepData.badgeText}
                    </span>
                    <span className="block text-[10px] font-bold text-blue">
                      {activeStepData.badgeDetail}
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue">
                  {activeStepData.coat}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Main Diagram Container */}
            <div className="group relative aspect-[645/454] w-full overflow-hidden rounded-[24px] border-[6px] border-white bg-white shadow-[0_20px_50px_rgba(0,51,78,0.14)] ring-1 ring-navy/[0.06] transition-all duration-500 hover:shadow-[0_28px_64px_rgba(0,51,78,0.22)]">
              {/* Concept 1: Scroll-driven unmasked diagram */}
              <motion.div
                style={{
                  clipPath: reduce ? "inset(0% 0% 0% 0%)" : clipPathStyle,
                  WebkitClipPath: reduce ? "inset(0% 0% 0% 0%)" : clipPathStyle,
                }}
                className="relative size-full overflow-hidden will-change-transform"
              >
                <Image
                  src={PROCESS_IMAGE.src}
                  alt={PROCESS_IMAGE.alt}
                  fill
                  sizes="(max-width: 900px) 90vw, 45vw"
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  priority
                />

                {/* Ambient liquid coating sheen wave */}
                <span
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[1200ms] ease-out group-hover:translate-x-[500%]"
                  aria-hidden="true"
                />
              </motion.div>

              {/* Scroll Roller Applicator on the unmasking edge */}
              <motion.div
                style={{
                  left: reduce ? "100%" : rollerX,
                  opacity: reduce ? 0 : rollerOpacity,
                }}
                className="pointer-events-none absolute -top-8 z-10 w-[120px] -translate-x-1/2 drop-shadow-[0_12px_24px_rgba(0,51,78,0.25)] will-change-transform"
                aria-hidden="true"
              >
                <Image
                  src="/images/roller-paint-navy.png"
                  alt=""
                  width={300}
                  height={300}
                  className="h-auto w-full object-contain"
                />
              </motion.div>

              {/* Bottom Right Reticle Watermark Badge */}
              <div className="pointer-events-none absolute bottom-3.5 right-3.5 z-10 flex items-center gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-blue" />
                </span>
                <span className="text-[10px] font-black tracking-wider text-navy uppercase">
                  Australian Specification
                </span>
              </div>
            </div>

            {/* Concept 1 Floating Engineering Badges */}
            <motion.div
              style={{
                opacity: reduce ? 1 : badgesOpacity,
                y: reduce ? 0 : badgesY,
              }}
              className="mt-4 grid grid-cols-3 gap-2.5 max-[500px]:grid-cols-1"
            >
              <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm transition-all hover:border-blue/30 hover:shadow-md">
                <ShieldCheck size={18} className="shrink-0 text-blue" />
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-extrabold text-navy">
                    300% Elastic
                  </span>
                  <span className="block truncate text-[9px] font-medium text-slate-500">
                    Bridges Micro-Cracks
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm transition-all hover:border-blue/30 hover:shadow-md">
                <Layers size={18} className="shrink-0 text-blue" />
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-extrabold text-navy">
                    7-Layer Monolithic
                  </span>
                  <span className="block truncate text-[9px] font-medium text-slate-500">
                    Joint-Free Membrane
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm transition-all hover:border-blue/30 hover:shadow-md">
                <Sun size={18} className="shrink-0 text-blue" />
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-extrabold text-navy">
                    Heat & UV Proof
                  </span>
                  <span className="block truncate text-[9px] font-medium text-slate-500">
                    Solar Cool Roof Finish
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
