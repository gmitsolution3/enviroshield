"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowUpRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Factory,
  Layers,
  ShieldCheck,
  SunMedium,
  Flame,
} from "lucide-react";
import Container from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { EASE } from "@/components/animations/variants";
import type { IService } from "@/types";

interface ServicesSectionContentProps {
  services: IService[];
}

interface ServiceDisplayItem {
  id: string;
  tabLabel: string;
  tabSublabel: string;
  icon: typeof Building2;
  number: string;
  title: string;
  category: string;
  systemName: string;
  description: string;
  image: string;
  textureImage: string;
  textureLabel: string;
  locationTag: string;
  projectScale: string;
  specs: Array<{ label: string; value: string; detail: string }>;
  href: string;
}

function getServiceIcon(name?: string, slug?: string) {
  const text = `${name ?? ""} ${slug ?? ""}`.toLowerCase();
  if (text.includes("water") || text.includes("leak") || text.includes("roof") || text.includes("basement"))
    return Droplets;
  if (text.includes("epoxy") || text.includes("floor") || text.includes("industry"))
    return Factory;
  if (text.includes("heat") || text.includes("thermal") || text.includes("cool"))
    return SunMedium;
  if (text.includes("joint") || text.includes("crack") || text.includes("seal"))
    return Flame;
  return Layers;
}

