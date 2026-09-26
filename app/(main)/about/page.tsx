import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import { ContactSection } from "@/components/home/ContactSection";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";

import {
  CheckCircle2,
  Compass,
  HandHeart,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "About Enviroshield | Our story, mission and craft",
  description:
    "Meet Enviroshield — professional painters and wall finishing specialists dedicated to thoughtful craft and better spaces.",
};

const values = [
  {
    icon: Compass,
    title: "Considered, not rushed",
    text: "Every project begins with understanding your space, your taste, and the outcome you are hoping for.",
  },
  {
    icon: Leaf,
    title: "Mindful materials",
    text: "We favour low-odour, hard-wearing finishes that respect your space and the people in it.",
  },
  {
    icon: HandHeart,
    title: "Respect for your home",
    text: "We protect, tidy, and treat every surface — and every client — with care.",
  },
  {
    icon: Sparkles,
    title: "Precision finishes",
    text: "The detail is the difference. Edges are clean, surfaces are smooth, colour is true.",
  },
  {
    icon: Users,
    title: "A team you can trust",
    text: "Friendly, professional, and accountable — from first call to final walkthrough.",
  },
  {
    icon: CheckCircle2,
    title: "Clear communication",
    text: "You will always know what is happening, when, and what comes next.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT ENVIROSHIELD"
        title="A team that cares about the details others overlook."
        text="We are painters, finishers, and problem-solvers who believe a great wall transforms a room — and a great room changes how you feel at home."
      />

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
              <Image
                src="https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Craftsperson applying plaster to an interior wall"
                fill
                sizes="45vw"
              />
            </div>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <div className="mb-[22px] flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                <span className="h-[2px] w-7 bg-current" />
                OUR STORY
              </div>

              <h2 className="mb-[18px] text-[clamp(34px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-0.05em] text-navy">
                Craft, care, and a love for well-finished walls.
              </h2>

              <p className="mb-[26px] text-base leading-[1.7] text-ink">
                Enviroshield began with a simple idea: painting and
                wall finishing should feel as considered as the rest
                of your home. We are a small, dedicated team of
                specialists who care about preparation as much as the
                final coat.
              </p>

              <p className="mb-[26px] text-base leading-[1.7] text-ink">
                From a single feature wall to a full commercial
                refresh, we bring the same attention to detail — and
                the same respect for your time and space.
              </p>

              <StaggerContainer className="mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
                {[
                  "Specialist wall finishing",
                  "Premium, long-lasting materials",
                  "Clear quotes and timelines",
                  "Respectful, tidy teams",
                ].map((item) => (
                  <StaggerItem
                    key={item}
                    className="flex items-center gap-2 text-[13px] text-ink"
                  >
                    <CheckCircle2
                      size={16}
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

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container>
          <SectionHeader
            eyebrow="WHAT WE VALUE"
            title="The principles behind every project"
            text="Six things we never compromise on."
            align="center"
          />

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-5 max-[600px]:grid-cols-1">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <StaggerItem key={value.title}>
                  <div className="rounded-[15px] border border-line p-7">
                    <Icon size={26} className="mb-7 text-blue" />

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

      <ContactSection />
    </>
  );
}
