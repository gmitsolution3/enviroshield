"use client";

import {
  ArrowRight,
  ArrowUpRight,
  LayoutDashboard,
  LogIn,
  LogOut,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useCart } from "@/components/cart/CartProvider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";

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
  onCartClick: () => void;
};


export default function MobileMenu({
  open,
  links,
  onClose,
  onCartClick,
}: MobileMenuProps) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();

  const { count } = useCart();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  async function handleLogout() {
    try {
      await authClient.signOut();

      onClose();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }

  function handleCartClick() {
    onClose();
    onCartClick();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background Overlay */}
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-[49] cursor-default bg-navy/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 0.25,
            }}
            onClick={onClose}
          />

          {/* Mobile Navigation Drawer */}
          <motion.aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-50 flex w-[360px] max-w-[90vw] flex-col overflow-y-auto overscroll-contain touch-pan-y border-l border-white/60 bg-white/95 p-5 shadow-[-12px_0_40px_rgba(0,51,78,0.15)] backdrop-blur-xl sm:p-6"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={{
              duration: reduce ? 0 : 0.35,
              ease: EASE,
            }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-line pb-5">
              <Logo />

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="grid size-10 place-items-center rounded-full border border-line text-navy transition-colors hover:border-blue hover:bg-mist hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="mt-5">
              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
                Explore
              </p>

              <motion.nav
                aria-label="Mobile navigation links"
                className="grid"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {
                    opacity: 0,
                  },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: reduce ? 0 : 0.08,
                      staggerChildren: reduce ? 0 : 0.045,
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
                          ? {
                              opacity: 1,
                              x: 0,
                            }
                          : {
                              opacity: 0,
                              x: 18,
                            },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: {
                            duration: reduce ? 0 : 0.3,
                            ease: EASE,
                          },
                        },
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center justify-between border-b border-line/80 py-[14px] text-[17px] font-bold transition-colors ${
                          isActive
                            ? "text-blue"
                            : "text-navy hover:text-blue"
                        }`}
                      >
                        {link.label}

                        <ArrowUpRight
                          size={16}
                          className={
                            isActive ? "text-blue" : "text-ink/40"
                          }
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>
            </div>

            {/* Contact CTA */}
            <motion.div
              className="mt-6 shrink-0 pb-2"
              initial={
                reduce
                  ? false
                  : {
                      opacity: 0,
                      y: 12,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: reduce ? 0 : 0.3,
                duration: reduce ? 0 : 0.3,
                ease: EASE,
              }}
            >
              <Button href="/contact">Talk to an Expert</Button>
            </motion.div>

            {/* Cart Shortcut */}
            <motion.button
              type="button"
              onClick={handleCartClick}
              className="mt-6 flex w-full shrink-0 items-center justify-between rounded-2xl border border-line bg-white p-4 text-left transition-colors hover:border-blue/40 hover:bg-mist/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              initial={
                reduce
                  ? false
                  : {
                      opacity: 0,
                      y: 10,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: reduce ? 0 : 0.08,
                duration: reduce ? 0 : 0.3,
              }}
            >
              <span className="flex items-center gap-3">
                <span className="relative grid size-11 place-items-center rounded-xl bg-blue/10 text-blue">
                  <ShoppingBag size={21} aria-hidden="true" />

                  {count > 0 && (
                    <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-blue px-1 text-[10px] font-bold leading-5 text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>

                <span>
                  <span className="block text-sm font-bold text-navy">
                    My Shopping Cart
                  </span>

                  <span className="mt-1 block text-xs text-ink/60">
                    {count} {count === 1 ? "item" : "items"} in your
                    cart
                  </span>
                </span>
              </span>

              <ArrowRight
                size={18}
                className="text-ink/50"
                aria-hidden="true"
              />
            </motion.button>

            {/* Account Section */}
            <div className="mt-5 shrink-0">
              <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50">
                Your Account
              </p>

              {isPending ? (
                <div className="h-[76px] animate-pulse rounded-2xl bg-mist" />
              ) : user ? (
                <>
                  {/* Signed-in User */}
                  <div className="flex items-center gap-3 rounded-2xl bg-mist/70 p-3">
                    <Avatar
                      size="lg"
                      className="border border-white shadow-sm"
                    >
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "Your profile"}
                      />

                      <AvatarFallback className="bg-navy text-sm font-bold text-white">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-navy">
                        {user.name || "Welcome back"}
                      </p>

                      <p className="mt-1 truncate text-xs text-ink/60">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Account Navigation */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard"
                      onClick={onClose}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-navy transition-colors hover:border-blue hover:text-blue"
                    >
                      <LayoutDashboard size={15} aria-hidden="true" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={onClose}
                      className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-xs font-semibold text-navy transition-colors hover:border-blue hover:text-blue"
                    >
                      <UserRound size={15} aria-hidden="true" />
                      My Profile
                    </Link>
                  </div>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Log out
                  </button>
                </>
              ) : (
                /* Signed-out User */
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-bold text-navy transition-colors hover:border-blue hover:text-blue"
                  >
                    <LogIn size={17} aria-hidden="true" />
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue px-3 text-sm font-bold text-white transition-colors hover:bg-deep"
                  >
                    <UserRound size={17} aria-hidden="true" />
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
