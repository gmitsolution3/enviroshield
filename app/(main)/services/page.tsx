import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import { ContactSection } from "@/components/home/ContactSection";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { services } from "@/lib/data/content";

export const metadata = {
  title: "Our Services | Enviroshield painting & wall finishing",
  description:
    "Interior and exterior painting, wallpaper installation, decorative finishes, and surface preparation — delivered by Enviroshield.",
};

export default async function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="OUR SERVICES"
        title="Painting and wall finishing, done with care."
        text="Whether it is one room or a whole building, we deliver finishes that feel considered, durable, and beautifully made."
        image="https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
      />

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container>
          <SectionHeader
            eyebrow="WHAT WE DO"
            title="A full range of wall finishing services"
            text="Explore our services below, then reach out to talk through your space."
          />

          <StaggerContainer className="mt-12 grid grid-cols-3 gap-[22px] max-[900px]:grid-cols-2 max-[600px]:flex max-[600px]:overflow-auto max-[600px]:snap-x max-[600px]:snap-mandatory max-[600px]:mr-[-16px] max-[600px]:pr-4 max-[600px]:pb-2">
            {services.map((service) => (
              <StaggerItem
                key={service.id}
                className="max-[600px]:min-w-[280px] max-[600px]:snap-start"
              >
                <ServiceCard service={service} index={0} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <ContactSection />
    </>
  );
}
