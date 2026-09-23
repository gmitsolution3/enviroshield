"use client";

import Link  from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, viewportOnce } from "./animations/variants";
import { Logo } from "./Logo";

export function Footer() {
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
    <footer className="footer">
      <div className="container footer-grid">
        <motion.div
          variants={reduce ? undefined : fadeUp}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
        >
          <Logo light />
          <p>
            Thoughtful painting and wall finishing for spaces that
            feel beautifully yours.
          </p>
          <div className="socials">
            {["ig", "in", "f"].map((s) => (
              <motion.span
                key={s}
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

        {cols.map((col, index) => (
          <motion.div
            key={col.title}
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: reduce ? 0 : 0.1 * (index + 1) }}
          >
            <h4>{col.title}</h4>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </motion.div>
        ))}

        <motion.div
          variants={reduce ? undefined : fadeUp}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ delay: reduce ? 0 : 0.2 }}
        >
          <h4>Opening hours</h4>
          <p>
            Monday – Friday
            <br />
            <strong>8:00 AM – 6:00 PM</strong>
          </p>
          <p>
            Saturday
            <br />
            <strong>9:00 AM – 2:00 PM</strong>
          </p>
          <p>
            Sunday
            <br />
            <strong>Closed</strong>
          </p>
        </motion.div>

        <motion.div
          variants={reduce ? undefined : fadeUp}
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ delay: reduce ? 0 : 0.3 }}
        >
          <h4>Get in touch</h4>
          <a href="tel:+11234567890">+1 123 456 7890</a>
          <a href="mailto:hello@enviroshield.com">
            hello@enviroshield.com
          </a>
          <p>
            45 Bridge Street
            <br />
            Brooklyn, NY 11201
          </p>
        </motion.div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Enviroshield. All rights reserved.</span>
        <span>Crafted for better spaces.</span>
      </div>
    </footer>
  );
}
