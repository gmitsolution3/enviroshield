"use client";

import { useMemo, useRef, useState } from "react";
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

// 8 Comprehensive Default Services (Guarantees 8 complete featured services)
const EIGHT_FEATURED_SERVICES: Array<{
  _id: string;
  name: string;
  slug: string;
  detailHeading: string;
  tag: string;
  description: string;
  image: string;
  textureImage: string;
  textureLabel: string;
  locationTag: string;
  projectScale: string;
  specs: Array<{ label: string; value: string; detail: string }>;
}> = [
  {
    _id: "rooftop-waterproofing",
    name: "Rooftop Waterproofing",
    slug: "rooftop-waterproofing",
    detailHeading: "Enviro Supreme™ 7-Layer Elastomeric System",
    tag: "Monolithic Membrane",
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
  },
  {
    _id: "epoxy-flooring",
    name: "Industrial Epoxy Flooring",
    slug: "epoxy-flooring",
    detailHeading: "High-Build Self-Leveling Resinous System",
    tag: "Heavy-Duty Resinous",
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
  },
  {
    _id: "basement-waterproofing",
    name: "Basement Waterproofing",
    slug: "basement-waterproofing",
    detailHeading: "Deep Crystalline & Polyurethane Injection Grouting",
    tag: "Hydrostatic Tanking",
    description:
      "Engineered to permanently stop active water ingress through subterranean retaining walls, basement slabs, and water reservoirs under intense hydrostatic groundwater pressure.",
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
        detail: "Self-heals hairline micro-cracks",
      },
      {
        label: "Structural Life",
        value: "Permanent Barrier",
        detail: "Protects foundation rebar against rust",
      },
    ],
  },
  {
    _id: "pu-flooring",
    name: "PU Flooring & Coatings",
    slug: "pu-flooring",
    detailHeading: "Flexible Polyurethane Thermal & Impact Barrier",
    tag: "Thermal Shock Resistant",
    description:
      "Thermal shock-resistant and crack-bridging polyurethane systems ideal for food processing plants, cold storages, sports facilities, and heavy-duty industrial zones.",
    image: "/images/about-3.png",
    textureImage: "/images/about-1.png",
    textureLabel: "Tough Elastic PU Matrix",
    locationTag: "Cold Storage Facility • Gazipur",
    projectScale: "25,000 sq ft Facility",
    specs: [
      {
        label: "Thermal Shock",
        value: "-40°C to +120°C",
        detail: "Withstands live steam cleaning",
      },
      {
        label: "Crack Bridging",
        value: "High Elasticity",
        detail: "Absorbs substrate vibrations",
      },
      {
        label: "Impact Resistance",
        value: "Heavy Load Rated",
        detail: "Resists dropped tool impact",
      },
      {
        label: "Finish Options",
        value: "Matte / Gloss Slip-Safe",
        detail: "Customized coefficient of friction",
      },
    ],
  },
  {
    _id: "heat-proofing",
    name: "Heat Proofing & Solar Shield",
    slug: "heat-proofing",
    detailHeading: "High-Albedo Thermal Reflective Roof Barrier",
    tag: "Thermal Insulation Barrier",
    description:
      "Solar reflective elastomer coating engineered to reflect up to 90% of solar radiation, dramatically dropping indoor surface temperatures by up to 8°C and cutting HVAC electricity costs.",
    image: "/images/home/completed-waterproof-rooftop-coating.jpg",
    textureImage: "/images/home/rooftop-coating-surface-treatment.jpg",
    textureLabel: "High-Albedo Solar Shield",
    locationTag: "Industrial Textile Mill • Narayanganj",
    projectScale: "65,000 sq ft Factory Roof",
    specs: [
      {
        label: "Solar Reflectance",
        value: "SRI > 105",
        detail: "Reflects solar UV & infra-red heat",
      },
      {
        label: "Temp Reduction",
        value: "6°C to 8°C Cooler",
        detail: "Significantly reduces indoor heat load",
      },
      {
        label: "Energy Savings",
        value: "Up to 25% Power",
        detail: "Cuts industrial HVAC consumption",
      },
      {
        label: "Dual Protection",
        value: "Thermal + Waterproof",
        detail: "Elastic monolithic barrier",
      },
    ],
  },
  {
    _id: "expansion-joint-sealing",
    name: "Expansion Joint Sealing",
    slug: "expansion-joint-sealing",
    detailHeading: "Heavy-Movement Elastomeric Joint Systems",
    tag: "Structural Movement Joint",
    description:
      "Engineered flexible joint sealing using high-modulus polyurethane sealants and mechanical covers designed to accommodate continuous building expansion, contraction, and seismic settling.",
    image: "/images/about-2.png",
    textureImage: "/images/about-3.png",
    textureLabel: "Flexible Polyurethane Bead",
    locationTag: "Commercial Tower • Gulshan, Dhaka",
    projectScale: "3,200 Running Metres",
    specs: [
      {
        label: "Movement Capability",
        value: "±25% to ±50%",
        detail: "Accommodates dynamic building shifts",
      },
      {
        label: "Waterhead Resistance",
        value: "100% Watertight",
        detail: "Tested under positive water head",
      },
      {
        label: "Adhesion Strength",
        value: "High-Tack Primer",
        detail: "Bonds strongly to concrete & steel",
      },
      {
        label: "Weathering Life",
        value: "Ozone & UV Resistant",
        detail: "Zero cracking under tropical heat",
      },
    ],
  },
  {
    _id: "sports-flooring",
    name: "Sports & Cushion Flooring",
    slug: "sports-flooring",
    detailHeading: "Multi-Sport Seamless Polyurethane Cushion",
    tag: "Resilient Athletic Floor",
    description:
      "Point-elastic and area-elastic sports flooring systems for indoor basketball, badminton, tennis, and gymnasiums providing optimal shock absorption and player joint protection.",
    image: "/images/slide-two.png",
    textureImage: "/images/home/terrace-waterproofing-protective-floor.png",
    textureLabel: "Anti-Glare Athletic Grip",
    locationTag: "International School Arena • Dhaka",
    projectScale: "14,000 sq ft Sports Complex",
    specs: [
      {
        label: "Shock Absorption",
        value: "> 35% Force Reduction",
        detail: "Protects athlete knees and joints",
      },
      {
        label: "Ball Bounce",
        value: "98% True Rebound",
        detail: "Consistent athletic ball response",
      },
      {
        label: "Friction Control",
        value: "Anti-Slip Safe",
        detail: "Optimal grip for rapid pivots",
      },
      {
        label: "Maintenance",
        value: "Seamless & Hygienic",
        detail: "No dirt-collecting grout seams",
      },
    ],
  },
  {
    _id: "concrete-floor-hardener",
    name: "Concrete Hardener & Polishing",
    slug: "concrete-floor-hardener",
    detailHeading: "Non-Metallic Monolithic Surface Hardener",
    tag: "Abrasion-Resistant Densifier",
    description:
      "Dry-shake mineral hardeners and penetrating lithium silicate chemical densifiers that transform standard concrete into an ultra-dense, dust-proof, abrasion-resistant industrial floor.",
    image: "/images/about-1.png",
    textureImage: "/images/about-2.png",
    textureLabel: "Densified Monolithic Slab",
    locationTag: "Logistics Fulfillment Center • Tongi",
    projectScale: "80,000 sq ft Warehouse",
    specs: [
      {
        label: "Abrasion Class",
        value: "AR 0.5 Class",
        detail: "High resistance to heavy pallet trucks",
      },
      {
        label: "Dust-Proofing",
        value: "100% Anti-Dusting",
        detail: "Eliminates concrete chalking",
      },
      {
        label: "Penetration Depth",
        value: "5–8 mm Chemical Bond",
        detail: "Crystalline silica micro-locking",
      },
      {
        label: "Life Expectancy",
        value: "Permanent Concrete Life",
        detail: "Hardens progressively with traffic",
      },
    ],
  },
];

