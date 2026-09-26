"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { EASE } from "./animations/variants";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "light" | "outline";
  className?: string;
};

const variantClasses = {
  primary:
    "bg-blue text-white shadow-[0_4px_14px_rgba(1,110,220,0.22)] hover:bg-[#005cb9] hover:shadow-[0_6px_18px_rgba(1,110,220,0.28)]",
  light:
    "bg-white text-navy shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:bg-[#f5f8fa]",
  outline: "border border-current bg-transparent text-current",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const reduce = useReducedMotion();

  const classes = `group inline-flex min-h-12 items-center justify-center gap-[9px] rounded-[10px] px-5 text-[13px] font-bold tracking-[0.01em] transition-[background-color,box-shadow] duration-200 !rounded-4xl ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>

      <ArrowUpRight
        size={16}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </>
  );

  if (href) {
    return (
      <motion.div
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <Link href={href} className={classes}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {content}
    </motion.button>
  );
}
