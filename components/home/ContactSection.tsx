"use client";

import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { EASE, fadeUp, viewportOnce } from "../animations/variants";
import { ContactForm } from "../ContactForm";
import Container from "../Container";

export function ContactSection({ full = false }: { full?: boolean }) {
  const reduce = useReducedMotion();

  return (
    <section
      className="bg-deep py-[105px] max-[600px]:py-[70px]"
      id="contact"
    >
      <Container className="grid grid-cols-[0.85fr_1.15fr] items-start gap-[95px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        <div className="text-white">
          <motion.div
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
              <span className="h-[2px] w-7 bg-current" aria-hidden="true" />
              CONTACT US
            </div>
          </motion.div>

          <motion.h2
            className="mb-5 text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.03] tracking-[-0.05em]"
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: reduce ? 0 : 0.05 }}
          >
            Let&rsquo;s create something beautiful together.
          </motion.h2>

          <motion.p
            className="mb-[35px] max-w-[470px] text-[#c8ddec] leading-[1.7]"
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
            className="grid gap-5"
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
                icon: <Clock3 aria-hidden="true" />,
                b: "Working hours",
                t: "Monday – Friday, 8:00 AM – 6:00 PM",
              },
              {
                icon: <MapPin aria-hidden="true" />,
                b: "Visit us",
                t: "45 Bridge Street, Brooklyn, NY",
              },
              {
                icon: <Phone aria-hidden="true" />,
                b: "Call us",
                t: "+1 123 456 7890",
              },
              {
                icon: <Mail aria-hidden="true" />,
                b: "Email us",
                t: "hello@enviroshield.com",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-[13px]"
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
                <span className="mt-0.5 text-[#9dccf9]">
                  {item.icon}
                </span>

                <span className="text-[13px] text-[#bfd3df]">
                  <b className="mb-[3px] block text-[12px] text-white">
                    {item.b}
                  </b>
                  {item.t}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="rounded-[16px] bg-white p-[34px] max-[600px]:p-5 max-[600px]:px-4">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}