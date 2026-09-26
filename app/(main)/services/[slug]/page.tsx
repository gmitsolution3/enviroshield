import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
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

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = services.find((s) => s.slug === slug);

  if (!service) notFound();

  const benefits = [
    "Careful surface preparation",
    "Premium, low-odour materials",
    "Clean, respectful team",
    "Clear timeline and quote",
  ];

  return (
    <>
      <PageHero
        eyebrow={service.category}
        title={service.title}
        text={service.description}
        image={service.image}
      />

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="45vw"
              />
            </div>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div>
              <SectionHeader
                eyebrow="OVERVIEW"
                title={service.title}
                text={service.description}
              />

              <StaggerContainer className="mt-[26px] mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
                {benefits.map((benefit) => (
                  <StaggerItem
                    key={benefit}
                    className="flex items-center gap-2 text-[13px] text-ink"
                  >
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-blue"
                    />
                    {benefit}
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <Button href="/contact">Talk to an expert</Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}
