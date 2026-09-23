"use client";

import { EASE, viewportOnce } from "@/components/animations/variants";
import { services } from "@/lib/data/content";
import {
  ArrowUpRight,
  Paintbrush,
  Sparkles,
  Wallpaper,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Button";
import { SectionHeader } from "../SectionHeader";
import styles from "./services-section.module.css";

const cards = [
  {
    ...services[0],
    title: "Precision Painting Services",
    description:
      "Our precision painting services focus on delivering smooth, long-lasting finishes that bring your vision to life.",
    icon: Paintbrush,
  },
  {
    ...services[3],
    title: "Wallpaper Removal & Prep",
    description:
      "Preparing your walls for new wallpaper or paint starts with professional removal of old layers and careful surface prep.",
    icon: Wallpaper,
  },
  {
    ...services[2],
    title: "Custom Wallpapering",
    description:
      "With our custom wallpapering services, we offer a variety of textures, patterns, and designs to suit any aesthetic.",
    icon: Sparkles,
  },
];

export default function ServicesSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className={styles.section}
      aria-labelledby="services-heading"
    >
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionHeader
            eyebrow="OUR SERVICES"
            title="Design-Driven Painting & Wallpapering Services"
            light
          />
          
          <Button href="/services" variant="light">
            View all services
          </Button>
        </motion.div>

        <div
          className={styles.carousel}
          role="region"
          aria-label="Our services"
        >
          <div className={styles.track}>
            {cards.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.id}
                  className={styles.card}
                  initial={reduce ? false : { opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: 0.55,
                    ease: EASE,
                    delay: index * 0.1,
                  }}
                  whileHover={reduce ? undefined : { y: -6 }}
                >
                  <div className={styles.imageWrap}>
                    <motion.div
                      className={styles.imageInner}
                      whileHover={
                        reduce ? undefined : { scale: 1.04 }
                      }
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 767px) 86vw, (max-width: 1100px) 44vw, 300px"
                      />
                    </motion.div>
                    <motion.span
                      className={styles.icon}
                      whileHover={
                        reduce ? undefined : { scale: 1.05 }
                      }
                      transition={{ duration: 0.25 }}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </motion.span>
                  </div>
                  <div className={styles.body}>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <Link
                      href={`/services/${service.slug}`}
                      className={styles.learnMore}
                    >
                      Learn More <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
