import type { ISlide } from "@/types";
import type { IPublishedProduct } from "@/types/product.type";

export interface IHeroSlideConfig extends Omit<ISlide, "magnifier"> {
  magnifier?: {
    targetPoint?: { x: number; y: number };
    loupePosition?: { top: string; right?: string; left?: string; bottom?: string };
    beamDirection?: "left-to-right" | "right-to-left";
    /** Prioritized list of relevant product slugs matching this slide's visual application */
    targetSlugs: string[];
    /** Bulletproof fallback values if none of the target products are published in DB */
    defaultFallback: {
      zoomImage: string;
      title: string;
      spec: string;
      productSlug: string;
    };
  };
}

export const BASE_HERO_SLIDES: IHeroSlideConfig[] = [
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
      beamDirection: "left-to-right",
      targetSlugs: [
        "gum-shield",
        "shieldcem-fastflex",
        "998-silicone-weatherproof-sealant",
      ],
      defaultFallback: {
        zoomImage:
          "https://res.cloudinary.com/dknitablq/image/upload/v1794639188/enviroshield/jlry2ofqvywykhfiezjz.png",
        title: "Gum Shield",
        spec: "Liquid Elastomeric Waterproofing",
        productSlug: "gum-shield",
      },
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
      beamDirection: "right-to-left",
      targetSlugs: [
        "epoxy-flooring-kit",
        "shieldcrete-pu-flooring-kit",
      ],
      defaultFallback: {
        zoomImage:
          "https://res.cloudinary.com/dknitablq/image/upload/v1794644805/enviroshield/u0pbhn2dlfhxgwy5aieo.png",
        title: "Shieldcrete PU Flooring Kit",
        spec: "Seamless High-Build Resinous Flooring",
        productSlug: "shieldcrete-pu-flooring-kit",
      },
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
      beamDirection: "left-to-right",
      targetSlugs: [
        "pu-aqua-shield",
        "weather-coat-exterior-emulsion",
        "exterior-base-coat-high-elastic-sealer",
      ],
      defaultFallback: {
        zoomImage:
          "https://res.cloudinary.com/dknitablq/image/upload/v1794484148/enviroshield/rvrxtc4ccyb4hkrhjmie.png",
        title: "Weather Coat Exterior Emulsion",
        spec: "Exterior Polymer Protective Barrier",
        productSlug: "weather-coat-exterior-emulsion",
      },
    },
  },
];

/**
 * Resolves slides dynamically by checking the live published products against each
 * slide's prioritized candidate slugs. If matched, the live Cloudinary image URL,
 * active product title, and specifications are dynamically injected.
 */
export function resolveDynamicHeroSlides(
  publishedProducts: IPublishedProduct[] = [],
): ISlide[] {
  // Create quick lookup map by slug
  const productMap = new Map<string, IPublishedProduct>();
  for (const product of publishedProducts) {
    if (product.slug) {
      productMap.set(product.slug.toLowerCase().trim(), product);
    }
  }

  return BASE_HERO_SLIDES.map((slide) => {
    if (!slide.magnifier) {
      return slide as ISlide;
    }

    const { targetSlugs, defaultFallback, ...restMagnifier } = slide.magnifier;

    // Search for the first relevant published product in the candidate list
    let matchedProduct: IPublishedProduct | undefined;
    for (const slug of targetSlugs) {
      const found = productMap.get(slug.toLowerCase().trim());
      if (found && found.primaryImage?.url) {
        matchedProduct = found;
        break;
      }
    }

    // Dynamic product resolution
    const dynamicZoomImage =
      matchedProduct?.primaryImage?.url || defaultFallback.zoomImage;
    const dynamicTitle =
      matchedProduct?.name || defaultFallback.title;
    const dynamicSpec =
      matchedProduct?.shortDescription ||
      matchedProduct?.categoryId?.name ||
      defaultFallback.spec;
    const dynamicSlug =
      matchedProduct?.slug || defaultFallback.productSlug;

    return {
      ...slide,
      magnifier: {
        ...restMagnifier,
        zoomImage: dynamicZoomImage,
        title: dynamicTitle,
        spec: dynamicSpec,
        productSlug: dynamicSlug,
      },
    };
  });
}
