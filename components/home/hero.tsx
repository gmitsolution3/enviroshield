"use client";

import { EASE } from "@/components/animations/variants";
import { Button } from "@/components/shared";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  id: number;
  bg: string;
  eyebrow: string;
  heading: string;
  text: string;
  cta: string;
  href: string;
};

const slides: Slide[] = [
  {
    id: 1,
    bg: "https://images.pexels.com/photos/7546769/pexels-photo-7546769.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
    eyebrow: "TRANSFORM YOUR SPACE",
    heading: "Beautiful walls.\nBetter spaces.",
    text: "Professional painting and wall finishing solutions designed to transform your home or business with precision and care.",
    cta: "Start your transformation",
    href: "/contact",
  },
  {
    id: 2,
    bg: "https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
    eyebrow: "TRANSFORM YOUR SPACE",
    heading: "Color that\nchanges everything.",
    text: "From subtle finishes to bold statement walls, we bring your vision to life with exceptional craftsmanship.",
    cta: "Explore our services",
    href: "/services",
  },
  {
    id: 3,
    bg: "https://images.pexels.com/photos/8135503/pexels-photo-8135503.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600",
    eyebrow: "TRANSFORM YOUR SPACE",
    heading: "Crafted for lasting\nimpressions.",
    text: "Premium surface preparation, painting, and finishing solutions built around quality, detail, and reliability.",
    cta: "Get a free quote",
    href: "/contact",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const slide = slides[index];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + slides.length) % slides.length);
  };

  const headingLines = slide.heading.split("\n");

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence custom={direction}>
        <motion.div
          key={slide.id}
          className="hero-image"
          custom={direction}
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 1.2, ease: "easeOut" },
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={slide.bg}
            alt="Beautifully finished interior space"
            fill
            priority={index === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="hero-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <div className="container hero-content">
        <div className="hero-content-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className="eyebrow eyebrow-light"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              >
                <span />
                {slide.eyebrow}
              </motion.div>
              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  ease: EASE,
                  delay: 0.2,
                }}
              >
                {headingLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < headingLines.length - 1 && <br />}
                  </span>
                ))}
              </motion.h1>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: 0.35,
                }}
              >
                {slide.text}
              </motion.p>
              <motion.div
                className="hero-actions"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
              >
                <Button href={slide.href}>{slide.cta}</Button>
                <Link
                  className="text-link text-link-light"
                  href="/services"
                >
                  Explore our services <ArrowUpRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === index ? "active" : ""}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
          />
        ))}
      </div>
      <div className="hero-arrows">
        <motion.button
          aria-label="Previous slide"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <motion.button
          aria-label="Next slide"
          onClick={() => go(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
      <div className="hero-count">
        <strong>0{index + 1}</strong> / 0{slides.length}
      </div>
    </section>
  );
}
