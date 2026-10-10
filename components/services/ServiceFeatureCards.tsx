"use client";

import {
  ArrowUpRight,
  Check,
  Layers3,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";

import type { IServiceContentSection } from "@/types/admin/service.type";

type ServiceFeatureCardsProps = {
  whyEnviroshield: IServiceContentSection;
  process: IServiceContentSection;
  benefits: IServiceContentSection;
};

type Card = {
  key: string;
  number: string;
  title: string;
  tab: string;
  countLabel: string;
  icon: typeof ShieldCheck;
  numbered?: boolean;
  dark?: boolean;
  section: IServiceContentSection;
};

export default function ServiceFeatureCards({
  whyEnviroshield,
  process,
  benefits,
}: ServiceFeatureCardsProps) {
  const cards: Card[] = [
    {
      key: "why",
      number: "01",
      title: "Why Enviro Shield",
      tab: "Our strengths",
      countLabel: "reasons",
      icon: ShieldCheck,
      section: whyEnviroshield,
    },
    {
      key: "process",
      number: "02",
      title: "Our Process",
      tab: "How we work",
      countLabel: "steps",
      icon: Workflow,
      section: process,
    },
    {
      key: "benefits",
      number: "03",
      title: "Key Benefits",
      tab: "What you get",
      countLabel: "benefits",
      icon: Layers3,
      section: benefits,
    },
  ].filter((card) => (card.section?.items?.length ?? 0) > 0);

  if (cards.length === 0) return null;

  return (
    <section
      aria-labelledby="service-features-heading"
      className="bg-soft py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      <Container>
        <Reveal dir="up">
          <div className="mb-14 max-w-[720px] max-[900px]:mb-10">
            <div className="mb-[18px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
              <span
                aria-hidden="true"
                className="h-[2px] w-7 bg-current"
              />
              THE ENVIROSHIELD DIFFERENCE
            </div>

            <h2
              id="service-features-heading"
              className="text-[clamp(34px,4.4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-navy"
            >
              More than a service.
              <br />A better finish.
            </h2>

            <p className="mt-6 max-w-[620px] text-base leading-[1.75] text-ink">
              From preparation to completion, every detail is handled
              with care, precision, and a focus on long-lasting
              results.
            </p>
          </div>
        </Reveal>

        <StaggerContainer className="grid grid-cols-3 items-stretch gap-6 max-[1000px]:grid-cols-1">
          {cards.map((card) => {
            const Icon = card.icon;
            const dark = card.dark;
            const count = card.section.items.length;

            return (
              <StaggerItem key={card.key} className="h-full">
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-[16px] border ${
                    dark
                      ? "border-navy bg-navy"
                      : "border-line bg-white"
                  }`}
                >
                  {/* Photo with a solid tab */}
                  <div className="relative aspect-[3/2] shrink-0 overflow-hidden bg-mist">
                    {card.section.image?.url && (
                      <Image
                        src={card.section.image.url}
                        alt={card.section.image.alt || card.title}
                        fill
                        sizes="(max-width: 1000px) 100vw, 33vw"
                        className="object-cover"
                      />
                    )}

                    <span className="absolute bottom-0 left-0 rounded-tr-[12px] bg-blue px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
                      {card.number} — {card.tab}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-7 max-[600px]:p-5">
                    {/* Header: icon + title + count */}
                    <div className="mb-6 flex items-center gap-4">
                      <span className="grid size-[52px] shrink-0 place-items-center rounded-[12px] bg-blue text-white">
                        <Icon size={24} aria-hidden="true" />
                      </span>

                      <div className="min-w-0">
                        <h3
                          className={`text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] ${
                            dark ? "text-white" : "text-navy"
                          }`}
                        >
                          {card.title}
                        </h3>
                        <p
                          className={`mt-1 text-[13px] ${
                            dark ? "text-white/60" : "text-ink/70"
                          }`}
                        >
                          {count} {card.countLabel}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <ul
                      className={`divide-y border-t ${
                        dark
                          ? "divide-white/15 border-white/15"
                          : "divide-line border-line"
                      }`}
                    >
                      {card.section.items.map((item, i) => (
                        <li
                          key={`${card.key}-${item.title}-${i}`}
                          className="flex gap-4 py-4"
                        >
                          <span
                            className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-bold ${
                              card.numbered
                                ? "bg-blue text-white"
                                : "bg-blue/10 text-blue"
                            }`}
                          >
                            {card.numbered ? (
                              i + 1
                            ) : (
                              <Check
                                size={15}
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            )}
                          </span>

                          <div className="min-w-0">
                            <h4
                              className={`text-[15px] font-bold leading-[1.4] ${
                                dark ? "text-white" : "text-navy"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <p
                              className={`mt-1 text-[14px] leading-[1.7] ${
                                dark ? "text-white/70" : "text-ink"
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer link */}
                  <Link
                    href="/contact"
                    className={`group flex items-center justify-between border-t px-7 py-4 text-[14px] font-bold transition-colors duration-200 max-[600px]:px-5 ${
                      dark
                        ? "border-white/15 text-white hover:bg-blue"
                        : "border-line text-navy hover:bg-blue hover:text-white"
                    }`}
                  >
                    Talk to an expert
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