export default function ServicesSectionContent({
  services,
}: ServicesSectionContentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const tabsTrackRef = useRef<HTMLDivElement>(null);

  // Scroll-controlled one-by-one paint roller reveal
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 60%"],
  });

  // 1. Upper-Left Swatch Base Coat (scroll: 0.00 -> 0.22)
  const x1 = useTransform(scrollYProgress, [0.0, 0.22], ["-140%", "0%"]);
  const rot1 = useTransform(scrollYProgress, [0.0, 0.22], [-18, 0]);
  const op1 = useTransform(scrollYProgress, [0.0, 0.15], [0, 0.85]);

  // 2. Upper-Right Navy Roller (scroll: 0.10 -> 0.32)
  const x2 = useTransform(scrollYProgress, [0.1, 0.32], ["140%", "0%"]);
  const rot2 = useTransform(scrollYProgress, [0.1, 0.32], [14, 0]);
  const op2 = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  // 3. Upper-Left Green Roller (scroll: 0.20 -> 0.42)
  const x3 = useTransform(scrollYProgress, [0.2, 0.42], ["-140%", "0%"]);
  const rot3 = useTransform(scrollYProgress, [0.2, 0.42], [-14, 0]);
  const op3 = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

  // 4. Mid-Left Navy Roller Accent (scroll: 0.35 -> 0.60)
  const x4 = useTransform(scrollYProgress, [0.35, 0.6], ["-140%", "0%"]);
  const rot4 = useTransform(scrollYProgress, [0.35, 0.6], [20, 0]);
  const op4 = useTransform(scrollYProgress, [0.35, 0.5], [0, 0.9]);

  // 5. Lower-Right Green Roller Accent (scroll: 0.55 -> 0.80)
  const x5 = useTransform(scrollYProgress, [0.55, 0.8], ["140%", "0%"]);
  const rot5 = useTransform(scrollYProgress, [0.55, 0.8], [-16, 0]);
  const op5 = useTransform(scrollYProgress, [0.55, 0.7], [0, 0.85]);

  // Build display items STRICTLY from real database services (NO dummy fallback items)
  const displayItems: ServiceDisplayItem[] = useMemo(() => {
    if (!services || services.length === 0) return [];

    return services.map((service, idx) => {
      const Icon = getServiceIcon(service.name, service.slug);
      const project = service.projects?.[0];

      const combinedSpecs: Array<{
        label: string;
        value: string;
        detail: string;
      }> = [];

      if (service.benefits?.items?.length) {
        service.benefits.items.slice(0, 2).forEach((item, i) => {
          combinedSpecs.push({
            label: i === 0 ? "Key Benefit" : "Performance",
            value: item.title,
            detail: item.description,
          });
        });
      }

      if (service.whyEnviroshield?.items?.length) {
        service.whyEnviroshield.items.slice(0, 2).forEach((item, i) => {
          combinedSpecs.push({
            label: i === 0 ? "System Advantage" : "Quality Standard",
            value: item.title,
            detail: item.description,
          });
        });
      }

      if (service.process?.items?.length && combinedSpecs.length < 4) {
        service.process.items.slice(0, 4 - combinedSpecs.length).forEach((item) => {
          combinedSpecs.push({
            label: "Application Process",
            value: item.title,
            detail: item.description,
          });
        });
      }

      const locationTag = project?.location?.city
        ? `${project.location.area ? `${project.location.area} • ` : ""}${project.location.city}`
        : "Australian Standard Chemical Application • Bangladesh";

      const projectScale = project?.client?.name
        ? project.client.name
        : service.price && service.price > 0
          ? `Starting from BDT ${service.price.toLocaleString()}`
          : "Commercial & Industrial Execution";

      const image =
        service.primaryImage?.url ||
        project?.primaryImage?.url ||
        "/images/home/completed-waterproof-rooftop-coating.jpg";

      const textureImage =
        project?.primaryImage?.url ||
        service.primaryImage?.url ||
        "/images/home/rooftop-coating-surface-treatment.jpg";

      return {
        id: service._id,
        tabLabel: service.name,
        tabSublabel: service.detailHeading || service.name,
        icon: Icon,
        number: String(idx + 1).padStart(2, "0"),
        title: service.name,
        category: service.detailHeading ? "Protective System" : "Featured Service",
        systemName: service.detailHeading || service.name,
        description: service.description || "",
        image,
        textureImage,
        textureLabel: project?.title || service.name,
        locationTag,
        projectScale,
        specs: combinedSpecs,
        href: `/services/${service.slug}`,
      };
    });
  }, [services]);

  const [activeId, setActiveId] = useState<string>(() => displayItems[0]?.id || "");

  // Ensure activeId remains valid if data changes
  const activeIndex = displayItems.findIndex((it) => it.id === activeId);
  const currentSafeIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeSolution = displayItems[currentSafeIndex] ?? displayItems[0];

  const selectIndex = (index: number) => {
    if (index >= 0 && index < displayItems.length) {
      const targetItem = displayItems[index];
      setActiveId(targetItem.id);

      const tabEl = document.getElementById(`opt4-tab-${targetItem.id}`);
      if (tabEl) {
        tabEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  };

  const handlePrev = () => {
    if (displayItems.length <= 1) return;
    const nextIdx =
      (currentSafeIndex - 1 + displayItems.length) % displayItems.length;
    selectIndex(nextIdx);
  };

  const handleNext = () => {
    if (displayItems.length <= 1) return;
    const nextIdx = (currentSafeIndex + 1) % displayItems.length;
    selectIndex(nextIdx);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-heading"
      className="relative overflow-hidden bg-[#f8fafc] py-[88px] lg:py-[112px]"
    >
      {/* Subtle architectural dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00334e_0.75px,transparent_0.75px)] opacity-[0.06] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* Background Paint Roller & Brush Illustrations (Desktop only - hidden on mobile/tablet to protect readability) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none hidden lg:block"
        aria-hidden="true"
      >
        {/* 1. Upper-Left: Green Paint Swatch Base Coat */}
        <motion.div
          style={{
            x: reduce ? 0 : x1,
            rotate: reduce ? 0 : rot1,
            opacity: reduce ? 0.85 : op1,
          }}
          className="absolute -left-16 top-[110px] w-[200px] drop-shadow-[0_12px_24px_rgba(26,47,110,0.12)] max-sm:opacity-15 sm:-left-12 sm:top-[140px] sm:w-[260px] lg:-left-10 lg:top-[170px] lg:w-[320px] will-change-transform"
        >
          <Image
            src="/images/roller-paint-swatch.png"
            alt=""
            width={500}
            height={500}
            className="h-auto w-full object-contain"
            priority={false}
          />
        </motion.div>

        {/* 2. Upper-Right: Navy Paint Roller */}
        <motion.div
          style={{
            x: reduce ? 0 : x2,
            rotate: reduce ? 0 : rot2,
            opacity: reduce ? 1 : op2,
          }}
          className="absolute -right-14 top-[130px] w-[230px] drop-shadow-[0_18px_32px_rgba(26,47,110,0.18)] max-sm:opacity-20 sm:-right-10 sm:top-[170px] sm:w-[290px] lg:-right-8 lg:top-[200px] lg:w-[370px] will-change-transform"
        >
          <Image
            src="/images/roller-paint-navy.png"
            alt=""
            width={500}
            height={500}
            className="h-auto w-full object-contain"
            priority={false}
          />
        </motion.div>

        {/* 3. Upper-Left: Green Paint Roller */}
        <motion.div
          style={{
            x: reduce ? 0 : x3,
            rotate: reduce ? 0 : rot3,
            opacity: reduce ? 1 : op3,
          }}
          className="absolute -left-12 top-[170px] z-10 w-[210px] drop-shadow-[0_18px_32px_rgba(26,47,110,0.18)] max-sm:opacity-20 sm:-left-8 sm:top-[210px] sm:w-[270px] lg:-left-6 lg:top-[250px] lg:w-[350px] will-change-transform"
        >
          <Image
            src="/images/roller-paint-green.png"
            alt=""
            width={500}
            height={500}
            className="h-auto w-full object-contain"
            priority={false}
          />
        </motion.div>

        {/* 4. Mid/Lower-Left: Navy Paint Roller Accent */}
        <motion.div
          style={{
            x: reduce ? 0 : x4,
            rotate: reduce ? 0 : rot4,
            opacity: reduce ? 0.9 : op4,
          }}
          className="absolute -left-16 top-[540px] w-[220px] -scale-x-100 drop-shadow-[0_16px_28px_rgba(26,47,110,0.14)] max-sm:hidden sm:-left-12 sm:top-[600px] sm:w-[280px] lg:-left-10 lg:top-[680px] lg:w-[340px] will-change-transform"
        >
          <Image
            src="/images/roller-paint-navy.png"
            alt=""
            width={500}
            height={500}
            className="h-auto w-full object-contain"
            priority={false}
          />
        </motion.div>

        {/* 5. Lower-Right: Green Paint Roller Accent */}
        <motion.div
          style={{
            x: reduce ? 0 : x5,
            rotate: reduce ? 0 : rot5,
            opacity: reduce ? 0.85 : op5,
          }}
          className="absolute -right-16 bottom-[100px] w-[220px] -scale-x-100 drop-shadow-[0_16px_28px_rgba(26,47,110,0.14)] max-sm:hidden sm:-right-12 sm:bottom-[140px] sm:w-[270px] lg:-right-10 lg:bottom-[180px] lg:w-[330px] will-change-transform"
        >
          <Image
            src="/images/roller-paint-green.png"
            alt=""
            width={500}
            height={500}
            className="h-auto w-full object-contain"
            priority={false}
          />
        </motion.div>
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <SectionHeader
            align="center"
            eyebrow="OUR SERVICES"
            title="Complete Protection for Every Surface"
            text="From waterproofing and flooring to heat insulation and protective construction solutions, Enviro Shield delivers reliable systems designed to protect, strengthen, and extend the life of your property."
            headingId="services-heading"
          />
        </div>

        {displayItems.length > 0 ? (
          <>
            {/* Track Arrow Navigation Controls */}
            {displayItems.length > 1 && (
              <div className="mb-3 flex items-center justify-between px-1 sm:px-2">
                <span className="text-xs font-semibold text-slate-400">
                  Featured Services ({displayItems.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous service"
                    className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-navy shadow-sm transition-all duration-200 hover:border-blue hover:bg-slate-50 hover:text-blue active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next service"
                    className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-navy shadow-sm transition-all duration-200 hover:border-blue hover:bg-slate-50 hover:text-blue active:scale-95"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Horizontal Track of Service Tabs */}
            <div className="mb-8">
              <div
                ref={tabsTrackRef}
                role="tablist"
                aria-label="Featured services"
                className="flex max-w-full items-center gap-2.5 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white/90 p-2.5 shadow-sm backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {displayItems.map((item, index) => {
                  const isSelected = activeSolution?.id === item.id;
                  const IconComponent = item.icon;

                  return (
                    <button
                      key={item.id}
                      id={`opt4-tab-${item.id}`}
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => selectIndex(index)}
                      className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue ${
                        isSelected
                          ? "bg-navy text-white shadow-md shadow-navy/25"
                          : "bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-navy"
                      }`}
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isSelected
                            ? "bg-white/15 text-paste"
                            : "bg-white text-slate-500 shadow-sm group-hover:text-blue"
                        }`}
                      >
                        <IconComponent size={18} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-black tracking-wider uppercase ${
                              isSelected ? "text-paste" : "text-blue"
                            }`}
                          >
                            {item.number}
                          </span>
                          <span className="block text-xs font-extrabold tracking-tight sm:text-sm">
                            {item.tabLabel}
                          </span>
                        </div>
                        <span
                          className={`block max-w-[140px] truncate text-[10px] font-medium transition-colors ${
                            isSelected
                              ? "text-slate-300"
                              : "text-slate-400 group-hover:text-slate-500"
                          }`}
                        >
                          {item.tabSublabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Architectural Showcase Card */}
            {activeSolution && (
              <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-9 lg:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSolution.id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
                  >
                    {/* Left Column: Solution Narrative & Technical Grid */}
                    <div className="lg:col-span-6 xl:col-span-7">
                      {/* Eyebrow & Category */}
                      <div className="mb-3 flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue/20 bg-blue/5 px-3 py-1 text-[11px] font-extrabold tracking-wider text-blue uppercase">
                          <ShieldCheck size={13} className="text-blue" />
                          {activeSolution.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          Service {activeSolution.number} of{" "}
                          {String(displayItems.length).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Main Heading */}
                      <h3 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl lg:text-[38px] lg:leading-[1.12]">
                        {activeSolution.title}
                      </h3>

                      {/* System Subtitle */}
                      <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500 sm:text-sm">
                        <Layers size={15} className="shrink-0 text-blue" />
                        <span className="line-clamp-2">
                          {activeSolution.systemName}
                        </span>
                      </div>

                      {/* Description Paragraph */}
                      <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {activeSolution.description}
                      </p>

                      {/* Technical Specifications Grid */}
                      {activeSolution.specs.length > 0 && (
                        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {activeSolution.specs.map((spec, i) => (
                            <div
                              key={i}
                              className="group rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-200 hover:border-blue/30 hover:bg-white hover:shadow-sm"
                            >
                              <span className="block text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                                {spec.label}
                              </span>
                              <strong className="mt-1 block truncate text-sm font-extrabold text-navy">
                                {spec.value}
                              </strong>
                              <span className="mt-0.5 block line-clamp-2 text-xs text-slate-500">
                                {spec.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA Action Buttons */}
                      <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
                        <Button href="/contact">
                          Request On-Site Assessment
                        </Button>

                        <Link
                          href={activeSolution.href}
                          className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider text-navy uppercase transition-colors hover:text-blue"
                        >
                          Explore Service Details
                          <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Architectural Photography & Micro Loupe Texture Inspection */}
                    <div className="lg:col-span-6 xl:col-span-5">
                      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-lg">
                        <Image
                          src={activeSolution.image}
                          alt={activeSolution.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 550px"
                          priority
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Gradient bottom overlay for tags */}
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent"
                          aria-hidden="true"
                        />

                        {/* Top Floating Location Pill */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/40 bg-navy/80 px-3.5 py-1.5 shadow-md backdrop-blur-md">
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-paste opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-paste" />
                          </span>
                          <span className="text-[11px] font-bold tracking-wide text-white">
                            {activeSolution.locationTag}
                          </span>
                        </div>

                        {/* Bottom Surface Badge */}
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="text-[10px] font-extrabold tracking-widest text-paste uppercase">
                            Field Execution
                          </span>
                          <p className="text-sm font-extrabold text-white">
                            {activeSolution.projectScale}
                          </p>
                        </div>

                        {/* Signature Texture Inspection Loupe Badge */}
                        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2.5 rounded-2xl border border-white/30 bg-white/95 p-2 shadow-2xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-paste/60 shadow-inner">
                            <Image
                              src={activeSolution.textureImage}
                              alt={activeSolution.textureLabel}
                              fill
                              className="scale-125 object-cover"
                            />
                            {/* Reticle Crosshair */}
                            <span className="absolute inset-x-0 top-1/2 h-px bg-white/80" />
                            <span className="absolute inset-y-0 left-1/2 w-px bg-white/80" />
                          </div>
                          <div className="pr-1 text-left">
                            <span className="block text-[9px] font-extrabold tracking-wider text-slate-400 uppercase">
                              Micro-Texture
                            </span>
                            <span className="block max-w-[110px] truncate text-[11px] font-extrabold text-navy">
                              {activeSolution.textureLabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          /* Empty State: If no featured services exist */
          <div className="mx-auto my-12 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Layers size={24} />
            </div>
            <h4 className="text-base font-bold text-navy">No Featured Services Available</h4>
            <p className="mt-2 text-sm text-slate-500">
              Featured services are currently being updated. Please visit our services page to explore our complete range.
            </p>
            <div className="mt-6">
              <Button href="/services" variant="outline">
                View All Services
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
