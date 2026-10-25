"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import { Menu } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE } from "../animations/variants";
import Container from "../Container";
import Logo from "../Logo";
import { ScrollProgress } from "../ScrollProgress";
import DesktopNavbar from "./DesktopNavbar";
import MobileMenu from "./MobileMenu";
import TopHeaderBar from "./TopHeaderBar";

type CartAddAnimationDetail = {
  sourceRect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  quantity: number;
};

type CartFlight = {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  quantity: number;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartTriggerRef = useRef<HTMLButtonElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [cartFlight, setCartFlight] = useState<CartFlight | null>(
    null,
  );

  const reduce = useReducedMotion();

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

  useEffect(() => {
    const handleCartAddAnimation = (event: Event) => {
      const detail = (event as CustomEvent<CartAddAnimationDetail>)
        .detail;

      const target = cartTriggerRef.current;

      if (!detail || !target || reduce) return;

      const targetRect = target.getBoundingClientRect();

      // Do not animate toward a hidden cart icon on mobile.
      if (!targetRect.width || !targetRect.height) return;

      setCartFlight({
        id: Date.now(),
        startX: detail.sourceRect.left + detail.sourceRect.width / 2,
        startY: detail.sourceRect.top + detail.sourceRect.height / 2,
        endX: targetRect.left + targetRect.width / 2,
        endY: targetRect.top + targetRect.height / 2,
        quantity: detail.quantity,
      });
    };

    window.addEventListener(
      "cart:add-animation",
      handleCartAddAnimation,
    );

    return () => {
      window.removeEventListener(
        "cart:add-animation",
        handleCartAddAnimation,
      );
    };
  }, [reduce]);

  return (
    <>
      <ScrollProgress />

      <TopHeaderBar
        onCartClick={() => setCartOpen(true)}
        cartOpen={cartOpen}
        cartTriggerRef={cartTriggerRef}
      />

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

      {cartFlight && (
        <motion.div
          key={cartFlight.id}
          aria-hidden="true"
          initial={{
            x: 0,
            y: 0,
            scale: 0.45,
            opacity: 0,
          }}
          animate={{
            x: cartFlight.endX - cartFlight.startX,
            y: cartFlight.endY - cartFlight.startY,
            scale: [0.45, 1.1, 0.72, 0.55],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.6,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.16, 0.76, 1],
          }}
          onAnimationComplete={() => setCartFlight(null)}
          style={{
            left: cartFlight.startX - 18,
            top: cartFlight.startY - 18,
          }}
          className="pointer-events-none fixed z-[100] grid size-9 place-items-center rounded-full border-2 border-white bg-blue text-xs font-extrabold text-white shadow-[0_6px_22px_rgba(1,110,220,0.4)]"
        >
          +{cartFlight.quantity}
        </motion.div>
      )}
    </>
  );
}
