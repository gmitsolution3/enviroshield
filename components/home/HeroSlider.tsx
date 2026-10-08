"use client";

import { EASE } from "@/components/animations/variants";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { ISlide } from "@/types";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides: ISlide[] = [
  {
    id: 1,
    bg: "/images/slide-one.webp",
    alt: "Professional waterproofing work protecting a building structure",
    eyebrow: "GLOBAL EXPERTISE. LOCAL PRESENCE.",
    heading: "An *Australian Brand* in Bangladesh\nSince 2009",
    text: "Trusted waterproofing company in Bangladesh offering expert solutions to protect your property from water damage, ensuring durability and structural integrity.",
    cta: "Talk to our experts",
    href: "/contact",
  },
  {
    id: 2,
    bg: "/images/slide-two.png",
    alt: "Professional application of high-performance protective solutions",
    eyebrow: "PROTECTION. PERFORMANCE. PRECISION.",
    heading: "Built to protect.\n*Engineered to last.*",
    text: "From waterproofing and flooring to heat insulation and construction solutions, we deliver reliable systems designed for lasting performance.",
    cta: "Get in touch",
    href: "/contact",
  },
  {
    id: 3,
    bg: "/images/slide-three.webp",
    alt: "Modern building protected with professional construction solutions",
    eyebrow: "EXPERTISE YOU CAN TRUST",
    heading: "Stronger protection.\n*Smarter solutions.*",
    text: "We combine proven technology, quality materials, and technical expertise to deliver dependable protection for residential, commercial, and industrial projects.",
    cta: "Start your project",
    href: "/contact",
  },
];

function renderHeadingLine(line: string) {
  return line.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
      <span key={i} className="text-paste">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const slide = slides[index];

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [paused]);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  };

  const headingLines = slide.heading.split("\n");

  return (
    <section
      className="relative flex min-h-[700px] items-center overflow-hidden bg-[#123] max-[900px]:min-h-[620px] max-[600px]:min-h-[680px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence custom={direction}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          custom={direction}
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 1.2, ease: "easeOut" },
          }}
        >
          <Image
            src={slide.bg}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,28,48,0.86)_0%,rgba(0,36,57,0.67)_43%,rgba(0,26,42,0.18)_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        aria-hidden="true"
      />

      <Container className="relative z-[1] py-[100px] pb-[110px] text-white max-[900px]:py-[85px] max-[600px]:py-[70px] max-[600px]:pb-[90px]">
        <div className="max-w-[650px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: 0.1,
                }}
              >
                <span
                  className="inline-block h-[2px] w-7 bg-current"
                  aria-hidden="true"
                />
                {slide.eyebrow}
              </motion.div>

              <motion.h1
                className="mb-6 max-w-[800px] text-[clamp(45px,6.2vw,78px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-white max-[600px]:text-[48px]"
                initial={reduce ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  ease: EASE,
                  delay: 0.2,
                }}
              >
                {headingLines.map((line, i) => (
                  <span key={i}>
                    {renderHeadingLine(line)}
                    {i < headingLines.length - 1 && <br />}
                  </span>
                ))}
              </motion.h1>

              <motion.p
                className="mb-[34px] max-w-[550px] text-[17px] leading-[1.65] text-[#dbe8ef]"
                initial={reduce ? false : { opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: 0.35,
                }}
              >
                {slide.text}
              </motion.p>

              <motion.div
                className="flex items-center gap-5 max-[600px]:max-w-[260px] max-[600px]:flex-col max-[600px]:items-stretch"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: 0.5,
                }}
              >
                <Button href={slide.href}>{slide.cta}</Button>

                <Link
                  className="inline-flex items-center gap-[7px] text-[13px] font-extrabold text-white transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
                  href="/services"
                >
                  Explore our services
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>

      <div className="absolute bottom-[44px] left-1/2 z-[2] flex -translate-x-1/2 gap-[9px]">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-[4px] w-[34px] rounded-[3px] ${
              i === index
                ? "!bg-white"
                : "!bg-[rgba(255,255,255,0.36)]"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
          />
        ))}
      </div>

      <div className="absolute right-5 bottom-10 z-[2] flex gap-2">
        <motion.button
          className="grid size-[42px] place-items-center rounded-full !border !border-white/[0.3] !text-white transition-[border-color,background] duration-200 hover:border-white"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </motion.button>

        <motion.button
          className="grid size-[42px] place-items-center rounded-full !border !border-white/[0.3] !text-white transition-[border-color,background] duration-200 !hover:border-white"
          aria-label="Next slide"
          onClick={() => go(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </motion.button>
      </div>

      <div className="absolute right-[125px] bottom-10 z-[2] text-[12px] text-white">
        <strong className="text-[24px]">0{index + 1}</strong> / 0
        {slides.length}
      </div>
    </section>
  );
}
