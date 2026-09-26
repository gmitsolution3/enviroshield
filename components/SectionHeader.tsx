"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import { fadeUp, viewportOnce } from "./animations/variants";

interface ISectionHeaderProps {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
  headingLevel?: "h1" | "h2" | "h3" | "h4";
  headingId?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left",
  light = false,
  headingLevel = "h2",
  headingId = "",
}: ISectionHeaderProps) {
  const reduce = useReducedMotion();

  const Heading = headingLevel;

  return (
    <motion.div
      className={cn(
        "max-w-[640px]",
        align === "center" && "mx-auto text-center",
        light && "text-white",
      )}
      variants={reduce ? undefined : fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div
        className={cn(
          "mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em]",
          light ? "text-paste" : "text-blue",
        )}
      >
        <span className="h-[2px] w-7 bg-current" aria-hidden="true" />
        {eyebrow}
      </div>

      <Heading
        id={headingId}
        className={cn(
          "mb-[19px] text-[clamp(35px,4vw,53px)] font-extrabold leading-[1.05] tracking-[-0.05em]",
          light ? "text-white" : "text-navy",
        )}
      >
        {title}
      </Heading>

      {text && (
        <p
          className={cn(
            "mb-[24px] text-[16px] leading-[1.7]",
            light ? "text-white" : "text-ink",
          )}
        >
          {text}
        </p>
      )}
    </motion.div>
  );
}
