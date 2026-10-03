"use client";

import {
  ArrowUpRight,
  Check,
  Layers3,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import Image from "next/image";

import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";

import type { IServiceContentSection } from "@/types/admin/service.type";

type ServiceFeatureCardsProps = {
  whyEnviroshield: IServiceContentSection;
  process: IServiceContentSection;
  benefits: IServiceContentSection;
};

type FeatureCard = {
  number: string;
  eyebrow: string;
  title: string;
  icon: typeof ShieldCheck;
  section: IServiceContentSection;
};

export default function ServiceFeatureCards({
  whyEnviroshield,
  process,
  benefits,
}: ServiceFeatureCardsProps) {
  const cards: FeatureCard[] = [
    {
      number: "01",
      eyebrow: "WHY ENVIROSHIELD",
      title: "Built around quality",
      icon: ShieldCheck,
      section: whyEnviroshield,
    },
    {
      number: "02",
      eyebrow: "OUR PROCESS",
      title: "A process you can trust",
      icon: Workflow,
      section: process,
    },
    {
      number: "03",
      eyebrow: "KEY BENEFITS",
      title: "Made to perform",
      icon: Layers3,
      section: benefits,
    },
  ];

  return (
    <section
      aria-labelledby="service-features-heading"
      className="relative overflow-hidden bg-mist py-[120px] max-[900px]:py-20 max-[600px]:py-16"
    >
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-180px] top-[120px] h-[420px] w-[420px] rounded-full bg-blue/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-200px] right-[-160px] h-[420px] w-[420px] rounded-full bg-deep/5 blur-3xl"
      />

      <div className="mx-auto w-[calc(100%_-_48px)] max-w-[1200px] max-[900px]:w-[min(calc(100%_-_40px),680px)] max-[600px]:w-[calc(100%_-_32px)]">
        {/* Section heading */}
        <div className="mb-[58px] max-w-[720px]">
          <div className="mb-[18px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
            <span
              aria-hidden="true"
              className="h-[2px] w-7 bg-current"
            />
            THE ENVIROSHIELD DIFFERENCE
          </div>

          <h2
            id="service-features-heading"
            className="max-w-[720px] text-[clamp(36px,5vw,62px)] font-extrabold leading-[0.98] tracking-[-0.055em] text-navy"
          >
            More than a service.
            <br />
            <span className="text-blue">A better finish.</span>
          </h2>

          <p className="mt-6 max-w-[650px] text-[16px] leading-[1.75] text-ink/75">
            From preparation to completion, every detail is handled
            with care, precision, and a focus on long-lasting results.
          </p>
        </div>

        {/* Cards */}
        <StaggerContainer className="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-1">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <StaggerItem key={card.number}>
                <article className="group relative h-full overflow-hidden rounded-[22px] border border-line bg-white  transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,51,78,0.13)]">
                  {/* Image */}
                  <div className="relative h-[280px] overflow-hidden max-[600px]:h-[250px]">
                    <Image
                      src={card.section.image.url}
                      alt={
                        card.section.image.alt ||
                        `${card.title} - Enviroshield`
                      }
                      fill
                      sizes="(max-width: 1000px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/10 to-transparent" />

                    {/* Number */}
                    <div className="absolute left-5 top-5 grid size-12 place-items-center rounded-full border border-white/30 bg-blue/80 text-[12px] font-extrabold tracking-[0.08em] text-white backdrop-blur-md">
                      {card.number}
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-blue text-white shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Icon size={19} strokeWidth={2} />
                    </div>

                    {/* Bottom image label */}
                    <div className="absolute bottom-5 left-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
                      {card.eyebrow}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-7 max-[600px]:p-6">
                    {/* Accent line */}
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-[3px] w-12 bg-blue transition-all duration-500 group-hover:w-[80%]"
                    />

                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-blue">
                          {card.eyebrow}
                        </p>

                        <h3 className="text-[25px] font-extrabold leading-[1.1] tracking-[-0.035em] text-navy">
                          {card.title}
                        </h3>
                      </div>

                      <ArrowUpRight
                        aria-hidden="true"
                        size={20}
                        className="mt-1 shrink-0 text-navy/25 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue"
                      />
                    </div>

                    {/* API content */}
                    <ul className="space-y-5">
                      {card.section.items.map((item, index) => (
                        <li
                          key={`${card.number}-${item.title}`}
                          className="relative flex gap-4"
                        >
                          {/* Timeline */}
                          <div className="relative flex w-5 shrink-0 justify-center">
                            {index <
                              card.section.items.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="absolute left-1/2 top-[22px] h-[calc(100%+20px)] w-px -translate-x-1/2 bg-gradient-to-b from-blue/40 to-blue/10"
                              />
                            )}

                            <span className="relative z-10 grid size-5 place-items-center rounded-full bg-blue/10 text-blue ring-4 ring-white">
                              <Check
                                size={11}
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            </span>
                          </div>

                          <div className="min-w-0 flex-1 p-2 rounded-lg bg-blue/5">
                            <h4 className="text-[14px] font-extrabold leading-[1.45] text-navy">
                              {item.title}
                            </h4>

                            <p className="mt-1 text-[13px] leading-[1.7] text-ink/70">
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
