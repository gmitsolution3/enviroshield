"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "motion/react";

import { fadeUp, viewportOnce } from "./animations/variants";

import { Logo } from "./Logo";

export default function Footer() {
  const reduce = useReducedMotion();

  const cols = [
    {
      title: "Explore",
      links: [
        { label: "About us", href: "/about" },
        { label: "Our services", href: "/services" },
        { label: "Products", href: "/products" },
        { label: "Journal", href: "/blog" },
      ],
    },
  ];

  return (
    <footer className="bg-[#00283d] pt-[55px] text-[#a9c1ce] min-[601px]:pt-[75px]">
      <div className="container grid grid-cols-2 gap-x-5 gap-y-9 pb-[64px] min-[901px]:grid-cols-[1.45fr_1fr_1fr_1.2fr] min-[901px]:gap-[50px]">
        {/* Brand */}
        <motion.div
          className="col-span-2 min-[901px]:col-span-1"
          variants={reduce ? undefined : fadeUp}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Logo light />

          <p className="mb-[22px] mt-[22px] max-w-[230px] text-[13px] leading-[1.7] text-[#91afbd]">
            Thoughtful painting and wall finishing for spaces that
            feel beautifully yours.
          </p>

          <div className="flex gap-2">
            {["ig", "in", "f"].map((s) => (
              <motion.span
                key={s}
                className="grid size-[29px] place-items-center rounded-[11px] border border-[#547482] text-[12px] text-[#d8e7ee]"
                whileHover={
                  reduce ? undefined : { scale: 1.08, y: -2 }
                }
                transition={{ duration: 0.2 }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Explore */}
        {cols.map((col, index) => (
          <motion.div
            key={col.title}
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            transition={{
              delay: reduce ? 0 : 0.1 * (index + 1),
            }}
          >
            <h4 className="mb-5 mt-1 text-[12px] font-normal uppercase tracking-[0.12em] text-white">
              {col.title}
            </h4>

            {col.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mb-[10px] block text-[13px] leading-[1.7] transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        ))}

        {/* Opening Hours */}
        <motion.div
          variants={reduce ? undefined : fadeUp}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          transition={{
            delay: reduce ? 0 : 0.2,
          }}
        >
          <h4 className="mb-5 mt-1 text-[12px] font-normal uppercase tracking-[0.12em] text-white">
            Opening hours
          </h4>

          <p className="mb-[10px] text-[13px] leading-[1.7]">
            Monday – Friday
            <br />
            <strong className="font-bold text-white">
              8:00 AM – 6:00 PM
            </strong>
          </p>

          <p className="mb-[10px] text-[13px] leading-[1.7]">
            Saturday
            <br />
            <strong className="font-bold text-white">
              9:00 AM – 2:00 PM
            </strong>
          </p>

          <p className="mb-[10px] text-[13px] leading-[1.7]">
            Sunday
            <br />
            <strong className="font-bold text-white">Closed</strong>
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          variants={reduce ? undefined : fadeUp}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          transition={{
            delay: reduce ? 0 : 0.3,
          }}
        >
          <h4 className="mb-5 mt-1 text-[12px] font-normal uppercase tracking-[0.12em] text-white">
            Get in touch
          </h4>

          <a
            href="tel:+11234567890"
            className="mb-[10px] block text-[13px] leading-[1.7] transition-colors duration-200 hover:text-white"
          >
            +1 123 456 7890
          </a>

          <a
            href="mailto:hello@enviroshield.com"
            className="mb-[10px] block text-[13px] leading-[1.7] transition-colors duration-200 hover:text-white"
          >
            hello@enviroshield.com
          </a>

          <p className="mb-[10px] text-[13px] leading-[1.7]">
            45 Bridge Street
            <br />
            Brooklyn, NY 11201
          </p>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="container flex flex-col justify-between gap-2 border-t border-[#214a5d] py-5 text-[11px] text-[#7797a5] min-[601px]:flex-row">
        <span>© 2026 Enviroshield. All rights reserved.</span>
        <span>Crafted for better spaces.</span>
      </div>
    </footer>
  );
}
