"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "./animations/variants";

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const reduce = useReducedMotion();

  const items = [
    {
      quote:
        "Enviroshield completely transformed our living room. The finish was flawless and the team was incredibly professional.",
      name: "Maya R.",
      role: "Homeowner, North London",
    },
    {
      quote:
        "From preparation to final cleanup, everything was handled with care. The result exceeded our expectations.",
      name: "Daniel K.",
      role: "Property manager",
    },
    {
      quote:
        "We needed a bold feature wall for our studio and Enviroshield delivered exactly what we envisioned.",
      name: "Aisha T.",
      role: "Studio founder",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % items.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const current = items[index];

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  return (
    <div className="relative">
      <div className="relative rounded-[18px] bg-white px-[50px] pb-[35px] pt-[45px] shadow-[0_12px_30px_rgba(0,51,78,0.05)] max-[600px]:px-[25px] max-[600px]:pb-[28px] max-[600px]:pt-[35px]">
        <div className="absolute right-[36px] top-[18px] font-serif text-[92px] leading-none text-[#d9eaf9]">
          &ldquo;
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="mb-[22px] flex gap-[5px] text-[#f4a623]">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  initial={
                    reduce ? false : { opacity: 0, scale: 0.8 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: star * 0.04,
                    duration: 0.3,
                  }}
                >
                  <Star size={17} fill="currentColor" />
                </motion.span>
              ))}
            </div>

            <blockquote className="mb-[32px] text-[clamp(21px,2.5vw,30px)] leading-[1.35] tracking-[-0.025em] text-navy">
              {current.quote}
            </blockquote>

            <motion.div
              className="flex items-center gap-3"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div className="grid size-10 place-items-center rounded-full bg-[#cfe5f9] font-extrabold text-blue">
                {current.name[0]}
              </div>

              <div>
                <strong className="block text-[13px] text-navy">
                  {current.name}
                </strong>

                <span className="mt-[3px] block text-[12px] text-ink">
                  {current.role}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-[18px] flex items-center justify-end gap-[14px] text-[12px] text-ink">
        <motion.button
          aria-label="Previous testimonial"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="grid size-[38px] place-items-center rounded-full border border-[#cdd6df] text-navy transition-colors duration-200 hover:border-blue hover:bg-blue hover:text-white"
        >
          <ChevronLeft />
        </motion.button>

        <span>
          0{index + 1}{" "}
          <i className="mx-[5px] not-italic text-[#b1bdc6]">/</i> 0
          {items.length}
        </span>

        <motion.button
          aria-label="Next testimonial"
          onClick={() => go(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="grid size-[38px] place-items-center rounded-full border border-[#cdd6df] text-navy transition-colors duration-200 hover:border-blue hover:bg-blue hover:text-white"
        >
          <ChevronRight />
        </motion.button>
      </div>
    </div>
  );
}
