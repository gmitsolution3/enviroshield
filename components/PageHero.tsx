"use client";

import { images } from "@/lib/data/content";
import { useReducedMotion, motion } from "motion/react";
import { EASE } from "./animations/variants";
import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  text,
  image = images.hero,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="page-hero">
      <motion.div
        className="page-hero-bg"
        initial={reduce ? undefined : { scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Image
          src={image}
          alt="Beautifully finished interior"
          fill
          priority
          sizes="100vw"
        />
      </motion.div>
      <motion.div
        className="page-hero-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className="container page-hero-content">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
        >
          <div className="eyebrow eyebrow-light">
            <span />
            {eyebrow}
          </div>
        </motion.div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.35 }}
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
}
