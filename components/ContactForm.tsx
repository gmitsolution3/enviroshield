"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE, viewportOnce } from "./animations/variants";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const reduce = useReducedMotion();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      setSent(true);
    }, 650);
  }

  if (sent) {
    return (
      <motion.div
        className="py-[65px] text-center px-5"
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        role="status"
        aria-live="polite"
      >
        <motion.div
          className="mx-auto mb-[18px] grid size-[54px] place-items-center rounded-full bg-[#e8f8ef] text-[#1c9b5b]"
          initial={reduce ? false : { scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
          aria-hidden="true"
        >
          <Check />
        </motion.div>

        <h3 className="mb-[10px] text-[24px] text-navy">
          Thank you for reaching out.
        </h3>

        <p className="mx-auto mb-[22px] max-w-[330px] text-[14px] leading-[1.6] text-ink">
          Your message is with our team. We will be in touch shortly
          to talk through your space.
        </p>

        <button
          className="inline-flex items-center gap-[7px] text-[13px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
          onClick={() => setSent(false)}
        >
          Send another message
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      className="grid gap-[17px]"
      onSubmit={submit}
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, ease: EASE }}
      aria-label="Contact Enviroshield"
      aria-busy={loading}
    >
      <div className="grid grid-cols-2 gap-[15px] max-[600px]:grid-cols-1">
        <label className="grid gap-2 text-[12px] font-bold text-navy">
          First name *
          <input
            required
            name="firstName"
            autoComplete="given-name"
            placeholder="Your first name"
            className="w-full rounded-[9px] border border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-[13px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
          />
        </label>

        <label className="grid gap-2 text-[12px] font-bold text-navy">
          Last name *
          <input
            required
            name="lastName"
            autoComplete="family-name"
            placeholder="Your last name"
            className="w-full rounded-[9px] border border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-[13px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-[15px] max-[600px]:grid-cols-1">
        <label className="grid gap-2 text-[12px] font-bold text-navy">
          Phone number *
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="+1 123 456 7890"
            className="w-full rounded-[9px] border border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-[13px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
          />
        </label>

        <label className="grid gap-2 text-[12px] font-bold text-navy">
          Email address *
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@email.com"
            className="w-full rounded-[9px] border border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-[13px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-[12px] font-bold text-navy">
        Service type *
        <select
          required
          name="service"
          defaultValue=""
          className="w-full rounded-[9px] border border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-[13px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
        >
          <option value="" disabled>
            Select a service
          </option>
          <option>Interior Painting</option>
          <option>Exterior Painting</option>
          <option>Wallpaper Installation</option>
          <option>Decorative Finishes</option>
          <option>Commercial Painting</option>
          <option>Other</option>
        </select>
      </label>

      <label className="grid gap-2 text-[12px] font-bold text-navy">
        Tell us about your space *
        <textarea
          required
          name="message"
          placeholder="A little about your project..."
          rows={5}
          className="w-full resize-y rounded-[9px] border border-[#e0e5ea] bg-[#fafbfd] px-[14px] py-[13px] text-[13px] font-normal text-ink outline-none transition-[border,box-shadow] duration-200 placeholder:text-[#9ca9b1] focus:border-blue focus:shadow-[0_0_0_3px_rgba(1,110,220,0.1)]"
        />
      </label>

      <motion.button
        className="flex min-h-[48px] items-center justify-center gap-2 !rounded-4xl !bg-blue text-[13px] font-extrabold text-white transition-colors duration-200 !hover:bg-[#005cb9] disabled:opacity-70"
        type="submit"
        disabled={loading}
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {loading ? "Sending…" : "Send message"}
        <ArrowUpRight size={17} aria-hidden="true" />
      </motion.button>
    </motion.form>
  );
}
