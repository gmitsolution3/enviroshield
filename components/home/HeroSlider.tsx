"use client";

import { EASE } from "@/components/animations/variants";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
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

type Slide = {
  id: number;
  bg: string;
  eyebrow: string;
  heading: string;
  text: string;
  cta: string;
  href: string;
};

const slides: Slide[] = [
  {
    id: 1,
    bg: "https://images.pexels.com/photos/7546769/pexels-photo-7546769.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
    eyebrow: "TRANSFORM YOUR SPACE",
    heading: "Beautiful walls.\nBetter spaces.",
    text: "Professional painting and wall finishing solutions designed to transform your home or business with precision and care.",
    cta: "Start your transformation",
    href: "/contact",
  },
  {
    id: 2,
    bg: "https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
    eyebrow: "TRANSFORM YOUR SPACE",
    heading: "Color that\nchanges everything.",
    text: "From subtle finishes to bold statement walls, we bring your vision to life with exceptional craftsmanship.",
    cta: "Explore our services",
    href: "/services",
  },
  {
    id: 3,
    bg: "https://images.pexels.com/photos/8135503/pexels-photo-8135503.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
    eyebrow: "TRANSFORM YOUR SPACE",
    heading: "Crafted for lasting\nimpressions.",
    text: "Premium surface preparation, painting, and finishing solutions built around quality, detail, and reliability.",
    cta: "Get a free quote",
    href: "/contact",
  },
];

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
      className="relative flex min-h-[670px] items-center overflow-hidden bg-[#123] max-[900px]:min-h-[620px] max-[600px]:min-h-[680px]"
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
            alt="Beautifully finished interior space"
            fill
            priority={index === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,28,48,0.86)_0%,rgba(0,36,57,0.67)_43%,rgba(0,26,42,0.18)_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
                <span className="inline-block h-[2px] w-7 bg-current" />
                {slide.eyebrow}
              </motion.div>

              <motion.h1
                className="mb-6 max-w-[700px] text-[clamp(45px,6.2vw,78px)] font-extrabold leading-[1.02] tracking-[-0.055em] text-white max-[600px]:text-[48px]"
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
                    {line}
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
                  <ArrowUpRight size={16} />
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
          <ChevronLeft size={20} />
        </motion.button>

        <motion.button
          className="grid size-[42px] place-items-center rounded-full !border !border-white/[0.3] !text-white transition-[border-color,background] duration-200 !hover:border-white"
          aria-label="Next slide"
          onClick={() => go(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      <div className="absolute right-[125px] bottom-10 z-[2] text-[12px] text-white">
        <strong className="text-[24px]">0{index + 1}</strong> / 0
        {slides.length}
      </div>
    </section>
  );
}
