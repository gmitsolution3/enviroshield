"use client";

import type { ITestimonial } from "@/types/admin/testimonial.type";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "./animations/variants";

type TestimonialCarouselProps = {
  testimonials: ITestimonial[];
};

export function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    if (index >= testimonials.length) {
      setIndex(0);
    }
  }, [index, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const current = testimonials[index];

  const go = (dir: number) => {
    setDirection(dir);

    setIndex(
      (prev) =>
        (prev + dir + testimonials.length) %
        testimonials.length,
    );
  };

  return (
    <div className="relative">
      {/* Outer Card with Liquid Glass Effect */}
      <div className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-gradient-to-br from-white/70 via-white/45 to-white/20 px-[50px] pb-[35px] pt-[45px] backdrop-blur-2xl backdrop-saturate-200 shadow-[0_20px_50px_-10px_rgba(0,51,78,0.12),_inset_0_1px_2px_0_rgba(255,255,255,1),_inset_0_-1px_1px_0_rgba(255,255,255,0.4)] max-[600px]:px-[25px] max-[600px]:pb-[28px] max-[600px]:pt-[35px]">
        {/* Specular Liquid Sheen Overlay */}
        <div className="pointer-events-none absolute -left-[50%] -top-[50%] h-[200%] w-[200%] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.7)_0%,transparent_50%)] opacity-80" />

        <div
          className="absolute right-[36px] top-[18px] font-serif text-[92px] leading-none text-[#d9eaf9]/60 select-none drop-shadow-sm"
          aria-hidden="true"
        >
          &ldquo;
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current._id}
            custom={direction}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: 30 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: -30 }
            }
            transition={{ duration: 0.4, ease: EASE }}
            className="relative z-10"
            aria-live="polite"
          >
            <div
              className="mb-[22px] flex gap-[5px] text-[#f4a623]"
              aria-label={`${current.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  initial={
                    reduce
                      ? false
                      : { opacity: 0, scale: 0.8 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: star * 0.04,
                    duration: 0.3,
                  }}
                  aria-hidden="true"
                >
                  <Star
                    size={17}
                    fill={
                      star <= current.rating
                        ? "currentColor"
                        : "none"
                    }
                  />
                </motion.span>
              ))}
            </div>

            <blockquote className="mb-[32px] text-[clamp(21px,2.5vw,30px)] leading-[1.35] tracking-[-0.025em] text-navy">
              "{current.content}"
            </blockquote>

            <motion.div
              className="flex items-center gap-3"
              initial={
                reduce
                  ? false
                  : { opacity: 0, scale: 0.9 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {current.clientImage?.url ? (
                <div className="size-10 overflow-hidden rounded-full bg-white shadow-inner">
                  <img
                    src={current.clientImage.url}
                    alt={
                      current.clientImage.alt ||
                      current.clientName
                    }
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#cfe5f9] to-[#a2cdf5] font-extrabold text-blue shadow-inner">
                  {current.clientName.charAt(0)}
                </div>
              )}

              <div>
                <strong className="block text-[13px] text-navy">
                  {current.clientName}
                </strong>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {testimonials.length > 1 ? (
        <div className="mt-[18px] flex items-center justify-end gap-[14px] text-[12px] text-ink">
          <motion.button
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="grid size-[38px] place-items-center rounded-full border border-white/70 bg-white/50 text-navy backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_12px_rgba(0,51,78,0.06),_inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-200 hover:border-blue hover:bg-blue hover:text-white"
          >
            <ChevronLeft
              size={18}
              aria-hidden="true"
            />
          </motion.button>

          <span className="font-medium tracking-wider">
            {String(index + 1).padStart(2, "0")}{" "}
            <i
              className="mx-[5px] not-italic text-[#b1bdc6]"
              aria-hidden="true"
            >
              /
            </i>{" "}
            {String(testimonials.length).padStart(
              2,
              "0",
            )}
          </span>

          <motion.button
            aria-label="Next testimonial"
            onClick={() => go(1)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="grid size-[38px] place-items-center rounded-full border border-white/70 bg-white/50 text-navy backdrop-blur-md backdrop-saturate-150 shadow-[0_4px_12px_rgba(0,51,78,0.06),_inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-200 hover:border-blue hover:bg-blue hover:text-white"
          >
            <ChevronRight
              size={18}
              aria-hidden="true"
            />
          </motion.button>
        </div>
      ) : null}
    </div>
  );
}