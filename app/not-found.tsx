"use client";

import { ArrowLeft, Home } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import Logo from "@/components/Logo";

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function NotFound() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep px-5 py-12"
      aria-labelledby="not-found-title"
    >
      {/* Background decoration */}
      <motion.div
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.div
        className="pointer-events-none absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full border border-white/10"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.1,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[820px]"
        initial={{
          opacity: 0,
          y: 28,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Main error content */}
        <section
          className="overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          aria-labelledby="not-found-title"
        >
          {/* Card accent */}
          <motion.div
            className="h-1.5 bg-blue"
            aria-hidden="true"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Brand */}
          <motion.header
            className="mt-7 flex justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link href="/" aria-label="Enviroshield home">
              <Logo />
            </Link>
          </motion.header>

          <div className="px-10 py-12 text-center max-[600px]:px-6 max-[600px]:py-9">
            {/* Eyebrow */}
            <motion.p
              className="mb-6 flex items-center justify-center gap-3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <span className="h-px w-8 bg-blue" aria-hidden="true" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue">
                Page not found
              </span>

              <span className="h-px w-8 bg-blue" aria-hidden="true" />
            </motion.p>

            {/* Error heading */}
            <motion.h1
              id="not-found-title"
              className="text-[clamp(88px,16vw,148px)] font-extrabold leading-[0.78] text-navy"
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.7,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              404
            </motion.h1>

            <motion.div
              className="mx-auto mt-10 max-w-[470px]"
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h2 className="mb-4 text-[clamp(27px,4vw,38px)] font-extrabold leading-[1.08] tracking-[-0.045em] text-navy">
                This page needs a fresh finish.
              </h2>

              <p className="text-[15px] leading-[1.75] text-ink">
                The page you&apos;re looking for may have moved, been
                removed, or never existed. Let&apos;s get you back to
                somewhere useful.
              </p>
            </motion.div>

            {/* Primary navigation */}
            <motion.nav
              className="mt-9 flex items-center justify-center gap-3 max-[600px]:flex-col"
              aria-label="Error page navigation"
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href="/"
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center gap-2 rounded-full bg-blue px-6 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-deep max-[600px]:max-w-none"
              >
                <Home size={16} aria-hidden="true" />
                Back home
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center rounded-full border border-line px-6 text-[13px] font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:text-blue max-[600px]:max-w-none"
              >
                Contact us
              </Link>
            </motion.nav>

            {/* Secondary navigation */}
            <motion.nav
              className="mt-8 border-t border-line pt-7"
              aria-label="Return navigation"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[12px] font-bold text-ink transition-[gap,color] duration-200 hover:gap-3 hover:text-blue"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Return to Enviroshield
              </Link>
            </motion.nav>
          </div>
        </section>

        {/* Brand descriptor */}
        <motion.footer
          className="mt-6 text-center"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.75,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
            Painting · Wall Finishing · Transformation
          </p>
        </motion.footer>
      </motion.div>
    </main>
  );
}
