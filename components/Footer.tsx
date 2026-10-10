"use client";

import SocialIcon from "@/components/icon/SocialIcons";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { fadeUp, viewportOnce } from "./animations/variants";
import Container from "./Container";
import Logo from "./Logo";

const socials = [
  {
    name: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
  },
  {
    name: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/",
  },
];

const cols = [
  {
    title: "Explore",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Insights", href: "/blog" },
    ],
  },
];

export default function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="bg-[#00283d] pt-[55px] text-[#a9c1ce] min-[601px]:pt-[75px]">
      <Container className="grid grid-cols-2 gap-x-5 gap-y-9 pb-[64px] min-[901px]:grid-cols-[1.45fr_1fr_1fr_1.2fr] min-[901px]:gap-[50px]">
        {/* Brand */}
        <motion.div
          className="col-span-2 min-[901px]:col-span-1"
          variants={reduce ? undefined : fadeUp}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Logo light />

          <p className="mb-[22px] mt-[22px] max-w-[280px] text-[13px] leading-[1.7] text-[#91afbd]">
            Since 2009, Enviro Shield has delivered professional
            waterproofing, heatproofing, flooring, grouting, and
            protective coating solutions for residential, commercial,
            and industrial properties in Bangladesh.
          </p>

          <div className="flex gap-2">
            {socials.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid size-[34px] place-items-center rounded-[11px] border border-[#547482] text-[#d8e7ee] transition-colors duration-200 hover:border-white hover:bg-white/10 hover:text-white"
                whileHover={
                  reduce ? undefined : { scale: 1.08, y: -2 }
                }
                transition={{ duration: 0.2 }}
              >
                <SocialIcon name={social.name} size={16} />
              </motion.a>
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

          <div className="space-y-4">
            <a
              href="tel:+8801613220101"
              className="flex items-start gap-3 text-[13px] leading-[1.7] transition-colors duration-200 hover:text-white"
            >
              <Phone
                size={16}
                className="mt-0.5 shrink-0 text-[#91afbd]"
                aria-hidden="true"
              />
              <span>+8801613220101</span>
            </a>

            <a
              href="mailto:enviroshield.bd@gmail.com"
              className="flex items-start gap-3 text-[13px] leading-[1.7] transition-colors duration-200 hover:text-white"
            >
              <Mail
                size={16}
                className="mt-0.5 shrink-0 text-[#91afbd]"
                aria-hidden="true"
              />
              <span>enviroshield.bd@gmail.com</span>
            </a>

            <div className="flex items-start gap-3 text-[13px] leading-[1.7]">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-[#91afbd]"
                aria-hidden="true"
              />
              <span>
                House No: 22/13-15, Block-B, Bauniabad R/A,
                <br /> Mirpur 11, Pallabi, Dhaka 1216
              </span>
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Bottom */}
      <Container className="flex flex-col justify-between gap-2 border-t border-[#214a5d] py-5 text-[11px] text-[#7797a5] min-[601px]:flex-row">
        <span>© 2026 Enviro Shield. All rights reserved.</span>
        <span>
          Protecting what matters. Building with confidence.
        </span>
      </Container>
    </footer>
  );
}
