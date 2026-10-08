import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
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
/* WHY ENVIRO SHIELD                                                          */
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

/* -------------------------------------------------------------------------- */
/* OUR EXPERTISE                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* HOW WE WORK                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* WHO WE SERVE                                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* OUR COMMITMENT                                                             */
/* -------------------------------------------------------------------------- */

const commitments = [
  "Quality-focused materials and systems",
  "Professional surface preparation",
  "Careful and consistent application",
  "Solutions selected for real project conditions",
  "Clear communication throughout the project",
  "Long-term protection as the ultimate goal",
];

/* -------------------------------------------------------------------------- */
/* COMPANY HIGHLIGHTS                                                         */
/* -------------------------------------------------------------------------- */

const stats = [
  {
    value: "2009",
    label: "Established in Bangladesh",
  },
  {
    value: "17+",
    label: "Years of experience",
  },
  {
    value: "500+",
    label: "Projects completed",
  },
  {
    value: "99%",
    label: "Customer satisfaction",
  },
];

/* -------------------------------------------------------------------------- */
/* VALUES                                                                     */
/* -------------------------------------------------------------------------- */

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
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
              <Image
                src="https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Professional construction worker applying protective material to a building surface"
                fill
                sizes="45vw"
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
                className="mb-[18px] text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-navy"
              >
                Built on expertise. Driven by protection.
              </h2>

              <p className="mb-[26px] text-base leading-[1.7] text-ink">
                Since 2009, Enviro Shield has brought Australian expertise to
                Bangladesh, providing professional waterproofing and protective
                construction solutions for properties across residential,
                commercial, and industrial applications.
              </p>

              <p className="mb-[26px] text-base leading-[1.7] text-ink">
                Our approach combines quality materials, proven technologies,
                technical expertise, and dependable workmanship to deliver
                solutions built for durability, performance, and long-term
                protection.
              </p>

              <StaggerContainer className="mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
                {[
                  "Australian expertise since 2009",
                  "Professional waterproofing solutions",
                  "Quality materials and proven systems",
                  "Residential, commercial & industrial expertise",
                ].map((item) => (
                  <StaggerItem
                    key={item}
                    className="flex items-center gap-2 text-[13px] text-ink"
                  >
                    <CheckCircle2
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-blue"
                    />
                    {item}
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </Reveal>
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
                  <div className="h-full rounded-[15px] border border-line bg-white p-7">
                    <Icon
                      size={27}
                      aria-hidden="true"
                      className="mb-7 text-blue"
                    />

                    <h3 className="mb-[10px] text-[19px] text-navy">
                      {reason.title}
                    </h3>

                    <p className="text-[13px] leading-[1.65] text-ink">
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

          <StaggerContainer className="mt-12 grid grid-cols-2 gap-5 max-[700px]:grid-cols-1">
            {expertise.map((item, index) => {
              const Icon = item.icon;

              return (
                <StaggerItem key={item.title}>
                  <div className="group relative h-full overflow-hidden rounded-[18px] border border-line p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue/30 max-[600px]:p-6">
                    <div className="mb-8 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue/10">
                        <Icon
                          size={24}
                          aria-hidden="true"
                          className="text-blue"
                        />
                      </div>

                      <span className="text-[12px] font-bold tracking-[0.1em] text-ink/35">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mb-3 text-[24px] font-medium text-navy">
                      {item.title}
                    </h3>

                    <p className="max-w-[540px] text-[14px] leading-[1.7] text-ink">
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

          <StaggerContainer className="mt-12 grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {process.map((item) => (
              <StaggerItem key={item.number}>
                <div className="group h-full border-t border-white/15 pt-7">
                  <span className="mb-8 block text-[13px] font-bold tracking-[0.12em] text-blue">
                    {item.number}
                  </span>

                  <h3 className="mb-3 text-[23px] font-medium text-white">
                    {item.title}
                  </h3>

                  <p className="text-[13px] leading-[1.7] text-white/60">
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
                <div className="h-full rounded-[15px] bg-soft p-7">
                  <span className="mb-8 block text-[12px] font-bold tracking-[0.12em] text-blue">
                    0{index + 1}
                  </span>

                  <h3 className="mb-3 text-[21px] text-navy">
                    {sector.title}
                  </h3>

                  <p className="text-[13px] leading-[1.65] text-ink">
                    {sector.text}
                  </p>
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
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
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
                className="mb-[18px] text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-navy"
              >
                Quality is not just the finished surface. It is everything
                behind it.
              </h2>

              <p className="text-base leading-[1.7] text-ink">
                We believe dependable results come from the right combination
                of materials, preparation, technical knowledge, and
                workmanship. That is why we focus on every stage of the process
                — from understanding the problem to delivering the final
                solution.
              </p>
            </div>
          </Reveal>

          <Reveal dir="image" delay={0.15}>
            <div className="rounded-[18px] bg-soft p-8 max-[600px]:p-6">
              <StaggerContainer className="grid grid-cols-2 gap-x-7 gap-y-6 max-[600px]:grid-cols-1">
                {commitments.map((item) => (
                  <StaggerItem key={item}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-blue"
                      />

                      <span className="text-[13px] leading-[1.6] text-ink">
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
      {/* COMPANY HIGHLIGHTS                                                 */}
      {/* ------------------------------------------------------------------ */}

      <section
        aria-labelledby="highlights-heading"
        className="bg-soft py-[100px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <SectionHeader
            eyebrow="ENVIRO SHIELD AT A GLANCE"
            title="Experience you can build on."
            text="Our journey is built around practical expertise, trusted solutions, and a commitment to delivering lasting value to our clients."
            headingId="highlights-heading"
          />

          <StaggerContainer className="mt-12 grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="rounded-[15px] border border-line bg-white p-7">
                  <div className="mb-3 text-[clamp(38px,4vw,58px)] font-extrabold leading-none tracking-[-0.05em] text-navy">
                    {stat.value}
                  </div>

                  <p className="text-[13px] leading-[1.5] text-ink">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <StaggerItem key={value.title}>
                  <div className="h-full rounded-[15px] border border-line p-7">
                    <Icon
                      size={26}
                      aria-hidden="true"
                      className="mb-7 text-blue"
                    />

                    <h3 className="mb-[9px] text-[19px] text-navy">
                      {value.title}
                    </h3>

                    <p className="text-[13px] leading-[1.6] text-ink">
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