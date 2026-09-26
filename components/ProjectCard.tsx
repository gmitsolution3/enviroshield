"use client";

import { Project } from "@/lib/data/content";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { EASE, viewportOnce } from "./animations/variants";

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={`relative min-h-[240px] overflow-hidden rounded-[14px] ${
        index === 0
          ? "row-span-2"
          : index === 3
            ? "col-[2/span_2]"
            : ""
      } max-[900px]:min-h-[240px] max-[900px]:${
        index === 0
          ? "row-span-2"
          : index === 3
            ? "col-[1/span_2]"
            : ""
      } max-[600px]:h-[260px] max-[600px]:min-h-[260px] max-[600px]:${
        index === 0 ? "h-[320px]" : ""
      }`}
      variants={{
        hidden: { opacity: 0, scale: 1.05 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: EASE,
            delay: index * 0.08,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={viewportOnce}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        variants={{
          hover: reduce ? {} : { scale: 1.06 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Image
          src={project.image}
          alt={`${project.title} - ${project.category}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(transparent_30%,rgba(0,18,33,0.86))] p-6 text-white opacity-[0.9]"
        initial={false}
        variants={{
          hover: reduce ? {} : { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-white">
          {project.category}
        </span>

        <motion.h3
          className="mt-2 text-[28px] font-semibold tracking-[-0.03em]"
          initial={reduce ? false : { y: 10, opacity: 0 }}
          variants={{
            hover: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          {project.title}
        </motion.h3>

        <motion.div
          className="absolute bottom-6 right-6 text-white"
          initial={reduce ? false : { x: -5, opacity: 0 }}
          variants={{
            hover: { x: 0, opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          <ArrowUpRight aria-hidden="true" />
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
