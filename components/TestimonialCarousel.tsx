"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useReducedMotion,
  AnimatePresence,
  motion,
} from "motion/react";
import { useState, useEffect } from "react";
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
    <div className="testimonial-wrap">
      <div className="testimonial-card">
        <div className="quote-mark">&ldquo;</div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  initial={
                    reduce ? false : { opacity: 0, scale: 0.8 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: star * 0.04, duration: 0.3 }}
                >
                  <Star size={17} fill="currentColor" />
                </motion.span>
              ))}
            </div>
            <blockquote>{current.quote}</blockquote>
            <motion.div
              className="testimonial-person"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div className="avatar">{current.name[0]}</div>
              <div>
                <strong>{current.name}</strong>
                <span>{current.role}</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="carousel-controls">
        <motion.button
          aria-label="Previous testimonial"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft />
        </motion.button>
        <span>
          0{index + 1} <i>/</i> 0{items.length}
        </span>
        <motion.button
          aria-label="Next testimonial"
          onClick={() => go(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight />
        </motion.button>
      </div>
    </div>
  );
}
