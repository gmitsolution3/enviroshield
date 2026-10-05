"use client";

import { EASE, viewportOnce } from "@/components/animations/variants";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import type { IProject } from "@/types";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

interface ProjectsSectionContentProps {
  projects: IProject[];
}

export default function ProjectsSectionContent({
  projects,
}: ProjectsSectionContentProps) {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="projects-heading"
      className="bg-deep py-[112px] pb-[120px] max-[900px]:py-20 max-[900px]:pb-[120px] max-[600px]:py-16 max-[600px]:pb-[120px]"
    >
      <Container>
        <div className="mb-11 flex items-end justify-between max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[25px]">
          <SectionHeader
            eyebrow="OUR WORK"
            title="See our work in action"
            text="A few spaces we have had the pleasure of helping take shape."
            light
            headingId="projects-heading"
          />

          <Button href="/projects" variant="light">
            View all projects
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-[1.15fr_0.85fr_1fr] grid-rows-[260px_260px] gap-[18px] max-[900px]:grid-cols-2 max-[900px]:grid-rows-[260px_220px_220px] max-[600px]:flex max-[600px]:flex-col">
            {projects.map((project, index) => {
              const location = [
                project.location?.area,
                project.location?.city,
                project.location?.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <Link
                  key={project._id}
                  href={`/projects/${project.slug}`}
                  className={`group relative min-h-[240px] overflow-hidden rounded-[14px] max-[900px]:min-h-[240px] max-[600px]:h-[260px] max-[600px]:min-h-[260px] ${
                    index === 0
                      ? "row-span-2 max-[900px]:row-span-2 max-[600px]:h-[320px]"
                      : index === 3
                        ? "col-[2/span_2] max-[900px]:col-[1/span_2]"
                        : ""
                  }`}
                  aria-label={`View ${project.title} project`}
                >
                  <motion.article
                    className="relative h-full w-full overflow-hidden rounded-[14px]"
                    initial={
                      reduce
                        ? false
                        : {
                            opacity: 0,
                            scale: 1.05,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={viewportOnce}
                    transition={{
                      duration: 0.6,
                      ease: EASE,
                      delay: index * 0.08,
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 will-change-transform"
                      whileHover={
                        reduce
                          ? undefined
                          : {
                              scale: 1.06,
                            }
                      }
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <Image
                        src={project.primaryImage.url}
                        alt={
                          project.primaryImage.alt ||
                          `${project.title} - Enviroshield project`
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </motion.div>

                    <div className="absolute inset-0 bg-[linear-gradient(transparent_30%,rgba(0,18,33,0.88))]" />

                    <motion.div
                      className="absolute inset-0 flex flex-col justify-end p-6 text-white"
                      whileHover={
                        reduce
                          ? undefined
                          : {
                              opacity: 1,
                            }
                      }
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/80">
                        {project.isFeatured
                          ? "Featured Project"
                          : "Project"}
                      </span>

                      <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">
                        {project.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 max-w-[520px] text-sm leading-6 text-white/75">
                        {project.description}
                      </p>

                      {location && (
                        <span className="mt-3 text-xs font-medium text-white/65">
                          {location}
                        </span>
                      )}

                      <motion.div
                        className="absolute bottom-6 right-6"
                        initial={
                          reduce
                            ? false
                            : {
                                x: -5,
                                opacity: 0,
                              }
                        }
                        whileHover={
                          reduce
                            ? undefined
                            : {
                                x: 0,
                                opacity: 1,
                              }
                        }
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path d="M7 17 17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-12 text-center"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h3 className="text-2xl font-semibold text-white">
              No featured projects available
            </h3>

            <p className="mt-3 max-w-[560px] text-sm leading-6 text-white/65">
              We're currently updating our featured projects. Please
              check back soon or explore our full project portfolio.
            </p>

            <Button href="/projects" variant="light" className="mt-6">
              Explore all projects
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
