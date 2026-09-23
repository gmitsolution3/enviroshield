import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
      <Header />
      <main>
        <PageHero
          eyebrow="ABOUT ENVIROSHIELD"
          title="A team that cares about the details others overlook."
          text="We are painters, finishers, and problem-solvers who believe a great wall transforms a room — and a great room changes how you feel at home."
        />
        <section className="section">
          <div className="container detail-grid">
            <Reveal dir="image">
              <div className="detail-photo">
                <Image
                  src="https://images.pexels.com/photos/6473966/pexels-photo-6473966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Craftsperson applying plaster to an interior wall"
                  fill
                  sizes="45vw"
                />
              </div>
            </Reveal>
            <Reveal dir="up" delay={0.15}>
              <div className="detail-copy">
                <div className="eyebrow">
                  <span />
                  OUR STORY
                </div>
                <h2>
                  Craft, care, and a love for well-finished walls.
                </h2>
                <p>
                  Enviroshield began with a simple idea: painting and
                  wall finishing should feel as considered as the rest
                  of your home. We are a small, dedicated team of
                  specialists who care about preparation as much as
                  the final coat.
                </p>
                <p>
                  From a single feature wall to a full commercial
                  refresh, we bring the same attention to detail — and
                  the same respect for your time and space.
                </p>
                <StaggerContainer className="benefits">
                  {[
                    "Specialist wall finishing",
                    "Premium, long-lasting materials",
                    "Clear quotes and timelines",
                    "Respectful, tidy teams",
                  ].map((item) => (
                    <StaggerItem key={item} className="benefit">
                      <CheckCircle2 size={16} />
                      {item}
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </Reveal>
          </div>
        </section>
        <section className="section process-section">
          <div className="container">
            <SectionHeader
              eyebrow="WHAT WE VALUE"
              title="The principles behind every project"
              text="Six things we never compromise on."
              align="center"
            />
            <StaggerContainer className="values-grid">
              {values.map((value) => (
                <StaggerItem key={value.title}>
                  <div className="value-card">
                    <value.icon size={26} />
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
