"use client";

import {
  ArrowUpRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "./animations/variants";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { ScrollProgress } from "./ScrollProgress";
import Link from "next/link"

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  const links: { label: string; href: string }[] = [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <div className="utility">
        <div className="container utility-inner">
          <span>
            <MapPin size={14} /> Serving homes and businesses with
            care
          </span>
          <span className="utility-right">
            <a href="mailto:hello@enviroshield.com">
              <Mail size={14} /> hello@enviroshield.com
            </a>
            <a href="tel:+11234567890">
              <Phone size={14} /> +1 123 456 7890
            </a>
          </span>
        </div>
      </div>
      <motion.header
        className="site-header"
        animate={{
          boxShadow: scrolled
            ? "0px 8px 30px rgba(0,51,78,0.08)"
            : "0px 0px 0px rgba(0,51,78,0)",
          borderColor: scrolled
            ? "rgba(223,229,233,1)"
            : "rgba(223,229,233,0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container header-inner">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Logo />
          </motion.div>
          <nav className="desktop-nav">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={reduce ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.05 * (i + 1),
                  ease: EASE,
                }}
                className="nav-link-wrap"
              >
                <Link href={link.href} className="nav-link">
                  {link.label}
                  <span className="nav-underline" />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
            >
              <Button href="/contact">Talk to an Expert</Button>
            </motion.div>
          </nav>
          <button
            className="menu-button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="mobile-menu-top">
                <Logo />
                <button
                  className="menu-button"
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                >
                  <X />
                </button>
              </div>
              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: 0.15,
                      staggerChildren: 0.06,
                    },
                  },
                }}
              >
                {[{ label: "Home", href: "/" }, ...links].map(
                  (link) => (
                    <motion.div
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.4, ease: EASE },
                        },
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                        <ArrowUpRight size={17} />
                      </Link>
                    </motion.div>
                  ),
                )}
              </motion.nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
              >
                <Button href="/contact">Talk to an Expert</Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
