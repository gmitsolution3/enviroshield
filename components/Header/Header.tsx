"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { Menu, ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE } from "../animations/variants";
import Container from "../Container";
import Logo from "../Logo";
import { ScrollProgress } from "../ScrollProgress";
import DesktopNavbar from "./DesktopNavbar";
import MobileMenu from "./MobileMenu";
import TopHeaderBar from "./TopHeaderBar";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartTriggerRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { count } = useCart();
  const closeCart = useCallback(() => setCartOpen(false), []);

  const links: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
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
        <Container className="flex h-full items-center justify-between">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Logo />
          </motion.div>

          <DesktopNavbar links={links} />

          <button
            ref={cartTriggerRef}
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart${count ? `, ${count} ${count === 1 ? "item" : "items"}` : ", empty"}`}
            aria-haspopup="dialog"
            aria-expanded={cartOpen}
            className="relative mr-3 inline-grid size-10 shrink-0 place-items-center rounded-full text-navy transition-colors hover:bg-mist hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue max-[900px]:mr-3"
          >
            <ShoppingBag size={21} aria-hidden="true" />
            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 grid min-w-[19px] place-items-center rounded-full bg-blue px-1 text-[10px] font-bold leading-[19px] text-white"
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>

          <button
            className="block text-navy min-[901px]:hidden"
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
        </Container>
      </motion.header>

      <MobileMenu
        open={open}
        links={links}
        onClose={() => setOpen(false)}
      />
      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
        triggerRef={cartTriggerRef}
      />
    </>
  );
}
