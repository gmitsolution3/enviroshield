"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { EASE } from "./animations/variants";

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

  const variantClasses = {
    primary:
      "bg-blue text-white shadow-[0_4px_14px_rgba(1,110,220,0.22)] hover:bg-[#005cb9] hover:shadow-[0_6px_18px_rgba(1,110,220,0.28)]",
    light:
      "bg-white text-navy shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:bg-[#f5f8fa]",
    outline: "border border-current bg-transparent text-current",
  };

  const inner = (
    <motion.span
      className={`group inline-flex min-h-12 items-center justify-center gap-[9px] rounded-[10px] px-5 text-[13px] font-bold tracking-[0.01em] transition-[background-color,box-shadow] duration-200 !rounded-4xl ${variantClasses[variant]} ${className}`}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}

      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </motion.span>
  );

  return href ? (
    <Link href={href}>{inner}</Link>
  ) : (
    <button type="button">{inner}</button>
  );
}
