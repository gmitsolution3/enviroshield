import { AnimatedCounter } from "@/components/animations/animated-counter";
import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { images } from "@/lib/data/content";
import {
  Award,
  CheckCircle2,
  Compass,
  HandHeart,
  Layers,
  Leaf,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "About Enviro Shield | Australian Expertise Since 2009",
  description:
    "Learn about Enviro Shield, an Australian brand in Bangladesh since 2009, delivering professional waterproofing, flooring, insulation, and protective construction solutions.",
};

/* -------------------------------------------------------------------------- */
/* SHARED PIECES                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const reasons = [
  {
    icon: ShieldCheck,
    title: "Protection That Performs",
    text: "Our solutions are designed to protect buildings from water, heat, surface deterioration, and other environmental challenges.",
  },
  {
    icon: Award,
    title: "Proven Expertise",
    text: "With years of experience in waterproofing and protective construction solutions, we understand the demands of real-world building conditions.",
  },
  {
    icon: Layers,
    title: "Complete Solutions",
    text: "From surface preparation to final protection, we provide systems designed to work together rather than isolated products.",
  },
  {
    icon: Users,
    title: "Client-Focused Service",
    text: "We work closely with our clients to understand their requirements and recommend practical solutions suited to each project.",
  },
];

const expertise = [
  {
    icon: ShieldCheck,
    title: "Waterproofing",
    text: "Professional waterproofing systems designed to protect roofs, structures, and surfaces from water intrusion and moisture damage.",
  },
  {
    icon: Layers,
    title: "Industrial & Epoxy Flooring",
    text: "Durable flooring solutions designed for environments where strength, hygiene, chemical resistance, and long-term performance matter.",
  },
  {
    icon: Sun,
    title: "Heat Insulation",
    text: "Protective solutions that help reduce heat transfer and improve comfort and building performance.",
  },
  {
    icon: Paintbrush,
    title: "Protective Construction Solutions",
    text: "Specialized systems designed to strengthen, protect, and extend the service life of building surfaces and structures.",
  },
];

const process = [
  {
    number: "01",
    title: "Understand",
    text: "We begin by understanding the property, its existing condition, and the specific challenges that need to be addressed.",
  },
  {
    number: "02",
    title: "Assess",
    text: "We evaluate the surface, environment, and project requirements to determine the most suitable approach.",
  },
  {
    number: "03",
    title: "Apply",
    text: "We use appropriate materials, systems, and application methods with careful attention to preparation and workmanship.",
  },
  {
    number: "04",
    title: "Protect",
    text: "The finished system is designed to provide dependable protection and help extend the service life of the property.",
  },
];

const sectors = [
  {
    title: "Residential",
    text: "Protecting homes, rooftops, terraces, balconies, and other residential spaces from water and environmental damage.",
  },
  {
    title: "Commercial",
    text: "Reliable building protection solutions for offices, retail spaces, hospitality properties, and commercial facilities.",
  },
  {
    title: "Industrial",
    text: "High-performance waterproofing, flooring, insulation, and protective systems for demanding industrial environments.",
  },
  {
    title: "Institutional",
    text: "Durable solutions for schools, healthcare facilities, public buildings, and other institutional properties.",
  },
];

const commitments = [
  "Quality-focused materials and systems",
  "Professional surface preparation",
  "Careful and consistent application",
  "Solutions selected for real project conditions",
  "Clear communication throughout the project",
  "Long-term protection as the ultimate goal",
];

const stats = [
  { value: 2009, label: "Established in Bangladesh", static: true },
  { value: 17, suffix: "+", label: "Years of experience" },
  { value: 500, suffix: "+", label: "Projects completed" },
  { value: 99, suffix: "%", label: "Customer satisfaction" },
];

const values = [
  {
    icon: Compass,
    title: "Technical Expertise",
    text: "We apply proven technical knowledge and practical experience to deliver solutions suited to each property's requirements.",
  },
  {
    icon: Leaf,
    title: "Quality Materials",
    text: "We believe lasting protection starts with dependable materials and systems designed for demanding conditions.",
  },
  {
    icon: HandHeart,
    title: "Customer Focus",
    text: "We listen carefully to our clients, understand their needs, and work toward solutions that deliver real value.",
  },
  {
    icon: Sparkles,
    title: "Quality Workmanship",
    text: "From preparation to final application, we maintain a strong focus on precision, consistency, and professional execution.",
  },
  {
    icon: Users,
    title: "Reliable Partnership",
    text: "We aim to be more than a contractor — we build lasting relationships through transparency, accountability, and dependable service.",
  },
  {
    icon: CheckCircle2,
    title: "Built to Last",
    text: "Our solutions are selected and applied with long-term durability, protection, and property performance in mind.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                               */}
      {/* ------------------------------------------------------------------ */}

      <PageHero
        eyebrow="ABOUT ENVIRO SHIELD"
        title="Australian expertise. Trusted protection since 2009."
        text="Enviro Shield is an Australian brand in Bangladesh delivering professional waterproofing and protective construction solutions designed to protect properties and extend their service life."
      />

      {/* ------------------------------------------------------------------ */}
      {/* OUR STORY                                                          */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="our-story-heading"
        className="pb-20 pt-[112px] max-[900px]:pt-20 max-[600px]:pt-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[80px] max-[900px]:grid-cols-1 max-[900px]:gap-[60px]">
          <Reveal dir="image">
            <div className="relative mb-10 pr-6 max-[600px]:pr-0">
              {/* main photo */}
              <div className="group relative h-[560px] overflow-hidden rounded-[24px] max-[600px]:h-[380px]">
                <Image
                  src="https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Professional construction worker applying protective material to a building surface"
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  className={imgClass}
                />
                <PhotoFx />
              </div>

              {/* secondary photo */}
              <div className="group absolute -bottom-10 right-0 h-[210px] w-[46%] overflow-hidden rounded-[20px] border-[8px] border-white bg-white shadow-[0_20px_40px_-12px_rgba(0,51,78,0.3)] max-[600px]:-bottom-8 max-[600px]:h-[140px] max-[600px]:right-3 max-[600px]:border-[6px]">
                <Image
                  src={images.painter}
                  alt="Painter carefully preparing an interior wall"
                  fill
                  sizes="(max-width: 900px) 45vw, 22vw"
                  className={imgClass}
                />
                <PhotoFx />
              </div>

              {/* floating badge */}
              <div className="absolute left-5 top-5 rounded-[18px] bg-blue px-5 py-4 text-white shadow-[0_18px_36px_-10px_rgba(1,110,220,0.7)] max-[600px]:left-3 max-[600px]:top-3 max-[600px]:px-4 max-[600px]:py-3">
                <div className="text-[40px] font-extrabold leading-none tracking-[-0.04em] max-[600px]:text-[30px]">
                  17+
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">
                  Years of expertise
                </div>
              </div>

              {/* dotted accent */}
              <span
                aria-hidden="true"
                className="absolute -left-6 bottom-12 -z-10 h-32 w-32 bg-[radial-gradient(circle,rgba(1,110,220,0.35)_1.5px,transparent_1.5px)] bg-[length:14px_14px] max-[600px]:hidden"
              />
            </div>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                <span
                  className="h-[2px] w-7 bg-current"
                  aria-hidden="true"
                />
                OUR STORY
              </div>

              <h2
                id="our-story-heading"
                className="mb-6 text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-navy"
              >
                Built on expertise. Driven by{" "}
                <span className="text-blue">protection.</span>
              </h2>

              <p className="mb-5 text-[17px] leading-[1.75] text-navy/80">
                Since 2009, Enviro Shield has brought Australian
                expertise to Bangladesh, providing professional
                waterproofing and protective construction solutions
                for properties across residential, commercial, and
                industrial applications.
              </p>

              <p className="mb-8 text-base leading-[1.75] text-ink">
                Our approach combines quality materials, proven
                technologies, technical expertise, and dependable
                workmanship to deliver solutions built for durability,
                performance, and long-term protection.
              </p>

              <StaggerContainer className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                {[
                  "Australian expertise since 2009",
                  "Professional waterproofing solutions",
                  "Quality materials and proven systems",
                  "Residential, commercial & industrial expertise",
                ].map((item) => (
                  <StaggerItem
                    key={item}
                    className="flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3.5 text-[13px] font-medium text-navy shadow-[0_6px_18px_-10px_rgba(0,51,78,0.18)]"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue/10">
                      <CheckCircle2
                        size={16}
                        aria-hidden="true"
                        className="text-blue"
                      />
                    </span>
                    {item}
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* COMPANY HIGHLIGHTS (stats band)                                    */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-label="Enviro Shield at a glance"
        className="pb-[112px] max-[900px]:pb-20 max-[600px]:pb-16"
      >
        <Container>
          <Reveal dir="up">
            <div className="relative overflow-hidden rounded-[28px] bg-navy px-12 py-14 max-[900px]:px-8 max-[900px]:py-10 max-[600px]:px-6">
              {/* glow + grid decoration */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-blue/30 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-paste/10 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:44px_44px]"
              />

              <div className="relative grid grid-cols-4 gap-y-10 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-l border-white/15 pl-7"
                  >
                    <div className="mb-3 text-[clamp(40px,4.4vw,64px)] font-extrabold leading-none tracking-[-0.05em] text-white">
                      {stat.static ? (
                        stat.value
                      ) : (
                        <AnimatedCounter
                          value={stat.value}
                          suffix={stat.suffix}
                        />
                      )}
                    </div>
                    <p className="text-[13px] font-medium uppercase tracking-[0.1em] text-paste">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHY ENVIRO SHIELD                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="why-enviroshield-heading"
        className="relative overflow-hidden bg-soft py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(0,51,78,0.09)_1px,transparent_1px)] bg-[length:26px_26px]"
        />

        <Container className="relative">
          <SectionHeader
            eyebrow="WHY ENVIRO SHIELD"
            title="More than protection. A complete approach to building performance."
            text="We combine technical expertise, quality materials, and professional application to deliver solutions that help properties stay protected, durable, and functional for years to come."
            headingId="why-enviroshield-heading"
          />

          <StaggerContainer className="mt-14 grid grid-cols-4 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;

              return (
                <StaggerItem key={reason.title}>
                  <div className="group relative h-full overflow-hidden rounded-[20px] border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue/30 hover:shadow-[0_24px_44px_-16px_rgba(1,110,220,0.35)]">
                    {/* top accent line grows on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-blue to-paste transition-transform duration-500 group-hover:scale-x-100"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-4 text-[44px] font-extrabold leading-none tracking-[-0.05em] text-navy/[0.06]"
                    >
                      0{index + 1}
                    </span>

                    <div className="mb-7 grid size-[56px] place-items-center rounded-2xl bg-blue/10 transition-colors duration-300 group-hover:bg-blue">
                      <Icon
                        size={26}
                        aria-hidden="true"
                        className="text-blue transition-colors duration-300 group-hover:text-white"
                      />
                    </div>

                    <h3 className="mb-[10px] text-[19px] font-semibold text-navy">
                      {reason.title}
                    </h3>

                    <p className="text-[13px] leading-[1.7] text-ink">
                      {reason.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OUR EXPERTISE                                                      */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="expertise-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="OUR EXPERTISE"
            title="Specialized solutions for demanding environments."
            text="Our expertise covers key areas of building protection, helping residential, commercial, and industrial properties perform better in challenging conditions."
            headingId="expertise-heading"
          />

          <StaggerContainer className="mt-14 grid grid-cols-2 gap-5 max-[700px]:grid-cols-1">
            {expertise.map((item, index) => {
              const Icon = item.icon;

              return (
                <StaggerItem key={item.title}>
                  <div className="group relative h-full overflow-hidden rounded-[24px] border border-line bg-white p-9 transition-all duration-500 hover:-translate-y-1.5 hover:border-navy hover:bg-navy hover:shadow-[0_28px_56px_-16px_rgba(0,51,78,0.5)] max-[600px]:p-6">
                    {/* glow that appears on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-blue/0 blur-3xl transition-colors duration-500 group-hover:bg-blue/40"
                    />

                    {/* big outlined number */}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-6 right-6 text-[120px] font-extrabold leading-none tracking-[-0.06em] text-navy/[0.05] transition-colors duration-500 group-hover:text-white/[0.07]"
                    >
                      0{index + 1}
                    </span>

                    <div className="relative mb-10 grid size-[60px] place-items-center rounded-full bg-blue/10 transition-colors duration-500 group-hover:bg-blue">
                      <Icon
                        size={26}
                        aria-hidden="true"
                        className="text-blue transition-colors duration-500 group-hover:text-white"
                      />
                    </div>

                    <h3 className="relative mb-3 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-navy transition-colors duration-500 group-hover:text-white">
                      {item.title}
                    </h3>

                    <p className="relative max-w-[480px] text-[14px] leading-[1.75] text-ink transition-colors duration-500 group-hover:text-white/70">
                      {item.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* HOW WE WORK                                                        */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="how-we-work-heading"
        className="relative overflow-hidden bg-navy py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-blue/25 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-0 size-80 rounded-full bg-paste/10 blur-3xl"
        />

        <Container className="relative">
          <SectionHeader
            eyebrow="HOW WE WORK"
            title="A straightforward approach from assessment to completion."
            text="Every project is approached with careful planning, proper preparation, and a clear focus on achieving reliable long-term results."
            light
            headingId="how-we-work-heading"
          />

          <div className="relative mt-16">
            {/* connecting line (desktop) */}
            <span
              aria-hidden="true"
              className="absolute left-[28px] right-[28px] top-[28px] h-px bg-gradient-to-r from-blue via-white/25 to-white/5 max-[900px]:hidden"
            />

            <StaggerContainer className="grid grid-cols-4 gap-x-6 gap-y-12 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
              {process.map((item) => (
                <StaggerItem key={item.number}>
                  <div className="group relative h-full">
                    <div className="relative z-[1] mb-7 grid size-[56px] place-items-center rounded-full bg-blue text-[15px] font-extrabold tracking-[0.04em] text-white shadow-[0_0_0_8px_rgba(0,51,78,1),0_0_0_9px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-110">
                      {item.number}
                    </div>

                    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors duration-300 group-hover:border-blue/60 group-hover:bg-white/[0.08]">
                      <h3 className="mb-3 text-[23px] font-medium text-white">
                        {item.title}
                      </h3>

                      <p className="text-[13px] leading-[1.75] text-white/60">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHO WE SERVE                                                       */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="sectors-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHO WE SERVE"
            title="Protection solutions across every type of property."
            text="From homes and commercial buildings to demanding industrial environments, we provide solutions adapted to different property requirements."
            headingId="sectors-heading"
          />

          <StaggerContainer className="mt-14 grid grid-cols-4 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
            {sectors.map((sector, index) => (
              <StaggerItem key={sector.title}>
                <div className="group relative h-full overflow-hidden rounded-[20px] bg-soft p-7 pb-9 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_44px_-16px_rgba(0,51,78,0.25)]">
                  <span className="mb-12 block text-[56px] font-extrabold leading-none tracking-[-0.05em] text-blue/20 transition-colors duration-300 group-hover:text-blue">
                    0{index + 1}
                  </span>

                  <h3 className="mb-3 text-[22px] font-semibold text-navy">
                    {sector.title}
                  </h3>

                  <p className="text-[13px] leading-[1.7] text-ink">
                    {sector.text}
                  </p>

                  {/* bottom bar grows on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue to-paste transition-transform duration-500 group-hover:scale-x-100"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OUR COMMITMENT                                                     */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="commitment-heading"
        className="bg-soft py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="up">
            <div>
              <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                <span
                  className="h-[2px] w-7 bg-current"
                  aria-hidden="true"
                />
                OUR COMMITMENT
              </div>

              <h2
                id="commitment-heading"
                className="mb-6 text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-navy"
              >
                Quality is not just the finished surface. It is{" "}
                <span className="text-blue">
                  everything behind it.
                </span>
              </h2>

              <p className="border-l-[3px] border-blue pl-5 text-base leading-[1.75] text-ink">
                We believe dependable results come from the right
                combination of materials, preparation, technical
                knowledge, and workmanship. That is why we focus on
                every stage of the process — from understanding the
                problem to delivering the final solution.
              </p>
            </div>
          </Reveal>

          <Reveal dir="image" delay={0.15}>
            <div className="relative overflow-hidden rounded-[24px] bg-navy p-9 shadow-[0_30px_60px_-20px_rgba(0,51,78,0.5)] max-[600px]:p-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-blue/35 blur-3xl"
              />

              <StaggerContainer className="relative grid grid-cols-1 gap-3">
                {commitments.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-center gap-4 rounded-[14px] border border-white/10 bg-white/[0.05] px-5 py-4 transition-colors duration-300 hover:border-blue/60 hover:bg-white/[0.09]">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue">
                        <CheckCircle2
                          size={17}
                          aria-hidden="true"
                          className="text-white"
                        />
                      </span>

                      <span className="text-[14px] font-medium leading-[1.5] text-white">
                        {item}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* OUR VALUES                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="values-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHAT WE VALUE"
            title="The principles behind every solution."
            text="The standards that guide how we work, what we deliver, and the relationships we build."
            align="center"
            headingId="values-heading"
          />

          <StaggerContainer className="mt-14 grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <StaggerItem key={value.title}>
                  <div className="group relative h-full overflow-hidden rounded-[20px] border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue/30 hover:shadow-[0_24px_44px_-16px_rgba(1,110,220,0.3)]">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-blue/[0.06] transition-transform duration-500 group-hover:scale-[2.2]"
                    />

                    <div className="relative mb-7 grid size-[56px] place-items-center rounded-2xl bg-gradient-to-br from-blue to-[#4da3ff] text-white shadow-[0_12px_24px_-8px_rgba(1,110,220,0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                      <Icon size={26} aria-hidden="true" />
                    </div>

                    <h3 className="relative mb-[10px] text-[20px] font-semibold text-navy">
                      {value.title}
                    </h3>

                    <p className="relative text-[13px] leading-[1.7] text-ink">
                      {value.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CONTACT CTA                                                        */}
      {/* ------------------------------------------------------------------ */}

      <ContactSection />
    </>
  );
}
