"use client";

import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { useState, type MouseEvent, type ReactNode } from "react";

import { EASE } from "./animations/variants";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "light" | "outline";
  className?: string;
};

const variantStyles = {
  primary: {
    base: "bg-blue text-white shadow-[0_4px_14px_rgba(1,110,220,0.22)] hover:shadow-[0_8px_22px_rgba(1,110,220,0.32)]",
    fill: "bg-[#005cb9]",
    glow: "rgba(255,255,255,0.28)",
  },
  light: {
    base: "bg-white text-navy shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_22px_rgba(0,0,0,0.14)]",
    fill: "bg-[#e6eef5]",
    glow: "rgba(1,110,220,0.14)",
  },
  outline: {
    base: "border border-blue bg-transparent text-blue hover:text-white",
    fill: "bg-blue",
    glow: "rgba(255,255,255,0.25)",
  },
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const reduce = useReducedMotion();
  const v = variantStyles[variant];

  const [hovered, setHovered] = useState(false);
  const [side, setSide] = useState<"left" | "right">("left");

  // Cursor-following glow
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(110px circle at ${mx}px ${my}px, ${v.glow}, transparent 70%)`;

  const sideOf = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientX - r.left < r.width / 2 ? "left" : "right";
  };

  const handleEnter = (e: MouseEvent<HTMLElement>) => {
    setSide(sideOf(e)); // fill enters from the side the cursor came from
    setHovered(true);
  };

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const handleLeave = (e: MouseEvent<HTMLElement>) => {
    setSide(sideOf(e)); // fill exits toward the side the cursor leaves
    setHovered(false);
  };

  const classes = `group relative isolate inline-flex min-h-12 items-center justify-center gap-[9px] overflow-hidden px-5 text-[13px] font-bold tracking-[0.01em] transition-[color,box-shadow] duration-300 !rounded-4xl ${v.base} ${className}`;

  const content = (
    <>
      {/* Shade fill: sweeps in from the entry side, wipes out toward the exit side */}
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 ${v.fill}`}
        style={{ originX: side === "left" ? 0 : 1 }}
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
      />

      {/* Spotlight that follows the cursor */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: glow }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <span>{children}</span>

      {/* Arrow shoots out top-right while a new one slides in from bottom-left */}
      <span
        aria-hidden="true"
        className="relative inline-flex size-4 overflow-hidden"
      >
        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full"
        />
        <ArrowUpRight
          size={16}
          className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0"
        />
      </span>
    </>
  );

  return (
    <span
      className="inline-flex"
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onFocus={() => {
        setSide("left");
        setHovered(true);
      }}
      onBlur={() => setHovered(false)}
    >
      <motion.span
        className="inline-flex"
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {href ? (
          <Link href={href} className={classes}>
            {content}
          </Link>
        ) : (
          <button type="button" className={classes}>
            {content}
          </button>
        )}
      </motion.span>
    </span>
  );
}
