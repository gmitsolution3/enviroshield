"use client";

import { motion, useReducedMotion } from "motion/react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { EASE } from "../animations/variants";
import { Button } from "../Button";

type NavLink = {
  label: string;
  href: string;
};

type DesktopNavProps = {
  links: NavLink[];
};

export default function DesktopNavbar({ links }: DesktopNavProps) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="hidden items-center gap-[30px] text-[14px] font-bold text-[#315366] min-[901px]:flex"
    >
      {links.map((link, i) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

        return (
          <motion.div
            key={link.href}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.05 * (i + 1),
              ease: EASE,
            }}
          >
            <Link
              href={link.href}
              className={`group relative transition-colors duration-200 ${
                isActive ? "text-blue" : "hover:text-blue"
              }`}
            >
              {link.label}

              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-blue transition-transform duration-300 ${
                  isActive
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          </motion.div>
        );
      })}

      <motion.div
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.35,
          ease: EASE,
        }}
      >
        <Button href="/contact">Talk to an Expert</Button>
      </motion.div>
    </nav>
  );
}
