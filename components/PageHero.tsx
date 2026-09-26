"use client";

import { images } from "@/lib/data/content";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASE } from "./animations/variants";
import Container from "./Container";

export default function PageHero({
  eyebrow,
  title,
  text,
  image = images.hero,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[420px] overflow-hidden bg-navy text-white min-[601px]:min-h-[500px]">
      <Container>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? undefined : { scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            priority
            sizes="100vw"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,40,61,0.82)_0%,rgba(0,40,61,0.58)_45%,rgba(0,40,61,0.3)_100%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <div className="container relative z-10 flex min-h-[420px] items-end pb-[55px] min-[601px]:min-h-[500px] min-[601px]:pb-[75px]">
          <div className="max-w-[760px]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
            >
              <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-white">
                <span
                  className="h-[2px] w-7 bg-current"
                  aria-hidden="true"
                />
                {eyebrow}
              </div>
            </motion.div>

            <motion.h1
              className="mb-[19px] max-w-[760px] text-[clamp(42px,6vw,72px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-white"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.2 }}
            >
              {title}
            </motion.h1>

            <motion.p
              className="max-w-[650px] text-[16px] leading-[1.7] text-white/90"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.35 }}
            >
              {text}
            </motion.p>
          </div>
        </div>
      </Container>
    </section>
  );
}
