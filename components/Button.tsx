"use client";

import { ArrowUpRight } from "lucide-react";
import { useReducedMotion, motion } from "motion/react";
import { EASE } from "./animations/variants";
import Link from "next/link";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "light" | "outline";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const inner = (
    <motion.span
      className={`button button-${variant} ${className} !rounded-4xl`}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
      <ArrowUpRight size={16} className="button-arrow" />
    </motion.span>
  );
  return href ? (
    <Link href={href}>{inner}</Link>
  ) : (
    <button type="button">{inner}</button>
  );
}
