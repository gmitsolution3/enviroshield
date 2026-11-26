"use client";

import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { EASE } from "@/components/animations/variants";
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
import { useEffect, useRef, useState } from "react";

interface HeroSliderContentProps {
  initialSlides: ISlide[];
}

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

export default function HeroSliderContent({
  initialSlides,
}: HeroSliderContentProps) {
  const [slides] = useState<ISlide[]>(initialSlides);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reduce = useReducedMotion();

  const slide = slides[index] || slides[0];

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  };

  // Autoplay timer with pause on hover / interaction
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [index, isPaused, slides.length]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        go(-1);
      } else if (e.key === "ArrowRight") {
        go(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        go(1); // Swipe left -> Next
      } else {
        go(-1); // Swipe right -> Prev
      }
    }
  };

  const headingLines = slide.heading.split("\n");
  const isTextRight = slide.layout === "text-right";
  const isBeamRtl =
    slide.magnifier?.beamDirection === "right-to-left";

  return (
    <section
      className="relative flex min-h-[500px] sm:min-h-[580px] md:min-h-[700px] lg:min-h-[820px] items-end lg:items-center overflow-hidden bg-[#001726]"
      aria-label="EnviroShield Architectural Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cinematic Full-Bleed Background Photography */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
            scale: { duration: 2.2, ease: "easeOut" },
          }}
        >
          <Image
            src={slide.bg}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover ${
              slide.id === 1
                ? "object-[78%_center] lg:object-center"
                : slide.id === 2
                  ? "object-[18%_center] lg:object-center"
                  : "object-[85%_center] lg:object-center"
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle soft dark overlay on desktop, smooth bottom gradient on mobile for bottom-left text readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#001726]/95 via-[#001726]/45 to-transparent lg:bg-navy/25"
        aria-hidden="true"
      />

      <Container className="relative z-10 w-full pt-16 pb-20 sm:pt-20 sm:pb-24 lg:py-[80px] lg:pb-[90px] text-white">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Text Column: Positioned on bottom-left with no dark box on mobile, glass card on desktop */}
          <div
            className={`transition-all duration-500 lg:col-span-6 xl:col-span-6 ${
              isTextRight
                ? "lg:order-2 flex justify-start lg:justify-end"
                : "lg:order-1 flex justify-start"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, x: isTextRight ? 24 : -24 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isTextRight ? -24 : 24 }}
                transition={{ duration: 0.45, ease: EASE }}
                className={`w-full max-w-[640px] text-left rounded-2xl border-0 lg:border border-white/10 bg-transparent lg:bg-navy/25 p-0 lg:p-6 lg:sm:p-8 lg:md:p-10 shadow-none lg:shadow-xl backdrop-blur-none lg:backdrop-blur-md ${
                  isTextRight ? "lg:ml-auto" : "lg:mr-auto"
                }`}
              >
                {/* Eyebrow Label (Hidden on mobile) */}
                <div className="hidden sm:flex mb-2 sm:mb-[20px] items-center gap-[10px] text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.14em] text-paste drop-shadow-sm">
                  {slide.eyebrow}
                </div>

                {/* Heading */}
                <h1 className="mb-2.5 sm:mb-5 text-[clamp(26px,6.8vw,58px)] font-extrabold leading-[1.14] sm:leading-[1.06] tracking-[-0.03em] text-white drop-shadow-md">
                  {headingLines.map((line, i) => (
                    <span key={i}>
                      {renderHeadingLine(line)}
                      {i < headingLines.length - 1 && <br />}
                    </span>
                  ))}
                </h1>

                {/* Subtitle / Description */}
                <p className="mb-4 sm:mb-[30px] max-w-[540px] text-[13px] sm:text-[16px] leading-[1.6] text-white/90 line-clamp-2 sm:line-clamp-none drop-shadow">
                  {slide.text}
                </p>

                {/* CTA Actions */}
                <div className="flex items-center gap-5">
                  <Button
                    href={slide.href}
                    className="max-[600px]:min-h-10 max-[600px]:px-5 max-[600px]:text-[13px] shadow-lg"
                  >
                    {slide.cta}
                  </Button>

                  <Link
                    className="hidden sm:inline-flex items-center gap-[7px] text-[13px] font-extrabold text-white transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
                    href={slide.secondaryCta?.href || "/services"}
                  >
                    {slide.secondaryCta?.text ||
                      "Explore our services"}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Rotatable Texture Magnifier Column (Right for slide 1/3, Left for slide 2) */}
          {slide.magnifier && (
            <div
              className={`hidden lg:col-span-6 lg:flex lg:items-center xl:col-span-6 ${
                isTextRight
                  ? "lg:order-1 justify-start"
                  : "lg:order-2 justify-end"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  className="relative flex items-center"
                >
                  {isBeamRtl ? (
                    /* Right-To-Left Layout (Slide 2): Lens on Left, Beam in Center, Dot on Right */
                    <>
                      {/* 1. Large Circular Lens */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0, x: 180 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: 100 }}
                        transition={{
                          duration: 0.65,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="group/lens relative z-20 shrink-0"
                      >
                        <Link
                          href={`/products/${slide.magnifier.productSlug || ""}`}
                          className="relative block"
                          aria-label={`View ${slide.magnifier.title} product details`}
                        >
                          <div className="relative size-[250px] sm:size-[290px] md:size-[330px] lg:size-[360px] overflow-hidden rounded-full border-[7px] border-white/80 bg-gradient-to-br from-navy via-[#001726] to-[#041d33] shadow-[0_24px_60px_rgba(0,18,34,0.9),0_0_40px_rgba(1,110,220,0.45)] backdrop-blur-xl transition-all duration-500 group-hover/lens:border-paste group-hover/lens:shadow-[0_30px_70px_rgba(0,18,34,0.95),0_0_60px_rgba(1,110,220,0.7)]">
                            <div
                              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,110,220,0.38)_0%,transparent_70%)]"
                              aria-hidden="true"
                            />

                            {/* Clean Studio Product Packshot */}
                            <Image
                              src={slide.magnifier.zoomImage}
                              alt={slide.magnifier.title}
                              fill
                              sizes="(max-width: 640px) 250px, (max-width: 1024px) 330px, 360px"
                              priority
                              className="object-contain p-7 sm:p-9 md:p-10 transition-transform duration-700 ease-out group-hover/lens:scale-110 drop-shadow-[0_16px_28px_rgba(0,0,0,0.75)]"
                            />

                            {/* Lighting and Sheen */}
                            <div
                              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                              aria-hidden="true"
                            />
                            <div
                              className="pointer-events-none absolute inset-0 rounded-full shadow-inner ring-1 ring-inset ring-white/25"
                              aria-hidden="true"
                            />

                            {/* Floating Product Badge & CTA */}
                            <div className="pointer-events-none absolute inset-x-3 bottom-3.5 sm:bottom-4 z-30 flex flex-col items-center justify-center">
                              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-navy/85 px-3 py-1 shadow-lg backdrop-blur-md transition-all duration-300 group-hover/lens:bg-blue group-hover/lens:border-white/50">
                                <span className="text-[11px] font-extrabold tracking-wide text-white">
                                  {slide.magnifier.title}
                                </span>
                                <ArrowUpRight
                                  size={13}
                                  className="text-paste transition-colors group-hover/lens:text-white"
                                />
                              </div>
                              {slide.magnifier.spec && (
                                <span className="mt-1 max-w-[85%] truncate text-center text-[9px] font-bold uppercase tracking-wider text-paste/90 drop-shadow">
                                  {slide.magnifier.spec}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>

                      {/* 2. Expanding Light Cone from Right to Left */}
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{
                          duration: 0.65,
                          delay: 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: "right center" }}
                        className="relative z-10 -mr-2 -ml-3 pointer-events-none shrink-0"
                      >
                        <svg
                          className="h-[190px] sm:h-[220px] lg:h-[250px] xl:h-[280px] w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 overflow-visible"
                          viewBox="0 0 240 240"
                          preserveAspectRatio="none"
                          fill="none"
                        >
                          <defs>
                            <linearGradient
                              id="beamGradientRTL"
                              x1="100%"
                              y1="50%"
                              x2="0%"
                              y2="50%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#016edc"
                                stopOpacity="0.8"
                              />
                              <stop
                                offset="30%"
                                stopColor="#016edc"
                                stopOpacity="0.45"
                              />
                              <stop
                                offset="70%"
                                stopColor="#9bcfff"
                                stopOpacity="0.2"
                              />
                              <stop
                                offset="100%"
                                stopColor="#9bcfff"
                                stopOpacity="0.08"
                              />
                            </linearGradient>
                          </defs>

                          <polygon
                            points="240,120 0,20 0,220"
                            fill="url(#beamGradientRTL)"
                          />

                          <line
                            x1="240"
                            y1="120"
                            x2="0"
                            y2="20"
                            stroke="#9bcfff"
                            strokeWidth="1.5"
                            strokeOpacity="0.95"
                          />
                          <line
                            x1="240"
                            y1="120"
                            x2="0"
                            y2="220"
                            stroke="#9bcfff"
                            strokeWidth="1.5"
                            strokeOpacity="0.95"
                          />
                        </svg>
                      </motion.div>

                      {/* 3. Target Dot on the Right */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.05,
                          ease: "easeOut",
                        }}
                        className="relative z-30 flex items-center justify-center shrink-0"
                      >
                        <div className="pointer-events-none absolute size-[52px] rounded-full border border-paste/30 bg-blue/10 shadow-[0_0_16px_rgba(1,110,220,0.3)]" />

                        <div className="relative flex size-9 items-center justify-center rounded-full border border-paste bg-navy/90 shadow-[0_0_22px_rgba(1,110,220,0.85)] backdrop-blur-md">
                          <span className="absolute h-full w-[1.5px] bg-paste" />
                          <span className="absolute w-full h-[1.5px] bg-paste" />
                          <span className="relative size-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                          <span className="absolute size-full animate-ping rounded-full border border-blue opacity-50" />
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    /* Left-To-Right Layout (Slide 1 & 3): Dot on Left, Beam in Center, Lens on Right */
                    <>
                      {/* 1. Target Sample Point on Left */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.05,
                          ease: "easeOut",
                        }}
                        className="relative z-30 flex items-center justify-center shrink-0"
                      >
                        <div className="pointer-events-none absolute size-[52px] rounded-full border border-paste/30 bg-blue/10 shadow-[0_0_16px_rgba(1,110,220,0.3)]" />

                        <div className="relative flex size-9 items-center justify-center rounded-full border border-paste bg-navy/90 shadow-[0_0_22px_rgba(1,110,220,0.85)] backdrop-blur-md">
                          <span className="absolute h-full w-[1.5px] bg-paste" />
                          <span className="absolute w-full h-[1.5px] bg-paste" />
                          <span className="relative size-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                          <span className="absolute size-full animate-ping rounded-full border border-blue opacity-50" />
                        </div>
                      </motion.div>

                      {/* 2. Expanding Light Cone from Dot to Lens */}
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{
                          duration: 0.65,
                          delay: 0.15,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: "left center" }}
                        className="relative z-10 -ml-2 -mr-3 pointer-events-none shrink-0"
                      >
                        <svg
                          className="h-[190px] sm:h-[220px] lg:h-[250px] xl:h-[280px] w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 overflow-visible"
                          viewBox="0 0 240 240"
                          preserveAspectRatio="none"
                          fill="none"
                        >
                          <defs>
                            <linearGradient
                              id="beamGradientLTR"
                              x1="0%"
                              y1="50%"
                              x2="100%"
                              y2="50%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#016edc"
                                stopOpacity="0.8"
                              />
                              <stop
                                offset="30%"
                                stopColor="#016edc"
                                stopOpacity="0.45"
                              />
                              <stop
                                offset="70%"
                                stopColor="#9bcfff"
                                stopOpacity="0.2"
                              />
                              <stop
                                offset="100%"
                                stopColor="#9bcfff"
                                stopOpacity="0.08"
                              />
                            </linearGradient>
                          </defs>

                          <polygon
                            points="0,120 240,20 240,220"
                            fill="url(#beamGradientLTR)"
                          />

                          <line
                            x1="0"
                            y1="120"
                            x2="240"
                            y2="20"
                            stroke="#9bcfff"
                            strokeWidth="1.5"
                            strokeOpacity="0.95"
                          />
                          <line
                            x1="0"
                            y1="120"
                            x2="240"
                            y2="220"
                            stroke="#9bcfff"
                            strokeWidth="1.5"
                            strokeOpacity="0.95"
                          />
                        </svg>
                      </motion.div>

                      {/* 3. Large Circular Lens */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0, x: -180 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: -100 }}
                        transition={{
                          duration: 0.65,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="group/lens relative z-20 shrink-0"
                      >
                        <Link
                          href={`/products/${slide.magnifier.productSlug || ""}`}
                          className="relative block"
                          aria-label={`View ${slide.magnifier.title} product details`}
                        >
                          <div className="relative size-[250px] sm:size-[290px] md:size-[330px] lg:size-[360px] overflow-hidden rounded-full border-[7px] border-white/80 bg-gradient-to-br from-navy via-[#001726] to-[#041d33] shadow-[0_24px_60px_rgba(0,18,34,0.9),0_0_40px_rgba(1,110,220,0.45)] backdrop-blur-xl transition-all duration-500 group-hover/lens:border-paste group-hover/lens:shadow-[0_30px_70px_rgba(0,18,34,0.95),0_0_60px_rgba(1,110,220,0.7)]">
                            <div
                              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(1,110,220,0.38)_0%,transparent_70%)]"
                              aria-hidden="true"
                            />

                            {/* Clean Studio Product Packshot */}
                            <Image
                              src={slide.magnifier.zoomImage}
                              alt={slide.magnifier.title}
                              fill
                              sizes="(max-width: 640px) 250px, (max-width: 1024px) 330px, 360px"
                              priority
                              className="object-contain p-7 sm:p-9 md:p-10 transition-transform duration-700 ease-out group-hover/lens:scale-110 drop-shadow-[0_16px_28px_rgba(0,0,0,0.75)]"
                            />

                            {/* Lighting and Sheen */}
                            <div
                              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                              aria-hidden="true"
                            />
                            <div
                              className="pointer-events-none absolute inset-0 rounded-full shadow-inner ring-1 ring-inset ring-white/25"
                              aria-hidden="true"
                            />

                            {/* Floating Product Badge & CTA */}
                            <div className="pointer-events-none absolute inset-x-3 bottom-3.5 sm:bottom-4 z-30 flex flex-col items-center justify-center">
                              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-navy/85 px-3 py-1 shadow-lg backdrop-blur-md transition-all duration-300 group-hover/lens:bg-blue group-hover/lens:border-white/50">
                                <span className="text-[11px] font-extrabold tracking-wide text-white">
                                  {slide.magnifier.title}
                                </span>
                                <ArrowUpRight
                                  size={13}
                                  className="text-paste transition-colors group-hover/lens:text-white"
                                />
                              </div>
                              {slide.magnifier.spec && (
                                <span className="mt-1 max-w-[85%] truncate text-center text-[9px] font-bold uppercase tracking-wider text-paste/90 drop-shadow">
                                  {slide.magnifier.spec}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </Container>

      {/* Slide Indicator Bars */}
      <div className="absolute z-[2] flex gap-[9px] left-4 sm:left-6 lg:left-1/2 bottom-4 sm:bottom-6 lg:bottom-[44px] -translate-x-0 lg:-translate-x-1/2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-[4px] w-[22px] sm:w-[28px] lg:w-[34px] rounded-[3px] transition-all duration-300 ${
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

      {/* Navigation Arrows */}
      <div className="absolute z-[2] flex gap-2 right-4 sm:right-6 lg:right-5 bottom-3.5 sm:bottom-5 lg:bottom-10">
        <motion.button
          className="grid size-[36px] sm:size-[40px] lg:size-[42px] place-items-center rounded-full !border !border-white/[0.3] !text-white transition-[border-color,background] duration-200 hover:border-white"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft
            size={18}
            className="lg:size-5"
            aria-hidden="true"
          />
        </motion.button>

        <motion.button
          className="grid size-[36px] sm:size-[40px] lg:size-[42px] place-items-center rounded-full !border !border-white/[0.3] !text-white transition-[border-color,background] duration-200 !hover:border-white"
          aria-label="Next slide"
          onClick={() => go(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight
            size={18}
            className="lg:size-5"
            aria-hidden="true"
          />
        </motion.button>
      </div>

      {/* Slide Counter */}
      <div className="absolute z-[2] text-[12px] text-white right-24 sm:right-28 lg:right-[125px] bottom-4 sm:bottom-6 lg:bottom-10">
        <strong className="text-[20px] sm:text-[22px] lg:text-[24px]">
          0{index + 1}
        </strong>{" "}
        / 0{slides.length}
      </div>
    </section>
  );
}
