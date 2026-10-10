"use client";

import { Check, Layers3, ShieldCheck, Workflow } from "lucide-react";
import Image from "next/image";

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

const imgClass =
  "object-cover transition-transform duration-[0.9s] ease-out group-hover:scale-[1.06]";

function PhotoFx() {
  return (
    <>
      <span
        className="pointer-events-none absolute inset-0 bg-navy/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[1100ms] ease-out group-hover:translate-x-[500%]"
        aria-hidden="true"
      />
    </>
  );
}

function Eyebrow({
  children,
  className = "text-blue",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-[18px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] ${className}`}
    >
      <span aria-hidden="true" className="h-[2px] w-7 bg-current" />
      {children}
    </div>
  );
}

function BlockImage({
  section,
  fallbackAlt,
  number,
  label,
  icon: Icon,
  className = "",
}: {
  section: IServiceContentSection;
  fallbackAlt: string;
  number: string;
  label: string;
  icon: typeof ShieldCheck;
  className?: string;
}) {
  if (!section?.image?.url) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="group relative h-[560px] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-24px_rgba(0,51,78,0.45)] max-[900px]:h-[400px] max-[600px]:h-[320px]">
        <Image
          src={section.image.url}
          alt={section.image.alt || fallbackAlt}
          fill
          sizes="(max-width: 900px) 100vw, 45vw"
          className={imgClass}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent"
        />
        <PhotoFx />

        <span className="absolute left-5 top-5 grid size-14 place-items-center rounded-full bg-white text-[15px] font-extrabold tracking-[0.04em] text-navy shadow-lg">
          {number}
        </span>

        <span className="absolute inset-x-5 bottom-5 flex items-center gap-3 rounded-[16px] bg-navy/50 px-4 py-3 ring-1 ring-white/20 backdrop-blur-xl">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue text-white">
            <Icon size={17} aria-hidden="true" />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-white">
            {label}
          </span>
        </span>
      </div>

      {section.image.caption && (
        <p className="mt-3 px-2 text-[12px] leading-[1.6] text-ink/60">
          {section.image.caption}
        </p>
      )}
    </div>
  );
}

export default function ServiceFeatureCards({
  whyEnviroshield,
  process,
  benefits,
}: ServiceFeatureCardsProps) {
  const whyItems = whyEnviroshield?.items ?? [];
  const processItems = process?.items ?? [];
  const benefitItems = benefits?.items ?? [];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 01 WHY ENVIROSHIELD                                                */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="service-features-heading"
        className="relative overflow-hidden bg-mist py-[120px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-44 top-28 size-[420px] rounded-full bg-blue/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(0,51,78,0.07)_1px,transparent_1px)] bg-[length:26px_26px]"
        />

        <Container className="relative">
          {/* Intro */}
          <Reveal dir="up">
            <div className="mb-16 max-w-[720px] max-[900px]:mb-12">
              <Eyebrow>THE ENVIROSHIELD DIFFERENCE</Eyebrow>

              <h2
                id="service-features-heading"
                className="text-[clamp(36px,5vw,62px)] font-extrabold leading-[0.98] tracking-[-0.055em] text-navy"
              >
                More than a service.
                <br />
                <span className="text-blue">A better finish.</span>
              </h2>

              <p className="mt-6 max-w-[650px] text-[16px] leading-[1.75] text-ink/75">
                From preparation to completion, every detail is
                handled with care, precision, and a focus on
                long-lasting results.
              </p>
            </div>
          </Reveal>

          {whyItems.length > 0 && (
            <div className="grid grid-cols-[0.9fr_1.1fr] items-start gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-12">
              <Reveal dir="image">
                <BlockImage
                  section={whyEnviroshield}
                  fallbackAlt="Why choose Enviroshield"
                  number="01"
                  label="Why Enviroshield"
                  icon={ShieldCheck}
                  className="sticky top-28 max-[900px]:static"
                />
              </Reveal>

              <div>
                <Eyebrow>01 — WHY ENVIROSHIELD</Eyebrow>
                <h3 className="mb-8 text-[clamp(28px,3.2vw,40px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-navy">
                  Built around quality
                </h3>

                <StaggerContainer className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                  {whyItems.map((item, i) => (
                    <StaggerItem key={`${item.title}-${i}`}>
                      <div className="group relative h-full overflow-hidden rounded-[20px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue/30 hover:shadow-[0_24px_44px_-16px_rgba(1,110,220,0.35)]">
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-blue to-paste transition-transform duration-500 group-hover:scale-x-100"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute right-4 top-3 text-[40px] font-extrabold leading-none tracking-[-0.05em] text-navy/[0.06]"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-blue/10 text-blue transition-colors duration-300 group-hover:bg-blue group-hover:text-white">
                          <Check
                            size={20}
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        </span>

                        <h4 className="mb-2 text-[16px] font-extrabold leading-[1.3] text-navy">
                          {item.title}
                        </h4>
                        <p className="text-[13px] leading-[1.7] text-ink">
                          {item.description}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 02 PROCESS                                                         */}
      {/* ------------------------------------------------------------------ */}

      {processItems.length > 0 && (
        <section
          aria-labelledby="service-process-heading"
          className="relative overflow-hidden bg-navy py-[120px] max-[900px]:py-20 max-[600px]:py-16"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-blue/25 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-0 size-80 rounded-full bg-paste/10 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:44px_44px]"
          />

          <Container className="relative grid grid-cols-[1.1fr_0.9fr] items-start gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-12">
            <div className="max-[900px]:order-2">
              <Eyebrow className="text-paste">
                02 — OUR PROCESS
              </Eyebrow>
              <h3
                id="service-process-heading"
                className="mb-10 text-[clamp(28px,3.2vw,40px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-white"
              >
                A process you can{" "}
                <span className="text-paste">trust</span>
              </h3>

              <StaggerContainer className="relative">
                {processItems.map((item, i) => (
                  <StaggerItem key={`${item.title}-${i}`}>
                    <div className="group relative flex gap-5 pb-6 last:pb-0">
                      {/* line to next step */}
                      {i < processItems.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[23px] top-[52px] h-[calc(100%-40px)] w-px bg-gradient-to-b from-blue to-white/10"
                        />
                      )}

                      <span className="relative z-[1] grid size-12 shrink-0 place-items-center rounded-full bg-blue text-[14px] font-extrabold tracking-[0.04em] text-white shadow-[0_0_0_6px_rgba(0,51,78,1),0_0_0_7px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-110">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1 rounded-[18px] border border-white/10 bg-white/[0.05] p-5 transition-colors duration-300 group-hover:border-blue/60 group-hover:bg-white/[0.09]">
                        <h4 className="mb-1.5 text-[17px] font-semibold text-white">
                          {item.title}
                        </h4>
                        <p className="text-[13px] leading-[1.75] text-white/65">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <Reveal dir="image" delay={0.15}>
              <BlockImage
                section={process}
                fallbackAlt="Our application process"
                number="02"
                label="Our process"
                icon={Workflow}
                className="sticky top-28 max-[900px]:static"
              />
            </Reveal>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 03 BENEFITS                                                        */}
      {/* ------------------------------------------------------------------ */}

      {benefitItems.length > 0 && (
        <section
          aria-labelledby="service-benefits-heading"
          className="py-[120px] max-[900px]:py-20 max-[600px]:py-16"
        >
          <Container className="grid grid-cols-[0.9fr_1.1fr] items-start gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-12">
            <Reveal dir="image">
              <BlockImage
                section={benefits}
                fallbackAlt="Key benefits"
                number="03"
                label="Key benefits"
                icon={Layers3}
                className="sticky top-28 max-[900px]:static"
              />
            </Reveal>

            <div>
              <Eyebrow>03 — KEY BENEFITS</Eyebrow>
              <h3
                id="service-benefits-heading"
                className="mb-8 text-[clamp(28px,3.2vw,40px)] font-extrabold leading-[1.08] tracking-[-0.04em] text-navy"
              >
                Made to <span className="text-blue">perform</span>
              </h3>

              <StaggerContainer className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                {benefitItems.map((item, i) => (
                  <StaggerItem key={`${item.title}-${i}`}>
                    <div className="group relative h-full overflow-hidden rounded-[20px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue/30 hover:shadow-[0_24px_44px_-16px_rgba(1,110,220,0.3)]">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-blue/[0.06] transition-transform duration-500 group-hover:scale-[2.2]"
                      />

                      <span className="relative mb-5 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue to-[#4da3ff] text-white shadow-[0_12px_24px_-8px_rgba(1,110,220,0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                        <Check
                          size={22}
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                      </span>

                      <h4 className="relative mb-2 text-[16px] font-extrabold leading-[1.3] text-navy">
                        {item.title}
                      </h4>
                      <p className="relative text-[13px] leading-[1.7] text-ink">
                        {item.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
