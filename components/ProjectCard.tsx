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
      className={`project-card project-${index + 1}`}
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
        className="project-image-inner"
        variants={{
          hover: reduce ? {} : { scale: 1.06 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
      <motion.div
        className="project-overlay"
        initial={false}
        variants={{
          hover: reduce ? {} : { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
      >
        <span>{project.category}</span>
        <motion.h3
          initial={reduce ? false : { y: 10, opacity: 0 }}
          variants={{
            hover: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          {project.title}
        </motion.h3>
        <motion.div
          className="project-arrow"
          initial={reduce ? false : { x: -5, opacity: 0 }}
          variants={{
            hover: { x: 0, opacity: 1 },
          }}
          transition={{ duration: 0.3 }}
        >
          <ArrowUpRight />
        </motion.div>
      </motion.div>
    </motion.article>
  );
}