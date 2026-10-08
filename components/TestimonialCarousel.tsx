"use client";

import type { ITestimonial } from "@/types/admin/testimonial.type";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "./animations/variants";

type TestimonialCarouselProps = {
  testimonials: ITestimonial[];
};

const AUTOPLAY_MS = 5500;

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const total = testimonials.length;

  // Restarts after every slide change, so a manual click
  // never gets followed by an instant auto-advance.
  useEffect(() => {
    if (total <= 1) {
      return;
    }

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [index, total]);

  useEffect(() => {
    if (index >= total) {
      setIndex(0);
    }
  }, [index, total]);

  if (total === 0) {
    return null;
  }

  const go = (dir: number) => {
    setIndex((prev) => (prev + dir + total) % total);
  };

  return (
    <div className="relative">
      {/* Glass card with a defined edge */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-gradient-to-br from-white/80 via-white/55 to-white/30 px-[50px] pb-[34px] pt-[44px] ring-1 ring-navy/[0.07] backdrop-blur-2xl backdrop-saturate-200 shadow-[0_24px_56px_-14px_rgba(0,51,78,0.22),_inset_0_1px_2px_0_rgba(255,255,255,1)] max-[600px]:px-[25px] max-[600px]:pb-[26px] max-[600px]:pt-[34px]">
        {/* Soft sheen */}
        <div className="pointer-events-none absolute -left-[50%] -top-[50%] h-[200%] w-[200%] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.7)_0%,transparent_50%)] opacity-80" />

        {/* Big quote mark */}
        <div
          className="pointer-events-none absolute right-[34px] top-[14px] select-none font-serif text-[110px] leading-none text-blue/15"
          aria-hidden="true"
        >
          &ldquo;
        </div>

        {/* All slides share one grid cell, so the card is always
            as tall as the tallest testimonial. No layout shift. */}
        <div className="relative z-10 grid" aria-live="polite">
          {testimonials.map((item, i) => {
            const active = i === index;

            // Which side an inactive slide waits on (shortest way around)
            const offset = (i - index + total) % total;
            const side = offset <= total / 2 ? 1 : -1;

            return (
              <motion.div
                key={item._id}
                className={`col-start-1 row-start-1 ${
                  active ? "" : "pointer-events-none select-none"
                }`}
                aria-hidden={!active}
                initial={false}
                animate={{
                  opacity: active ? 1 : 0,
                  x: reduce || active ? 0 : side * 30,
                }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {/* Stars */}
                <div
                  className="mb-[22px] flex gap-[5px] text-[#f4a623]"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.span
                      key={star}
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                        scale: reduce || active ? 1 : 0.8,
                      }}
                      transition={{
                        delay: active ? star * 0.04 : 0,
                        duration: 0.3,
                      }}
                      aria-hidden="true"
                    >
                      <Star
                        size={18}
                        fill={
                          star <= item.rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="mb-[28px] text-[clamp(21px,2.5vw,29px)] font-medium leading-[1.38] tracking-[-0.025em] text-navy">
                  &ldquo;{item.content}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-navy/10 pt-[20px]">
                  {item.clientImage?.url ? (
                    <div className="size-[46px] shrink-0 overflow-hidden rounded-full bg-white shadow-md ring-2 ring-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.clientImage.url}
                        alt={item.clientImage.alt || item.clientName}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="grid size-[46px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#cfe5f9] to-[#a2cdf5] text-[17px] font-extrabold text-blue shadow-md ring-2 ring-white">
                      {item.clientName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <strong className="block truncate text-[15px] font-extrabold text-navy">
                      {item.clientName}
                    </strong>
                    <span className="text-[12px] text-ink/60">
                      Client review
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      {total > 1 ? (
        <div className="mt-[18px] flex items-center justify-end gap-[14px] text-[12px] text-ink">
          <motion.button
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="grid size-[38px] place-items-center rounded-full border border-white/70 bg-white/50 text-navy backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_12px_rgba(0,51,78,0.06),_inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-200 hover:border-blue hover:bg-blue hover:text-white"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </motion.button>

          <span className="font-medium tracking-wider">
            {String(index + 1).padStart(2, "0")}{" "}
            <i
              className="mx-[5px] not-italic text-[#b1bdc6]"
              aria-hidden="true"
            >
              /
            </i>{" "}
            {String(total).padStart(2, "0")}
          </span>

          <motion.button
            aria-label="Next testimonial"
            onClick={() => go(1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="grid size-[38px] place-items-center rounded-full border border-white/70 bg-white/50 text-navy backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_12px_rgba(0,51,78,0.06),_inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-200 hover:border-blue hover:bg-blue hover:text-white"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </motion.button>
        </div>
      ) : null}
    </div>
  );
}