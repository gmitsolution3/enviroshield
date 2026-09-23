"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  EASE,
  fadeUp,
  scaleIn,
  viewportOnce,
} from "./animations/variants";

import { cn } from "@/lib/utils";

const leftVariant = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

const rightVariant = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

const imageVariant = {
  hidden: {
    opacity: 0,
    scale: 1.08,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

export function Reveal({
  children,
  className = "",
  dir = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  dir?: "up" | "left" | "right" | "scale" | "image";
  delay?: number;
}) {
  const reduce = useReducedMotion();

  const variant =
    dir === "left"
      ? leftVariant
      : dir === "right"
        ? rightVariant
        : dir === "scale"
          ? scaleIn
          : dir === "image"
            ? imageVariant
            : fadeUp;

  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={variant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
