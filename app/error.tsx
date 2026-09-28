"use client";

import {
  ArrowLeft,
  CircleAlert,
  Home,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";

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

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep px-5 py-12"
      aria-labelledby="error-title"
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
        {/* Main card */}
        <section
          className="overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
          aria-labelledby="error-title"
        >
          {/* Card accent */}
          <motion.div
            className="h-1.5 bg-blue"
            aria-hidden="true"
            initial={{
              scaleX: 0,
              transformOrigin: "left",
            }}
            animate={{
              scaleX: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Brand */}
          <motion.header
            className="mt-7 flex justify-center"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
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
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              transition={{ delay: 0.3 }}
            >
              <span className="h-px w-8 bg-blue" aria-hidden="true" />

              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue">
                Something went wrong
              </span>

              <span className="h-px w-8 bg-blue" aria-hidden="true" />
            </motion.p>

            {/* Error icon */}
            <motion.div
              className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-red-400/10 w-24 h-24"
              aria-hidden="true"
              initial={{
                opacity: 0,
                scale: 0.65,
                rotate: -12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <CircleAlert
                  size={40}
                  strokeWidth={1.8}
                  className="text-red-500"
                />
              </motion.div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              id="error-title"
              className="text-[clamp(42px,7vw,68px)] font-extrabold leading-[0.95] tracking-[-0.055em] text-navy"
              initial={{
                opacity: 0,
                y: 24,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.65,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              We hit a rough patch.
            </motion.h1>

            <motion.div
              className="mx-auto mt-6 max-w-[520px]"
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
              <p className="text-[18px] leading-[1.75] text-ink">
                {`Something unexpected happened while loading this page.
                Please try again, or head back to the Enviroshield
                homepage.`}
              </p>
            </motion.div>

            {/* Primary actions */}
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
                delay: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center gap-2 rounded-full bg-blue px-6 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-deep max-[600px]:max-w-none"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Try again
              </button>

              <Link
                href="/"
                className="inline-flex h-12 w-full max-w-[160px] items-center justify-center gap-2 rounded-full border border-line px-6 text-[13px] font-bold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-blue hover:text-blue max-[600px]:max-w-none"
              >
                <Home size={16} aria-hidden="true" />
                Back home
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
                delay: 0.75,
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

        {/* Bottom brand text */}
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
            delay: 0.85,
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
