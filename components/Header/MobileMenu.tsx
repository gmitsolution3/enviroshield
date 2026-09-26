"use client";

import { ArrowUpRight, X } from "lucide-react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { EASE } from "../animations/variants";
import { Button } from "../Button";
import Logo from "../Logo";

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  open: boolean;
  links: NavLink[];
  onClose: () => void;
};

export default function MobileMenu({
  open,
  links,
  onClose,
}: MobileMenuProps) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[49] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 flex w-[320px] max-w-[85vw] flex-col overflow-y-auto overscroll-contain border-l border-white/40 bg-white/70 p-6 backdrop-blur-xl backdrop-saturate-180 shadow-[-10px_0px_30px_-5px_rgba(0,51,78,0.1)]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex shrink-0 items-center justify-between">
              <Logo />

              <button
                className="text-navy"
                aria-label="Close navigation"
                onClick={onClose}
              >
                <X />
              </button>
            </div>

            <motion.nav
              className="mt-[50px] mb-[35px] grid shrink-0"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delayChildren: reduce ? 0 : 0.15,
                    staggerChildren: reduce ? 0 : 0.06,
                  },
                },
              }}
            >
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);

                return (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: reduce
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: 30 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: reduce ? 0 : 0.4,
                          ease: EASE,
                        },
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center justify-between border-b border-[#dfe5e9]/60 py-[19px] text-[23px] font-bold transition-colors duration-200 ${
                        isActive ? "!text-blue" : "!text-navy"
                      }`}
                    >
                      {link.label}

                      <ArrowUpRight size={17} />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            <motion.div
              className="shrink-0"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reduce ? 0 : 0.4,
                duration: reduce ? 0 : 0.4,
                ease: EASE,
              }}
            >
              <Button href="/contact">Talk to an Expert</Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
