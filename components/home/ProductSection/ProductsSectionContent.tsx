"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import type { IPublishedProduct } from "@/types";

interface ProductsSectionContentProps {
  products: IPublishedProduct[];
}

export default function ProductsSectionContent({
  products,
}: ProductsSectionContentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll tracking across the products section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end 20%"],
  });

  // --------------------------------------------------------------------------
  // LEFT PRODUCT: Exterior Base Coat (Rolling out from left edge)
  // Physics: As it rolls out from behind the left screen bezel, X moves right
  // and it rotates clockwise (negative to near-zero), mimicking a rolling drum.
  // --------------------------------------------------------------------------
  const rawLeftX = useTransform(scrollYProgress, [0, 0.4], [-260, 0]);
  const rawLeftRotate = useTransform(scrollYProgress, [0, 0.4], [-65, -4]);
  const rawLeftRollerRot = useTransform(scrollYProgress, [0, 0.35], [-280, 0]);
  const rawLeftRollerClip = useTransform(scrollYProgress, [0, 0.35], [100, 0]);
  const rawLeftOpacity = useTransform(scrollYProgress, [0, 0.12], [0.1, 1]);

  // Spring physics for natural momentum and weight
  const leftX = useSpring(rawLeftX, { stiffness: 90, damping: 20 });
  const leftRotate = useSpring(rawLeftRotate, { stiffness: 90, damping: 20 });
  const leftRollerRot = useSpring(rawLeftRollerRot, { stiffness: 85, damping: 22 });
  const leftRollerClip = useSpring(rawLeftRollerClip, { stiffness: 95, damping: 22 });
  const leftOpacity = useSpring(rawLeftOpacity, { stiffness: 120, damping: 25 });

  const leftRollerClipPath = useTransform(
    leftRollerClip,
    (v) => `inset(0% ${v}% 0% 0%)`,
  );

  // --------------------------------------------------------------------------
  // RIGHT PRODUCT: Weather Coat Exterior (Rolling out from right edge)
  // Physics: Rolls out from behind right bezel, X moves left and it rotates
  // counter-clockwise (positive to near-zero), mimicking a rolling drum.
  // --------------------------------------------------------------------------
  const rawRightX = useTransform(scrollYProgress, [0.15, 0.6], [260, 0]);
  const rawRightRotate = useTransform(scrollYProgress, [0.15, 0.6], [65, 4]);
  const rawRightRollerRot = useTransform(scrollYProgress, [0.15, 0.55], [280, 0]);
  const rawRightRollerClip = useTransform(scrollYProgress, [0.15, 0.55], [100, 0]);
  const rawRightOpacity = useTransform(scrollYProgress, [0.15, 0.28], [0.1, 1]);

  // Spring physics for natural momentum
  const rightX = useSpring(rawRightX, { stiffness: 90, damping: 20 });
  const rightRotate = useSpring(rawRightRotate, { stiffness: 90, damping: 20 });
  const rightRollerRot = useSpring(rawRightRollerRot, { stiffness: 85, damping: 22 });
  const rightRollerClip = useSpring(rawRightRollerClip, { stiffness: 95, damping: 22 });
  const rightOpacity = useSpring(rawRightOpacity, { stiffness: 120, damping: 25 });

  const rightRollerClipPath = useTransform(
    rightRollerClip,
    (v) => `inset(0% 0% 0% ${v}%)`,
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="products-heading"
      className="relative overflow-hidden py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      {/* ====================================================================== */}
      {/* LEFT SIDE PRODUCT: Rolling out from left screen edge (Desktop only)    */}
      {/* Positioned safely alongside the card grid, never above the header      */}
      {/* ====================================================================== */}
      <div
        className="pointer-events-none absolute -left-[140px] lg:-left-[170px] xl:-left-[190px] top-[340px] z-10 hidden xl:block select-none"
        aria-hidden="true"
      >
        <div className="relative">
          {/* Green Paint Trail unrolling behind the rolling drum */}
          <motion.div
            style={{
              clipPath: reduce ? "none" : leftRollerClipPath,
              WebkitClipPath: reduce ? "none" : leftRollerClipPath,
              rotate: reduce ? 0 : leftRollerRot,
            }}
            className="absolute -top-16 -left-12 w-[380px] h-[380px] opacity-70 will-change-transform origin-center"
          >
            <Image
              src="/images/roller-paint-green.png"
              alt=""
              fill
              sizes="380px"
              className="object-contain -scale-x-100"
            />
          </motion.div>

          {/* Left Product Bucket (Exterior Base Coat) with physics rolling */}
          <motion.div
            style={{
              x: reduce ? 0 : leftX,
              rotate: reduce ? 0 : leftRotate,
              opacity: reduce ? 1 : leftOpacity,
            }}
            className="relative w-[310px] md:w-[350px] lg:w-[390px] xl:w-[430px] aspect-[1153/944] filter drop-shadow-[0_24px_40px_rgba(0,40,70,0.28)] will-change-transform origin-bottom"
          >
            <Image
              src="/images/product-bucket-left.png"
              alt="EnviroShield Base Coat"
              fill
              sizes="(max-width: 1280px) 390px, 430px"
              priority
              className="object-contain"
            />

            {/* Floating Technical Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              className="absolute -right-4 bottom-10 flex items-center gap-2.5 rounded-full border border-emerald-400/40 bg-white/95 px-3.5 py-1.5 shadow-[0_8px_25px_rgba(16,185,129,0.2)] backdrop-blur-md"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
                <ShieldCheck size={12} strokeWidth={2.5} />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-bold text-navy">High Elastic Sealer</p>
                <p className="text-[9px] font-semibold text-emerald-600">Base Coat • 20L</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* RIGHT SIDE PRODUCT: Rolling out from right screen edge (Desktop only)   */}
      {/* ====================================================================== */}
      <div
        className="pointer-events-none absolute -right-[140px] lg:-right-[170px] xl:-right-[190px] bottom-[140px] z-10 hidden xl:block select-none"
        aria-hidden="true"
      >
        <div className="relative">
          {/* Navy Paint Trail unrolling behind the rolling drum */}
          <motion.div
            style={{
              clipPath: reduce ? "none" : rightRollerClipPath,
              WebkitClipPath: reduce ? "none" : rightRollerClipPath,
              rotate: reduce ? 0 : rightRollerRot,
            }}
            className="absolute -top-16 -right-12 w-[390px] h-[390px] opacity-70 will-change-transform origin-center"
          >
            <Image
              src="/images/roller-paint-navy.png"
              alt=""
              fill
              sizes="390px"
              className="object-contain"
            />
          </motion.div>

          {/* Right Product Bucket (Weather Coat Exterior Emulsion) with physics rolling */}
          <motion.div
            style={{
              x: reduce ? 0 : rightX,
              rotate: reduce ? 0 : rightRotate,
              opacity: reduce ? 1 : rightOpacity,
            }}
            className="relative w-[310px] md:w-[350px] lg:w-[390px] xl:w-[430px] aspect-[1168/956] filter drop-shadow-[0_24px_40px_rgba(0,30,60,0.28)] will-change-transform origin-bottom"
          >
            <Image
              src="/images/product-bucket-right.png"
              alt="EnviroShield Weather Coat"
              fill
              sizes="(max-width: 1280px) 390px, 430px"
              priority
              className="object-contain"
            />

            {/* Floating Technical Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.5, type: "spring" }}
              className="absolute -left-4 top-12 flex items-center gap-2.5 rounded-full border border-blue/40 bg-white/95 px-3.5 py-1.5 shadow-[0_8px_25px_rgba(1,110,220,0.2)] backdrop-blur-md"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-blue text-white shadow-sm">
                <Sparkles size={12} strokeWidth={2.5} />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-bold text-navy">Weather Coat</p>
                <p className="text-[9px] font-semibold text-blue">Exterior Emulsion</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Container */}
      <Container className="relative z-10">
        <div className="flex items-end justify-between gap-[25px] max-[900px]:flex-col max-[900px]:items-start">
          <SectionHeader
            eyebrow="OUR PRODUCTS"
            title="Finishes and materials you can trust."
            headingId="products-heading"
          />

          <Reveal dir="up" delay={0.1}>
            <Button href="/products" variant="outline">
              View all products
            </Button>
          </Reveal>
        </div>

        {products.length > 0 ? (
          <StaggerContainer className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[25px]">
            {products.map((product) => (
              <StaggerItem
                key={product._id}
                data-category={product.categoryId?.name}
              >
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <p className="mt-12 text-center text-sm text-ink/60">
            Products are temporarily unavailable. Please visit our products
            page to explore our range.
          </p>
        )}
      </Container>
    </section>
  );
}
