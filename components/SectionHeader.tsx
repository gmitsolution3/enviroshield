"use client";

import { motion, useReducedMotion } from "motion/react";
import { fadeUp, viewportOnce } from "./animations/variants";

export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`max-w-[640px] ${
        align === "center" ? "mx-auto text-center" : ""
      } ${light ? "text-white" : ""}`}
      variants={reduce ? undefined : fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
        <span className="h-[2px] w-7 bg-current" />
        {eyebrow}
      </div>

      <h2
        className={`mb-[19px] text-[clamp(35px,4vw,53px)] font-extrabold leading-[1.05] tracking-[-0.05em] ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>

      {text && (
        <p
          className={`text-[16px] leading-[1.7] mb-[24px] ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {text}
        </p>
      )}
    </motion.div>
  );
}
