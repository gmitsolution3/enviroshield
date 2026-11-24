"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Check } from "lucide-react";
import Image from "next/image";
import { AnimatedCounter } from "../animations/animated-counter";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

const aboutImages = {
  hero: {
    src: "/images/about-1.png",
    alt: "Enviro Shield certified engineers supervising on-site waterproofing project",
  },
  application: {
    src: "/images/about-2.png",
    alt: "Enviro Shield specialist applying protective waterproofing coating with roller",
  },
  completed: {
    src: "/images/about-3.png",
    alt: "Completed seamless waterproof protective flooring on rooftop terrace",
  },
};

const avatars = [
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=33",
  "https://i.pravatar.cc/80?img=47",
  "https://i.pravatar.cc/80?img=45",
];

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

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Option 2: Scroll-driven interactive paint stroke
  // Unmasks from left to right smoothly as the user scrolls into the section, completing when the header reaches upper-center
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "start 45%"],
  });

  const rightInset = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useTransform(rightInset, (v) => `inset(0% ${v}% 0% 0%)`);
  const activeClipPath = reduce ? "inset(0% 0% 0% 0%)" : clipPath;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      {/* Scroll-Driven Paint Brush Stroke (Option 2: unmasks smoothly left-to-right with scroll) */}
      <motion.div
        style={{
          clipPath: activeClipPath,
          WebkitClipPath: activeClipPath,
        }}
        className="pointer-events-none absolute -top-6 sm:-top-10 md:-top-14 left-0 w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden z-0 select-none will-change-transform"
        aria-hidden="true"
      >
        <div className="relative w-full h-full min-w-[900px] lg:min-w-[1200px]">
          <Image
            src="/images/paint-brush-stroke.png"
            alt="Paint brush stroke"
            fill
            priority
            sizes="100vw"
            className="object-contain object-left-top opacity-100"
          />
        </div>
      </motion.div>

      <Container className="relative z-10 grid grid-cols-2 items-center gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        {/* ---------- Left: image collage ---------- */}
        <Reveal dir="image">
          <div className="flex flex-col gap-4 max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[580px]">
            {/* Main Hero Photo: Engineers on Site (16:9 Landscape) */}
            <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[20px] shadow-lg">
              <Image
                src={aboutImages.hero.src}
                alt={aboutImages.hero.alt}
                fill
                priority
                quality={95}
                sizes="(max-width: 900px) 100vw, 600px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <PhotoFx />

              {/* Floating Social Proof Card */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md max-[600px]:bottom-3 max-[600px]:left-3 max-[600px]:px-3 max-[600px]:py-2">
                <div className="flex items-center">
                  {avatars.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className={`h-8 w-8 rounded-full border-2 border-white bg-white object-cover max-[600px]:h-7 max-[600px]:w-7 ${
                        i > 0 ? "-ml-2" : ""
                      }`}
                    />
                  ))}
                  <span
                    className="-ml-2 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue text-xs font-bold text-white max-[600px]:h-7 max-[600px]:w-7"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </div>
                <div>
                  <span className="block text-[13px] font-bold leading-tight text-navy max-[600px]:text-[12px]">
                    500+ Projects
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 max-[600px]:text-[10px]">
                    Happy Customers
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: 2 Complementary Images Side by Side (~2:1 Landscape) */}
            <div className="grid grid-cols-2 gap-4 max-[500px]:gap-3">
              <div className="group relative aspect-[2/1] overflow-hidden rounded-[18px] shadow-md">
                <Image
                  src={aboutImages.application.src}
                  alt={aboutImages.application.alt}
                  fill
                  quality={95}
                  sizes="(max-width: 900px) 50vw, 300px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <PhotoFx />
              </div>

              <div className="group relative aspect-[2/1] overflow-hidden rounded-[18px] shadow-md">
                <Image
                  src={aboutImages.completed.src}
                  alt={aboutImages.completed.alt}
                  fill
                  quality={95}
                  sizes="(max-width: 900px) 50vw, 300px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <PhotoFx />
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeader
            eyebrow="ABOUT ENVIRO SHIELD"
            title="Protecting structures. Extending life."
            eyebrowClassName="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            titleClassName="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            text="Founded in Australia in 2009, EnviroShield Pvt. Ltd. is a trusted company in waterproofing, flooring, and protective coating solutions. Operating in Bangladesh since 2017 with in-house construction chemical manufacturing and imported raw materials from the UK, Germany, Australia, and China, we deliver durable, high-performance solutions for residential, commercial, and industrial projects."
            headingId="about-heading"
          />

          <StaggerContainer className="mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
            {[
              "Australian Brand Founded in 2009",
              "Operating in Bangladesh Since 2017",
              "Proven 7-Layer Waterproofing System",
              "Imported Raw Materials (UK, Germany, Australia, China)",
              "In-House Construction Chemical Manufacturing",
              "20+ Certified Engineers & 130 Applicators",
            ].map((item) => (
              <StaggerItem
                key={item}
                className="flex items-center gap-2 text-[14px] font-medium text-navy"
              >
                <span
                  className="grid h-5 w-5 flex-none place-items-center rounded-full bg-blue text-white"
                  aria-hidden="true"
                >
                  <Check size={12} strokeWidth={3.5} />
                </span>
                {item}
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mb-7 grid grid-cols-4 gap-4 border-t border-line pt-6 max-[768px]:grid-cols-2 max-[600px]:gap-4">
            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={3} suffix="M+" />
              </strong>
              <span className="text-[12px] text-ink">
                SFT Completed
              </span>
            </div>

            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={130} suffix="+" />
              </strong>
              <span className="text-[12px] text-ink">
                Skilled Applicators
              </span>
            </div>

            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={20} suffix="+" />
              </strong>
              <span className="text-[12px] text-ink">
                Engineers
              </span>
            </div>

            <div>
              <strong className="block text-[32px] font-extrabold tracking-[-0.04em] text-navy max-[600px]:text-[26px]">
                <AnimatedCounter value={17} suffix="+" />
              </strong>
              <span className="text-[12px] text-ink">
                Years Experience
              </span>
            </div>
          </div>

          <Button href="/about" variant="outline">
            Discover our story
          </Button>
        </div>
      </Container>
    </section>
  );
}
