"use client";

import { Service } from "@/lib/data/content";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { fadeUp, viewportOnce } from "./animations/variants";

function PaintIcon() {
  return (
    <span className="relative block h-[24px] w-[24px]">
      <span className="absolute bottom-[2px] left-[3px] h-[15px] w-[7px] rotate-[-8deg] rounded-[2px] bg-current" />
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
      className="group overflow-hidden rounded-[16px] bg-white"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: index * 0.1 }}
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <div className="relative h-[220px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
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
          className="absolute bottom-[16px] right-[16px] grid size-[52px] place-items-center rounded-full bg-white text-navy shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          whileHover={reduce ? undefined : { scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <PaintIcon />
        </motion.span>
      </div>

      <div className="p-[24px]">
        <span className="mb-[10px] block text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue">
          {service.category}
        </span>

        <h3 className="mb-[10px] text-[23px] font-extrabold leading-[1.15] tracking-[-0.035em] text-navy">
          {service.title}
        </h3>

        <p className="mb-[18px] text-[14px] leading-[1.7] text-ink">
          {service.description}
        </p>

        <Link
          href={`/services/${service.slug}`}
          className="group/link inline-flex items-center gap-[7px] text-[13px] font-bold text-navy transition-colors duration-200 hover:text-blue"
        >
          Learn more
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover/link:translate-x-1"
          />
        </Link>
      </div>
    </motion.article>
  );
}