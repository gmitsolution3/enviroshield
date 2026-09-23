import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { ContactSection } from "@/components/home/ContactSection";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { services } from "@/lib/data/content";

export const metadata = {
  title: "Service details | Enviroshield",
  description: "Learn more about this Enviroshield service.",
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();
  const benefits = [
    "Careful surface preparation",
    "Premium, low-odour materials",
    "Clean, respectful team",
    "Clear timeline and quote",
  ];
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={service.category}
          title={service.title}
          text={service.description}
          image={service.image}
        />
        <section className="section">
          <div className="container detail-grid">
            <Reveal dir="image">
              <div className="detail-photo">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="45vw"
                />
              </div>
            </Reveal>
            <Reveal dir="up" delay={0.15}>
              <div className="detail-copy">
                <SectionHeader
                  eyebrow="OVERVIEW"
                  title={service.title}
                  text={service.description}
                />
                <StaggerContainer className="benefits">
                  {benefits.map((b) => (
                    <StaggerItem key={b} className="benefit">
                      <CheckCircle2 size={16} />
                      {b}
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <div style={{ marginTop: 26 }}>
                  <Button href="/contact">Talk to an expert</Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
