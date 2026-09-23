"use client";

import { Menu } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { EASE } from "../animations/variants";
import { Logo } from "../Logo";
import { ScrollProgress } from "../ScrollProgress";

import DesktopNavbar from "./DesktopNavbar";
import MobileMenu from "./MobileMenu";
import TopHeaderBar from "./TopHeaderBar";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  const links: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
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

      <TopHeaderBar />

      <motion.header
        className="sticky top-0 z-20 h-[82px] border-b"
        animate={{
          backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.55)"
            : "rgba(255, 255, 255, 1)",
          backdropFilter: scrolled
            ? "blur(16px) saturate(180%)"
            : "blur(0px) saturate(100%)",
          boxShadow: scrolled
            ? "0px 10px 30px -5px rgba(0, 51, 78, 0.08), inset 0px 1px 0px 0px rgba(255, 255, 255, 0.8)"
            : "0px 0px 0px rgba(0, 51, 78, 0), inset 0px 0px 0px 0px rgba(255, 255, 255, 0)",
          borderColor: scrolled
            ? "rgba(255, 255, 255, 0.4)"
            : "rgba(223, 229, 233, 0)",
        }}
        style={{
          WebkitBackdropFilter: scrolled
            ? "blur(16px) saturate(180%)"
            : "blur(0px) saturate(100%)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex h-full items-center justify-between">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Logo />
          </motion.div>

          <DesktopNavbar links={links} />

          <button
            className="block text-navy min-[901px]:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </motion.header>

      <MobileMenu
        open={open}
        links={links}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
