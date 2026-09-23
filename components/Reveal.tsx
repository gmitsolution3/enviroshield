"use client";

import { useReducedMotion, motion } from "motion/react";
import {
  EASE,
  scaleIn,
  fadeUp,
  viewportOnce,
} from "./animations/variants";

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
      ? {
          hidden: { opacity: 0, x: -30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: EASE },
          },
        }
      : dir === "right"
        ? {
            hidden: { opacity: 0, x: 30 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.6, ease: EASE },
            },
          }
        : dir === "scale"
          ? scaleIn
          : dir === "image"
            ? {
                hidden: { opacity: 0, scale: 1.08 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, ease: EASE },
                },
              }
            : fadeUp;
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
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
