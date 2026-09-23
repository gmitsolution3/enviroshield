"use client";

import { Service } from "@/lib/data/content";
import { ArrowUpRight, Link } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { fadeUp, viewportOnce } from "./animations/variants";

function PaintIcon() {
  return (
    <span className="paint-icon">
      <span />
    </span>
  );
}

export function ServiceCard({
  service,
  index = 0,
}: {
  service: Service;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="service-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <div className="card-image">
        <motion.div
          className="card-image-inner"
          whileHover={reduce ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 90vw, 33vw"
          />
        </motion.div>
        <motion.span
          className="card-icon"
          whileHover={reduce ? undefined : { scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <PaintIcon />
        </motion.span>
      </div>
      <div className="card-body">
        <span className="card-kicker">{service.category}</span>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <Link
          href={`/services/${service.slug}`}
          className="text-link"
        >
          Learn more <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
