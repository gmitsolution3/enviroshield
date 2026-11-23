"use client";

import { Search } from "lucide-react";
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
  onSearchClick: () => void;
};

export default function DesktopNavbar({
  links,
  onSearchClick,
}: DesktopNavProps) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="hidden items-center gap-3 text-[15px] font-bold text-[#315366] min-[901px]:flex min-[1150px]:gap-4 min-[1350px]:gap-6 xl:text-[16px]"
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
              className={`group relative whitespace-nowrap transition-colors duration-200 ${
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

      {/* Search trigger button */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.3,
          ease: EASE,
        }}
      >
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search site (Ctrl+K)"
          className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-mist/60 px-3 py-1.5 text-xs font-semibold text-navy transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue min-[1350px]:px-3.5 min-[1350px]:py-2"
        >
          <Search size={15} className="text-ink/60 transition-colors group-hover:text-blue" aria-hidden="true" />
          <span className="hidden 2xl:inline">Search</span>
          <kbd className="hidden rounded border border-line bg-white px-1.5 py-0.5 text-[10px] font-bold text-ink/50 2xl:inline-block">
            Ctrl+K
          </kbd>
        </button>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.35,
          ease: EASE,
        }}
      >
        <Button href="/contact" className="whitespace-nowrap">Talk to an Expert</Button>
      </motion.div>
    </nav>
  );
}
