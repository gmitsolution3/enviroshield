"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/Container";
import { Button } from "@/components/Button";
import { EASE } from "@/components/animations/variants";
import { ISlide } from "@/types";

const slides: ISlide[] = [
  {
    id: 1,
    bg: "/images/slide-hero-1.png",
    alt: "Commercial building roof waterproofing application",
    eyebrow: "AUSTRALIAN FORMULATION • BANGLADESH EXCELLENCE",
    heading: "An *Australian Brand*\nin Bangladesh Since 2009",
    text: "Engineered waterproofing systems protecting commercial landmarks and industrial infrastructure across Bangladesh with advanced elastomeric polymers and monolithic membranes.",
    cta: "Talk to Our Engineers",
    href: "/contact",
    layout: "text-left",
    secondaryCta: {
      text: "Explore 7-Layer Method",
      href: "/#process-heading",
    },
    magnifier: {
      targetPoint: { x: 74, y: 58 },
      zoomImage: "https://res.cloudinary.com/dknitablq/image/upload/v1794639188/enviroshield/jlry2ofqvywykhfiezjz.png",
      title: "Gum Shield",
      spec: "Liquid Elastomeric Waterproofing",
      productSlug: "gum-shield",
      beamDirection: "left-to-right",
    },
  },
  {
    id: 2,
    bg: "/images/slide-hero-2.png",
    alt: "Industrial epoxy and polyurethane flooring application",
    eyebrow: "INDUSTRIAL PERFORMANCE • SEAMLESS RESIN SYSTEMS",
    heading: "Built to protect.\n*Engineered to last.*",
    text: "From heavy-duty pharmaceutical cleanrooms to garment production floors, we deliver seamless resinous flooring designed for high mechanical and chemical resistance.",
    cta: "Request System Specs",
    href: "/contact",
    layout: "text-right",
    secondaryCta: {
      text: "View Completed Projects",
      href: "/projects",
    },
    magnifier: {
      targetPoint: { x: 26, y: 68 },
      zoomImage: "https://res.cloudinary.com/dknitablq/image/upload/v1794644805/enviroshield/u0pbhn2dlfhxgwy5aieo.png",
      title: "Epoxy Flooring Kit",
      spec: "High-Build Self-Leveling Resinous System",
      productSlug: "epoxy-flooring-kit",
      beamDirection: "right-to-left",
    },
  },
  {
    id: 3,
    bg: "/images/slide-hero-3.png",
    alt: "Rooftop terrace protective waterproofing membrane",
    eyebrow: "MONSOON RESILIENCE • MONOLITHIC COATINGS",
    heading: "Stronger protection.\n*Smarter solutions.*",
    text: "Proven polymer chemistry engineered specifically for high-humidity climates, ponding rainwater, and severe thermal slab expansion across Bangladesh.",
    cta: "Start Your Project",
    href: "/contact",
    layout: "text-left",
    secondaryCta: {
      text: "Download Product TDS",
      href: "/products",
    },
    magnifier: {
      targetPoint: { x: 72, y: 46 },
      zoomImage: "https://res.cloudinary.com/dknitablq/image/upload/v1794484148/enviroshield/rvrxtc4ccyb4hkrhjmie.png",
      title: "PU Aqua Shield",
      spec: "Polyurethane UV Cool Roof Barrier",
      productSlug: "pu-aqua-shield",
      beamDirection: "left-to-right",
    },
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

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduce = useReducedMotion();
  const slide = slides[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [index]);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  };

  const headingLines = slide.heading.split("\n");
  const isTextRight = slide.layout === "text-right";
  const isBeamRtl = slide.magnifier?.beamDirection === "right-to-left";

  return (
    <section
      className="relative flex min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[820px] items-center overflow-hidden bg-[#001726]"
      aria-label="EnviroShield Architectural Showcase"
    >
      {/* Cinematic Full-Bleed Background Photography */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
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
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle soft dark overlay on top of hero image */}
      <div
        className="pointer-events-none absolute inset-0 bg-navy/25"
        aria-hidden="true"
      />

      <Container className="relative z-10 py-[80px] pb-[90px] text-white max-[900px]:py-[60px] max-[600px]:py-[36px] max-[600px]:pb-[50px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Rotatable Text Column (Left for slide 1/3, Right for slide 2) */}
          <div
            className={`transition-all duration-500 lg:col-span-6 xl:col-span-6 ${
              isTextRight
                ? "lg:order-2 flex justify-end"
                : "lg:order-1 flex justify-start"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: isTextRight ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isTextRight ? -24 : 24 }}
                transition={{ duration: 0.45, ease: EASE }}
                className={`w-full max-w-[640px] rounded-2xl border border-white/10 bg-navy/25 p-6 shadow-xl backdrop-blur-md max-[600px]:p-5 sm:p-8 md:p-10 ${
                  isTextRight ? "ml-auto" : "mr-auto"
                }`}
              >
                {/* Previous Eyebrow Font Style */}
                <div className="mb-2.5 sm:mb-[20px] flex items-center gap-[10px] text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.14em] text-paste">
                  <span className="inline-block h-[2px] w-6 bg-current" aria-hidden="true" />
                  {slide.eyebrow}
                </div>

                {/* Previous Heading Font Style */}
                <h1 className="mb-3 sm:mb-5 text-[clamp(28px,7vw,58px)] font-extrabold leading-[1.12] sm:leading-[1.06] tracking-[-0.03em] text-white">
                  {headingLines.map((line, i) => (
                    <span key={i}>
                      {renderHeadingLine(line)}
                      {i < headingLines.length - 1 && <br />}
                    </span>
                  ))}
                </h1>

                {/* Subtitle / Description (Concise 2 lines on mobile, full on tablet/desktop) */}
                <p className="mb-5 sm:mb-[30px] max-w-[540px] text-[14px] sm:text-[16px] leading-[1.6] text-white/90 line-clamp-2 sm:line-clamp-none">
                  {slide.text}
                </p>

                {/* CTA Action (Single comfortable button on mobile, primary + secondary on desktop) */}
                <div className="flex items-center gap-5">
                  <Button
                    href={slide.href}
                    className="max-[600px]:min-h-11 max-[600px]:px-5 max-[600px]:text-[13px]"
                  >
                    {slide.cta}
                  </Button>

                  <Link
                    className="hidden sm:inline-flex items-center gap-[7px] text-[13px] font-extrabold text-white transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
                    href="/services"
                  >
                    Explore our services
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
                      {/* 1. Large Circular Lens (Scales & blooms outward directly from the Dot on the Right) */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0, x: 180 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: 100 }}
                        transition={{
                          duration: 0.75,
                          delay: 0.2,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: "right center" }}
                        className="relative z-20 shrink-0"
                      >
                        <Link
                          href={slide.magnifier.productSlug ? `/products/${slide.magnifier.productSlug}` : slide.href}
                          aria-label={`View ${slide.magnifier.title}`}
                          className="group/lens block relative size-[250px] sm:size-[280px] md:size-[310px] lg:size-[330px] xl:size-[360px] cursor-pointer"
                        >
                          <div className="pointer-events-none absolute -inset-3 sm:-inset-4 rounded-full border border-paste/40 shadow-[0_0_30px_rgba(155,207,255,0.3)] transition-all duration-300 group-hover/lens:border-paste group-hover/lens:shadow-[0_0_45px_rgba(155,207,255,0.55)]" />
                          <div className="pointer-events-none absolute -inset-6 sm:-inset-7 rounded-full border border-blue/20" />

                          <div className="relative size-full overflow-hidden rounded-full border-[2.5px] border-paste/80 bg-gradient-to-b from-[#002238] via-[#001726] to-[#000d18] shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
                            {/* Radial Spotlight Backdrop */}
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
                                <ArrowUpRight size={13} className="text-paste transition-colors group-hover/lens:text-white" />
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

                      {/* 2. Expanding Light Cone / Projection Beam pointing Left towards Lens */}
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
                            <linearGradient id="beamGradientRTL" x1="100%" y1="50%" x2="0%" y2="50%">
                              <stop offset="0%" stopColor="#016edc" stopOpacity="0.8" />
                              <stop offset="30%" stopColor="#016edc" stopOpacity="0.45" />
                              <stop offset="70%" stopColor="#9bcfff" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#9bcfff" stopOpacity="0.08" />
                            </linearGradient>
                          </defs>

                          {/* Projection Cone Fill */}
                          <path
                            d="M 240,120 L 0,15 A 190,190 0 0,1 0,225 Z"
                            fill="url(#beamGradientRTL)"
                          />

                          {/* Outer Border Boundary Rays */}
                          <line x1="240" y1="120" x2="0" y2="15" stroke="#9bcfff" strokeWidth="1.2" strokeOpacity="0.85" />
                          <line x1="240" y1="120" x2="0" y2="225" stroke="#9bcfff" strokeWidth="1.2" strokeOpacity="0.85" />

                          {/* Concentric Wave / Radar Ripple Arcs (matching reference screenshot) */}
                          <path
                            d="M 55,39 A 180,180 0 0,1 55,201"
                            stroke="#9bcfff"
                            strokeWidth="1.2"
                            strokeOpacity="0.65"
                          />
                          <path
                            d="M 100,58 A 150,150 0 0,1 100,182"
                            stroke="#9bcfff"
                            strokeWidth="1"
                            strokeOpacity="0.45"
                          />
                          <path
                            d="M 145,78 A 120,120 0 0,1 145,162"
                            stroke="#9bcfff"
                            strokeWidth="1"
                            strokeOpacity="0.3"
                          />
                        </svg>
                      </motion.div>

                      {/* 3. Target Dot on the Right (with Concentric Outer Halo Ring) */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
                        className="relative z-30 flex items-center justify-center shrink-0"
                      >
                        {/* Outer soft stationary halo ring matching reference */}
                        <div className="pointer-events-none absolute size-[52px] rounded-full border border-paste/30 bg-blue/10 shadow-[0_0_16px_rgba(1,110,220,0.3)]" />

                        {/* Crosshairs Reticle */}
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
                      {/* 1. Target Sample Point on Left (with Concentric Outer Halo Ring) */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
                        className="relative z-30 flex items-center justify-center shrink-0"
                      >
                        {/* Outer soft stationary halo ring matching reference */}
                        <div className="pointer-events-none absolute size-[52px] rounded-full border border-paste/30 bg-blue/10 shadow-[0_0_16px_rgba(1,110,220,0.3)]" />

                        {/* Crosshairs Reticle */}
                        <div className="relative flex size-9 items-center justify-center rounded-full border border-paste bg-navy/90 shadow-[0_0_22px_rgba(1,110,220,0.85)] backdrop-blur-md">
                          <span className="absolute h-full w-[1.5px] bg-paste" />
                          <span className="absolute w-full h-[1.5px] bg-paste" />
                          <span className="relative size-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                          <span className="absolute size-full animate-ping rounded-full border border-blue opacity-50" />
                        </div>
                      </motion.div>

                      {/* 2. Expanding Light Cone / Projection Beam from Dot */}
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
                            <linearGradient id="beamGradientLTR" x1="0%" y1="50%" x2="100%" y2="50%">
                              <stop offset="0%" stopColor="#016edc" stopOpacity="0.8" />
                              <stop offset="30%" stopColor="#016edc" stopOpacity="0.45" />
                              <stop offset="70%" stopColor="#9bcfff" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#9bcfff" stopOpacity="0.08" />
                            </linearGradient>
                          </defs>

                          {/* Projection Cone Fill */}
                          <path
                            d="M 0,120 L 240,15 A 190,190 0 0,0 240,225 Z"
                            fill="url(#beamGradientLTR)"
                          />

                          {/* Outer Border Boundary Rays */}
                          <line x1="0" y1="120" x2="240" y2="15" stroke="#9bcfff" strokeWidth="1.2" strokeOpacity="0.85" />
                          <line x1="0" y1="120" x2="240" y2="225" stroke="#9bcfff" strokeWidth="1.2" strokeOpacity="0.85" />

                          {/* Concentric Wave / Radar Ripple Arcs (matching reference screenshot) */}
                          <path
                            d="M 185,39 A 180,180 0 0,0 185,201"
                            stroke="#9bcfff"
                            strokeWidth="1.2"
                            strokeOpacity="0.65"
                          />
                          <path
                            d="M 140,58 A 150,150 0 0,0 140,182"
                            stroke="#9bcfff"
                            strokeWidth="1"
                            strokeOpacity="0.45"
                          />
                          <path
                            d="M 95,78 A 120,120 0 0,0 95,162"
                            stroke="#9bcfff"
                            strokeWidth="1"
                            strokeOpacity="0.3"
                          />
                        </svg>
                      </motion.div>

                      {/* 3. Circular Magnifier Lens (Scales & blooms outward directly from the Dot on the Left) */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0, x: -180 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: -100 }}
                        transition={{
                          duration: 0.75,
                          delay: 0.2,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: "left center" }}
                        className="relative z-20 shrink-0"
                      >
                        <Link
                          href={slide.magnifier.productSlug ? `/products/${slide.magnifier.productSlug}` : slide.href}
                          aria-label={`View ${slide.magnifier.title}`}
                          className="group/lens block relative size-[250px] sm:size-[280px] md:size-[310px] lg:size-[330px] xl:size-[360px] cursor-pointer"
                        >
                          <div className="pointer-events-none absolute -inset-3 sm:-inset-4 rounded-full border border-paste/40 shadow-[0_0_30px_rgba(155,207,255,0.3)] transition-all duration-300 group-hover/lens:border-paste group-hover/lens:shadow-[0_0_45px_rgba(155,207,255,0.55)]" />
                          <div className="pointer-events-none absolute -inset-6 sm:-inset-7 rounded-full border border-blue/20" />

                          <div className="relative size-full overflow-hidden rounded-full border-[2.5px] border-paste/80 bg-gradient-to-b from-[#002238] via-[#001726] to-[#000d18] shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
                            {/* Radial Spotlight Backdrop */}
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
                                <ArrowUpRight size={13} className="text-paste transition-colors group-hover/lens:text-white" />
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

      {/* Previous Style Bottom Controls */}
      <div className="absolute bottom-[44px] left-1/2 z-[2] flex -translate-x-1/2 gap-[9px]">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-[4px] w-[34px] rounded-[3px] transition-all duration-300 ${
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
        <strong className="text-[24px]">0{index + 1}</strong> / 0{slides.length}
      </div>
    </section>
  );
}
