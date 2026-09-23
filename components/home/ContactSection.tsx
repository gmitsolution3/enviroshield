"use client";

import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { EASE, fadeUp, viewportOnce } from "../animations/variants";
import { ContactForm } from "../ContactForm";

export function ContactSection({ full = false }: { full?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <section
      className={`contact-section ${full ? "contact-full" : ""}`}
      id="contact"
    >
      <div className="container contact-grid">
        <div className="contact-copy">
          <motion.div
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="eyebrow eyebrow-light">
              <span />
              CONTACT US
            </div>
          </motion.div>
          <motion.h2
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: reduce ? 0 : 0.05 }}
          >
            Let&rsquo;s create something beautiful together.
          </motion.h2>
          <motion.p
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: reduce ? 0 : 0.1 }}
          >
            Have a room in mind? Tell us a little about it and
            we&rsquo;ll help you find the right finish, feel, and way
            forward.
          </motion.p>
          <motion.div
            className="contact-details"
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: reduce ? 0 : 0.1,
                  delayChildren: reduce ? 0 : 0.15,
                },
              },
            }}
          >
            {[
              {
                icon: <Clock3 />,
                b: "Working hours",
                t: "Monday – Friday, 8:00 AM – 6:00 PM",
              },
              {
                icon: <MapPin />,
                b: "Visit us",
                t: "45 Bridge Street, Brooklyn, NY",
              },
              { icon: <Phone />, b: "Call us", t: "+1 123 456 7890" },
              {
                icon: <Mail />,
                b: "Email us",
                t: "hello@enviroshield.com",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: reduce
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: reduce ? 0 : 0.5,
                      ease: EASE,
                    },
                  },
                }}
              >
                {item.icon}
                <span>
                  <b>{item.b}</b>
                  {item.t}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="contact-card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
