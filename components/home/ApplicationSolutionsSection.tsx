"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Droplets,
  Factory,
  Layers,
  ShieldCheck,
  Sparkles,
  SunMedium,
} from "lucide-react";
import Container from "../Container";
import { SectionHeader } from "../SectionHeader";
import { Button } from "../Button";
import { EASE } from "../animations/variants";

interface SolutionItem {
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
  specs: {
    label: string;
    value: string;
    detail: string;
  }[];
  href: string;
}

const SOLUTIONS: SolutionItem[] = [
  {
    id: "roof-waterproofing",
    tabLabel: "Rooftops & Terraces",
    tabSublabel: "Monolithic Membrane",
    icon: Building2,
    number: "01",
    title: "Monolithic Rooftop Membranes",
    category: "ROOF & TERRACE ENVELOPE",
    systemName: "Enviro Supreme™ 7-Layer Elastomeric System",
    description:
      "A joint-free multi-layer liquid membrane engineered to withstand severe tropical monsoon pooling, structural slab micro-movements, and intense UV exposure without cracking or peeling.",
    image: "/images/home/completed-waterproof-rooftop-coating.jpg",
    textureImage: "/images/home/rooftop-coating-surface-treatment.jpg",
    textureLabel: "Seamless UV AquaShield",
    locationTag: "Commercial Terrace • Dhaka",
    projectScale: "18,500 sq ft Coverage",
    specs: [
      {
        label: "Elastic Elongation",
        value: "300% Elastic",
        detail: "Bridges slab thermal micro-cracks",
      },
      {
        label: "Membrane Structure",
        value: "7-Layer Monolithic",
        detail: "100% joint-free seamless barrier",
      },
      {
        label: "Durability Standard",
        value: "10–15 Years",
        detail: "Engineered for tropical monsoons",
      },
      {
        label: "Surface Traffic",
        value: "Walkable UV Finish",
        detail: "Non-slip anti-fungal barrier",
      },
    ],
    href: "/services",
  },
  {
    id: "epoxy-flooring",
    tabLabel: "Industrial Cleanrooms",
    tabSublabel: "Heavy-Duty Resinous",
    icon: Factory,
    number: "02",
    title: "Heavy-Duty Resinous Flooring",
    category: "MANUFACTURING & CLEANROOMS",
    systemName: "High-Build Self-Leveling Epoxy & Polyurethane",
    description:
      "Seamless, non-porous floor systems formulated for high-traffic manufacturing facilities, pharmaceutical cleanrooms, and warehouses requiring extreme chemical and mechanical abrasion resistance.",
    image: "/images/slide-two.png",
    textureImage: "/images/home/terrace-waterproofing-protective-floor.png",
    textureLabel: "Anti-Abrasion Mirror Finish",
    locationTag: "Pharmaceutical Plant • Chattogram",
    projectScale: "42,000 sq ft Facility",
    specs: [
      {
        label: "Compressive Strength",
        value: "> 70 N/mm²",
        detail: "Resists heavy forklift vibration",
      },
      {
        label: "Chemical Defense",
        value: "Acid & Alkali Proof",
        detail: "Resistant to aggressive solvents",
      },
      {
        label: "Hygiene Class",
        value: "100% Dust-Proof",
        detail: "Meets cGMP cleanroom protocols",
      },
      {
        label: "Environmental",
        value: "Zero-VOC Safe",
        detail: "Solvent-free odourless application",
      },
    ],
    href: "/services",
  },
  {
    id: "basement-tanking",
    tabLabel: "Basements & Reservoirs",
    tabSublabel: "Hydrostatic Tanking",
    icon: Droplets,
    number: "03",
    title: "Hydrostatic Basement Tanking",
    category: "SUBTERRANEAN STRUCTURES",
    systemName: "Deep Crystalline & Polyurethane Injection Grout",
    description:
      "Engineered to permanently stop active water ingress through subterranean retaining walls, basement slabs, and water reservoirs under intense hydrostatic pressure.",
    image: "/images/home/rooftop-coating-surface-treatment.jpg",
    textureImage: "/images/about-2.png",
    textureLabel: "Deep Hydrophilic Seal",
    locationTag: "Underground Reservoir • Dhaka",
    projectScale: "3-Level Substructure",
    specs: [
      {
        label: "Pressure Rating",
        value: "High Hydrostatic Head",
        detail: "Engineered for high water table",
      },
      {
        label: "Active Sealing",
        value: "Hydrophilic Foam",
        detail: "Expands up to 800% to seal leaks",
      },
      {
        label: "Crystalline Action",
        value: "Deep Pore Sealing",
        detail: "Reacts with moisture inside concrete",
      },
      {
        label: "Structural Scope",
        value: "Retaining & Lift Pits",
        detail: "Permanent subterranean barrier",
      },
    ],
    href: "/services",
  },
  {
    id: "heat-shield",
    tabLabel: "Solar Cool Roofs",
    tabSublabel: "Thermal Heat Barrier",
    icon: SunMedium,
    number: "04",
    title: "Solar Reflective Thermal Barrier",
    category: "ENERGY CONSERVATION & COOL ROOFS",
    systemName: "Enviro ThermShield™ Reflective Cool Roof",
    description:
      "Micro-ceramic vacuum sphere technology deflecting up to 85% of solar infrared rays, reducing building surface temperatures by up to 8°C and cutting air conditioning energy demand.",
    image: "/images/slide-three.png",
    textureImage: "/images/home/completed-waterproof-rooftop-coating.jpg",
    textureLabel: "Solar Reflective Shield",
    locationTag: "Corporate Rooftop • Mirpur",
    projectScale: "26,000 sq ft Area",
    specs: [
      {
        label: "Solar Reflectance",
        value: "SRI > 105",
        detail: "Reflects 85% solar infrared rays",
      },
      {
        label: "Surface Cooling",
        value: "Up to 8°C Drop",
        detail: "Substantially cooler slab surface",
      },
      {
        label: "Energy Savings",
        value: "Up to 25% AC Cut",
        detail: "Cuts daytime cooling power draw",
      },
      {
        label: "Polymer Base",
        value: "Pure Elastomeric",
        detail: "UV-stable flexible thermal barrier",
      },
    ],
    href: "/services",
  },
];