function getServiceIcon(serviceName: string, serviceSlug: string) {
  const text = `${serviceName} ${serviceSlug}`.toLowerCase();
  if (text.includes("roof") || text.includes("terrace")) return Building2;
  if (text.includes("epoxy") || text.includes("factory") || text.includes("warehouse"))
    return Factory;
  if (text.includes("pu") || text.includes("cushion") || text.includes("sport"))
    return Layers;
  if (
    text.includes("waterproof") ||
    text.includes("basement") ||
    text.includes("tanking") ||
    text.includes("leak")
  )
    return Droplets;
  if (text.includes("heat") || text.includes("sun") || text.includes("insulat"))
    return SunMedium;
  if (text.includes("joint") || text.includes("crack") || text.includes("seal"))
    return Flame;
  return Layers;
}

export default function ServicesSectionContent({
  services,
}: ServicesSectionContentProps) {
  const reduce = useReducedMotion();
  const tabsTrackRef = useRef<HTMLDivElement>(null);

  // Build full 8-item array: use API services first, fill remainder with authentic default services
  const displayItems: ServiceDisplayItem[] = useMemo(() => {
    const items: ServiceDisplayItem[] = [];

    // 1. Incorporate published services from API
    if (services && services.length > 0) {
      services.slice(0, 8).forEach((service, idx) => {
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

        const defaultFillers = [
          {
            label: "Durability Standard",
            value: "10–15 Years Warranty",
            detail: "Engineered for tropical monsoons",
          },
          {
            label: "Formulation",
            value: "Australian Standard",
            detail: "High-grade imported active polymers",
          },
          {
            label: "Surface Protection",
            value: "100% Seamless Barrier",
            detail: "Continuous monolithic finish",
          },
          {
            label: "Execution",
            value: "Certified Applicators",
            detail: "Supervised by qualified engineers",
          },
        ];

        while (combinedSpecs.length < 4) {
          combinedSpecs.push(defaultFillers[combinedSpecs.length]);
        }

        const locationTag = project?.location?.city
          ? `${project.location.area ? `${project.location.area} • ` : ""}${project.location.city}`
          : "Certified Field Execution • Bangladesh";

        const projectScale = project?.client?.name
          ? project.client.name
          : service.price
            ? `Starting from BDT ${service.price.toLocaleString()}`
            : "Commercial & Industrial Scale";

        const textureImage =
          project?.primaryImage?.url ||
          service.primaryImage?.url ||
          "/images/home/rooftop-coating-surface-treatment.jpg";

        items.push({
          id: service._id,
          tabLabel: service.name,
          tabSublabel: service.detailHeading
            ? service.detailHeading.length > 30
              ? `${service.detailHeading.slice(0, 30)}…`
              : service.detailHeading
            : "Engineered System",
          icon: Icon,
          number: String(idx + 1).padStart(2, "0"),
          title: service.name,
          category: "FEATURED SERVICE",
          systemName:
            service.detailHeading || "Advanced Surface Protection System",
          description: service.description,
          image:
            service.primaryImage?.url ||
            "/images/home/completed-waterproof-rooftop-coating.jpg",
          textureImage,
          textureLabel: "Application Detail",
          locationTag,
          projectScale,
          specs: combinedSpecs.slice(0, 4),
          href: `/services/${service.slug}`,
        });
      });
    }

    // 2. If fewer than 8, complement from the 8 canonical services
    if (items.length < 8) {
      const existingSlugs = new Set(
        items.map((it) => it.href.replace("/services/", "")),
      );

      for (const fallback of EIGHT_FEATURED_SERVICES) {
        if (items.length >= 8) break;
        if (!existingSlugs.has(fallback.slug)) {
          existingSlugs.add(fallback.slug);
          items.push({
            id: fallback._id,
            tabLabel: fallback.name,
            tabSublabel: fallback.tag,
            icon: getServiceIcon(fallback.name, fallback.slug),
            number: String(items.length + 1).padStart(2, "0"),
            title: fallback.name,
            category: "FEATURED SERVICE",
            systemName: fallback.detailHeading,
            description: fallback.description,
            image: fallback.image,
            textureImage: fallback.textureImage,
            textureLabel: fallback.textureLabel,
            locationTag: fallback.locationTag,
            projectScale: fallback.projectScale,
            specs: fallback.specs,
            href: `/services/${fallback.slug}`,
          });
        }
      }
    }

    return items;
  }, [services]);

  const [activeId, setActiveId] = useState<string>(() => displayItems[0]?.id);

  const activeIndex = displayItems.findIndex((it) => it.id === activeId);
  const currentSafeIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeSolution = displayItems[currentSafeIndex] ?? displayItems[0];

  // Option 4 Navigation: Next / Prev with smooth tab auto-scroll
  const selectIndex = (index: number) => {
    if (index >= 0 && index < displayItems.length) {
      const targetItem = displayItems[index];
      setActiveId(targetItem.id);

      // Scroll active tab element into visible center of the track
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
    const nextIdx =
      (currentSafeIndex - 1 + displayItems.length) % displayItems.length;
    selectIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (currentSafeIndex + 1) % displayItems.length;
    selectIndex(nextIdx);
  };

  return (
    <section
      aria-labelledby="services-heading"
      className="relative overflow-hidden bg-[#f8fafc] py-[88px] lg:py-[112px]"
    >
      {/* Subtle architectural dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00334e_0.75px,transparent_0.75px)] opacity-[0.06] [background-size:24px_24px]"
        aria-hidden="true"
      />

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

        {/* Track Arrow Navigation Controls */}
        <div className="mb-3 flex items-center justify-end px-1 sm:px-2">
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

        {/* Horizontal Track of 8 Service Tabs with Scroll Indicators */}
        <div className="mb-8">
          <div
            ref={tabsTrackRef}
            role="tablist"
            aria-label="Featured services"
            className="flex max-w-full items-center gap-2.5 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white/90 p-2.5 shadow-sm backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayItems.map((item, idx) => {
              const isSelected = item.id === activeSolution?.id;
              const Icon = item.icon;

              return (
                <button
                  id={`opt4-tab-${item.id}`}
                  key={item.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => selectIndex(idx)}
                  className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 focus:outline-none sm:px-5 sm:py-3.5 ${
                    isSelected ? "text-white" : "text-slate-600 hover:text-navy"
                  }`}
                >
                  {/* Active Tab Spring Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeServicePill"
                      className="absolute inset-0 rounded-xl bg-navy shadow-md shadow-navy/20"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}

                  {/* Icon & Label */}
                  <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200">
                    <span
                      className={`grid size-full place-items-center rounded-lg ${
                        isSelected
                          ? "border-transparent bg-blue text-white"
                          : "border-slate-200 bg-slate-50 text-blue group-hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                  </span>

                  <div className="relative z-10 text-left">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black tracking-wider ${
                          isSelected ? "text-paste" : "text-slate-400"
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

        {/* Main Architectural Showcase Card (Full-width 2-column layout) */}
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
                        <strong className="mt-1 block truncate text-sm font-extrabold text-navy">
                          {spec.value}
                        </strong>
                        <span className="mt-0.5 block line-clamp-2 text-xs text-slate-500">
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
        )}

        {/* Quick Pagination Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {displayItems.map((item, idx) => (
            <button
              key={`dot-${item.id}`}
              type="button"
              onClick={() => selectIndex(idx)}
              aria-label={`Jump to ${item.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentSafeIndex
                  ? "w-8 bg-blue"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Bottom Trust Indicators & All Services Link */}
        <div className="mt-10 grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200/80 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center justify-center gap-3 py-4 text-center sm:py-5">
            <ShieldCheck size={20} className="shrink-0 text-blue" />
            <span className="text-xs font-bold text-navy sm:text-sm">
              10–15 Years Comprehensive Warranty
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 py-4 text-center sm:py-5">
            <CheckCircle2 size={20} className="shrink-0 text-blue" />
            <span className="text-xs font-bold text-navy sm:text-sm">
              Certified Chemical & Civil Engineers
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 py-4 text-center sm:py-5">
            <Layers size={20} className="shrink-0 text-blue" />
            <span className="text-xs font-bold text-navy sm:text-sm">
              Proven Australian Formulations
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button href="/services" variant="primary">
            View All Services & Systems
          </Button>
        </div>
      </Container>
    </section>
  );
}
