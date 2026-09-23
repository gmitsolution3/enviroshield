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
      className={`section-header ${align === "center" ? "section-header-center" : ""} ${light ? "section-header-light" : ""}`}
      variants={reduce ? undefined : fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}