export default function ApplicationSolutionsSection() {
  const [activeId, setActiveId] = useState(SOLUTIONS[0].id);
  const reduce = useReducedMotion();
  const activeSolution =
    SOLUTIONS.find((s) => s.id === activeId) || SOLUTIONS[0];

  return (
    <section
      aria-labelledby="application-scenarios-heading"
      className="relative overflow-hidden bg-[#f8fafc] py-[100px] lg:py-[120px]"
    >
      {/* Subtle architectural dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00334e_0.75px,transparent_0.75px)] opacity-[0.06] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <SectionHeader
            align="center"
            eyebrow="APPLICATION ENVIRONMENTS"
            title="Engineered Solutions for Critical Substrates"
            text="From monsoon-exposed rooftops to high-traffic industrial floors, explore how our Australian-formulated systems protect Bangladesh's most demanding structures."
            headingId="application-scenarios-heading"
          />
        </div>

        {/* 4 Interactive Scenario Selector Tabs */}
        <div className="mb-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Application scenarios"
            className="flex max-w-full items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white/90 p-2 shadow-sm backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {SOLUTIONS.map((item) => {
              const isSelected = item.id === activeId;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(item.id)}
                  className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 focus:outline-none sm:px-5 sm:py-3.5 ${
                    isSelected ? "text-white" : "text-slate-600 hover:text-navy"
                  }`}
                >
                  {/* Active Tab Spring Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeScenarioPill"
                      className="absolute inset-0 rounded-xl bg-navy shadow-md shadow-navy/20"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}

                  {/* Icon & Label */}
                  <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200">
                    <span
                      className={`grid size-full place-items-center rounded-lg ${
                        isSelected
                          ? "bg-blue text-white border-transparent"
                          : "border-slate-200 bg-slate-50 text-blue group-hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                  </span>

                  <div className="relative z-10 text-left">
                    <span className="block text-xs font-extrabold tracking-tight sm:text-sm">
                      {item.tabLabel}
                    </span>
                    <span
                      className={`block text-[10px] font-medium transition-colors ${
                        isSelected ? "text-paste" : "text-slate-400 group-hover:text-slate-500"
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
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-9 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSolution.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
            >
              {/* Left Column: Solution Narrative & Technical Grid */}
              <div className="lg:col-span-6 xl:col-span-7">
                {/* Eyebrow & Category */}
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue/20 bg-blue/5 px-3 py-1 text-[11px] font-extrabold tracking-wider text-blue uppercase">
                    <Sparkles size={12} className="text-blue" />
                    {activeSolution.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Scenario {activeSolution.number} of 04
                  </span>
                </div>

                {/* Main Heading */}
                <h3 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl lg:text-[38px] lg:leading-[1.12]">
                  {activeSolution.title}
                </h3>

                {/* System Subtitle */}
                <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500 sm:text-sm">
                  <Layers size={15} className="text-blue shrink-0" />
                  <span>{activeSolution.systemName}</span>
                </div>

                {/* Description Paragraph */}
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {activeSolution.description}
                </p>

                {/* Technical Specifications 2x2 Grid */}
                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {activeSolution.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="group rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-200 hover:border-blue/30 hover:bg-white hover:shadow-sm"
                    >
                      <span className="block text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                        {spec.label}
                      </span>
                      <strong className="mt-1 block text-sm font-extrabold text-navy">
                        {spec.value}
                      </strong>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {spec.detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
                  <Button href="/contact">
                    Request On-Site Assessment
                  </Button>

                  <Link
                    href={activeSolution.href}
                    className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider text-navy uppercase transition-colors hover:text-blue"
                  >
                    View System Specs
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"
                    aria-hidden="true"
                  />

                  {/* Top Floating Location Pill */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/40 bg-navy/80 px-3.5 py-1.5 shadow-md backdrop-blur-md">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-paste opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-paste" />
                    </span>
                    <span className="text-[11px] font-bold text-white tracking-wide">
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

                  {/* Signature Texture Inspection Loupe Badge (Connecting to Hero Slider concept!) */}
                  <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2.5 rounded-2xl border border-white/30 bg-white/95 p-2 shadow-2xl backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-paste/60 shadow-inner">
                      <Image
                        src={activeSolution.textureImage}
                        alt={activeSolution.textureLabel}
                        fill
                        className="object-cover scale-125"
                      />
                      {/* Reticle Crosshair */}
                      <span className="absolute inset-x-0 top-1/2 h-px bg-white/80" />
                      <span className="absolute inset-y-0 left-1/2 w-px bg-white/80" />
                      <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue" />
                    </div>
                    <div className="pr-1 text-left">
                      <span className="block text-[9px] font-extrabold tracking-wider text-blue uppercase">
                        Texture Detail
                      </span>
                      <span className="block text-xs font-bold text-navy">
                        {activeSolution.textureLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200/80 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center justify-center gap-3 py-4 text-center sm:py-5">
            <ShieldCheck size={20} className="text-blue shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-navy">
              10–15 Years Comprehensive Warranty
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 py-4 text-center sm:py-5">
            <CheckCircle2 size={20} className="text-blue shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-navy">
              Certified Chemical & Civil Engineers
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 py-4 text-center sm:py-5">
            <Layers size={20} className="text-blue shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-navy">
              Proven Australian Formulations
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
