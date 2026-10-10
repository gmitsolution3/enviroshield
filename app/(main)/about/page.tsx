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
  Check,
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
    icon: Check,
    title: "Built to Last",
    text: "Our solutions are selected and applied with long-term durability, protection, and property performance in mind.",
  },
];

const CHAIRMAN = {
  name: "Chairman Name", // replace
  title: "Chairman, Enviro Shield", // replace
  image: "/images/chairman.jpg", // replace with the real photo
  alt: "Portrait of the Chairman of Enviro Shield",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ENVIRO SHIELD"
        title="Australian expertise. Trusted protection since 2009."
        text="Enviro Shield is an Australian brand in Bangladesh delivering professional waterproofing and protective construction solutions designed to protect properties and extend their service life."
        image="/images/service-hero.jpg"
      />

      {/* ------------------------------------------------------------------ */}
      {/* OUR STORY                                                          */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="our-story-heading"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[80px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
              <div className="relative h-[520px] overflow-hidden rounded-[16px] max-[600px]:h-[340px]">
                <Image
                  src="https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Professional construction worker applying protective material to a building surface"
                  fill
                  sizes="(max-width: 900px) 60vw, 28vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative flex-1 overflow-hidden rounded-[16px]">
                  <Image
                    src={images.painter}
                    alt="Painter carefully preparing an interior wall"
                    fill
                    sizes="(max-width: 900px) 40vw, 18vw"
                    className="object-cover"
                  />
                </div>

                <div className="rounded-[16px] bg-blue p-6 text-white max-[600px]:p-4">
                  <div className="text-[44px] font-extrabold leading-none tracking-[-0.04em] max-[600px]:text-[32px]">
                    17+
                  </div>
                  <div className="mt-2 text-[13px] text-white/85">
                    Years in Bangladesh
                  </div>
                </div>
              </div>
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
                className="mb-6 text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.04] tracking-[-0.05em] text-navy"
              >
                Built on expertise.
                <br />
                Driven by protection.
              </h2>

              <p className="mb-5 text-[18px] leading-[1.7] text-navy/85">
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

              <ul className="divide-y divide-line border-y border-line">
                {[
                  "Australian expertise since 2009",
                  "Professional waterproofing solutions",
                  "Quality materials and proven systems",
                  "Residential, commercial & industrial expertise",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3.5 text-[15px] font-medium text-navy"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-blue text-white">
                      <Check
                        size={15}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                    </span>

                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CHAIRMAN                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="chairman-heading"
        className="pb-[112px] max-[900px]:pb-20 max-[600px]:pb-16"
      >
        <Container>
          <Reveal dir="up">
            <div className="grid grid-cols-[0.85fr_1.15fr] overflow-hidden rounded-[20px] bg-navy max-[900px]:grid-cols-1">
              <div className="relative min-h-[520px] max-[900px]:aspect-[4/5] max-[900px]:min-h-0 max-[600px]:aspect-[1/1]">
                <Image
                  src={CHAIRMAN.image}
                  alt={CHAIRMAN.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>

              <div className="flex flex-col justify-center p-14 max-[900px]:p-8 max-[600px]:p-6">
                <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
                  <span
                    className="h-[2px] w-7 bg-current"
                    aria-hidden="true"
                  />
                  MESSAGE FROM THE CHAIRMAN
                </div>

                <h2
                  id="chairman-heading"
                  className="mb-6 text-[clamp(28px,3.4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white"
                >
                  Protection is a promise we build into every
                  property.
                </h2>

                {/* Replace with the Chairman's real message */}
                <div className="space-y-4 text-[16px] leading-[1.75] text-white/75">
                  <p>
                    Since 2009, our goal has been simple: to bring
                    dependable protection and honest workmanship to
                    every project we take on. Behind every finished
                    surface is careful preparation, quality materials,
                    and a team that takes pride in lasting results.
                  </p>
                  <p>
                    We will keep investing in our people, our
                    technology, and our relationships, so that every
                    client can trust Enviro Shield to protect what
                    matters most.
                  </p>
                </div>

                <div className="mt-8 border-t border-white/15 pt-6">
                  <strong className="block text-[18px] font-extrabold text-white">
                    {CHAIRMAN.name}
                  </strong>
                  <span className="text-[14px] text-white/60">
                    {CHAIRMAN.title}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-label="Enviro Shield at a glance"
        className="bg-blue text-white"
      >
        <Container>
          <div className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-l border-white/20 px-8 py-14 first:border-l-0 max-[900px]:border-b max-[900px]:[&:nth-child(odd)]:border-l-0 max-[600px]:border-l-0 max-[600px]:px-0 max-[600px]:py-8"
              >
                <div className="mb-2 text-[clamp(42px,4.6vw,64px)] font-extrabold leading-none tracking-[-0.05em]">
                  {stat.static ? (
                    stat.value
                  ) : (
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <p className="text-[14px] text-white/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHY ENVIRO SHIELD                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="why-enviroshield-heading"
        className="bg-soft py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="WHY ENVIRO SHIELD"
            title="More than protection. A complete approach to building performance."
            text="We combine technical expertise, quality materials, and professional application to deliver solutions that help properties stay protected, durable, and functional for years to come."
            headingId="why-enviroshield-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-4 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <StaggerItem key={reason.title}>
                  <div className="group h-full rounded-[14px] bg-white p-7 transition-colors duration-300 hover:bg-navy shadow shadow-lg">
                    <span className="mb-8 grid size-12 place-items-center rounded-[10px] bg-blue text-white">
                      <Icon size={24} aria-hidden="true" />
                    </span>

                    <h3 className="mb-[10px] text-[20px] font-semibold leading-[1.25] text-navy transition-colors duration-300 group-hover:text-white">
                      {reason.title}
                    </h3>

                    <p className="text-[14px] leading-[1.7] text-ink transition-colors duration-300 group-hover:text-white/70">
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

          <StaggerContainer className="mt-12 border-t border-navy">
            {expertise.map((item, index) => {
              const Icon = item.icon;

              return (
                <StaggerItem key={item.title}>
                  <div className="group grid grid-cols-[80px_1fr_1.1fr_auto] items-center gap-8 border-b border-line py-9 transition-colors duration-200 hover:bg-soft max-[900px]:grid-cols-[56px_1fr] max-[900px]:gap-x-5 max-[900px]:gap-y-3 max-[900px]:py-7">
                    <span className="text-[22px] font-extrabold tracking-[-0.02em] text-blue">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-[clamp(22px,2.4vw,30px)] font-semibold leading-[1.15] tracking-[-0.02em] text-navy">
                      {item.title}
                    </h3>

                    <p className="text-[15px] leading-[1.7] text-ink max-[900px]:col-start-2">
                      {item.text}
                    </p>

                    <span className="grid size-12 place-items-center rounded-full border border-line text-navy transition-colors duration-200 group-hover:border-blue group-hover:bg-blue group-hover:text-white max-[900px]:hidden">
                      <Icon size={22} aria-hidden="true" />
                    </span>
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
        className="bg-navy py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="HOW WE WORK"
            title="A straightforward approach from assessment to completion."
            text="Every project is approached with careful planning, proper preparation, and a clear focus on achieving reliable long-term results."
            light
            headingId="how-we-work-heading"
          />

          <StaggerContainer className="mt-14 grid grid-cols-4 gap-8 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {process.map((item) => (
              <StaggerItem key={item.number}>
                <div className="h-full border-t-2 border-blue pt-6">
                  <span className="mb-10 block text-[64px] font-extrabold leading-none tracking-[-0.05em] text-white">
                    {item.number}
                  </span>

                  <h3 className="mb-3 text-[22px] font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="text-[14px] leading-[1.7] text-white/65">
                    {item.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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

          <StaggerContainer className="mt-12 grid grid-cols-4 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
            {sectors.map((sector, index) => (
              <StaggerItem key={sector.title}>
                <div className="group flex h-full min-h-[300px] flex-col justify-between rounded-[14px] bg-soft p-7 transition-colors duration-300 hover:bg-blue shadow shadow-lg">
                  <span className="text-lg font-bold tracking-[0.12em] bg-blue text-muted transition-colors duration-300 group-hover:text-blue group-hover:bg-white group-hover:border-white border rounded-full w-[50px] h-[50px] grid place-items-center border-blue">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="mb-3 text-[26px] font-semibold tracking-[-0.02em] text-navy transition-colors duration-300 group-hover:text-white">
                      {sector.title}
                    </h3>

                    <p className="text-[14px] leading-[1.7] text-ink transition-colors duration-300 group-hover:text-white/85">
                      {sector.text}
                    </p>
                  </div>
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
                Quality is not just the finished surface. It is
                everything behind it.
              </h2>

              <p className="text-base leading-[1.75] text-ink">
                We believe dependable results come from the right
                combination of materials, preparation, technical
                knowledge, and workmanship. That is why we focus on
                every stage of the process — from understanding the
                problem to delivering the final solution.
              </p>
            </div>
          </Reveal>

          <Reveal dir="image" delay={0.15}>
            <ul className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
              {commitments.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-[12px] bg-white p-1"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-blue text-white">
                    <Check size={14} aria-hidden="true" />
                  </span>
                  <span className="text-[15px] font-medium leading-[1.5] text-navy">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
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
            align="left"
            headingId="values-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <StaggerItem key={value.title}>
                  <div className="h-full rounded-[14px] border border-line p-8 transition-colors duration-200 hover:border-blue">
                    <span className="mb-6 grid size-12 place-items-center rounded-[10px] bg-blue/10 text-blue">
                      <Icon size={24} aria-hidden="true" />
                    </span>

                    <h3 className="mb-[10px] text-[20px] font-semibold text-navy">
                      {value.title}
                    </h3>

                    <p className="text-[14px] leading-[1.7] text-ink">
                      {value.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}
