import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="OUR SERVICES"
          title="Painting and wall finishing, done with care."
          text="Whether it is one room or a whole building, we deliver finishes that feel considered, durable, and beautifully made."
          image="https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
        />
        <section className="section">
          <div className="container">
            <SectionHeader
              eyebrow="WHAT WE DO"
              title="A full range of wall finishing services"
              text="Explore our services below, then reach out to talk through your space."
            />
            <StaggerContainer className="service-grid">
              {services.map((service, i) => (
                <StaggerItem key={service.id}>
                  <ServiceCard service={service} index={0} />
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
