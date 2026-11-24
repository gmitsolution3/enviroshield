export interface ISlideMagnifier {
  targetPoint?: { x: number; y: number };
  loupePosition?: { top: string; right?: string; left?: string; bottom?: string };
  zoomImage: string;
  badge?: string;
  title: string;
  spec: string;
  productSlug?: string;
  beamDirection?: "left-to-right" | "right-to-left";
}

export interface ISlide {
  id: number;
  bg: string;
  alt: string;
  eyebrow: string;
  heading: string;
  text: string;
  cta: string;
  href: string;
  layout?: "text-left" | "text-right";
  secondaryCta?: {
    text: string;
    href: string;
  };
  magnifier?: ISlideMagnifier;
}


