import type { Metadata } from "next";

import AboutSection from "@/components/home/AboutSection";
import BlogSection from "@/components/home/BlogSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsSection from "@/components/home/ProductsSection";
import ProjectsSection from "@/components/home/ProjectsSection/ProjectsSection";
import ServicesSection from "@/components/home/ServiceSection/ServicesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import WorkProcessSection from "@/components/home/WorkProcessSection";

export const metadata: Metadata = {
  title:
    "Best Waterproofing, Flooring & Protective Coating Solutions In Bangladesh | Enviroshield",
  description:
    "Enviroshield provides waterproofing, waterproofing paint, heatproofing, epoxy and PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy floors, floor hardener, and ETP coating in Bangladesh.",
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <ServicesSection />
      <WorkProcessSection />
      <ProductsSection />
      <ProjectsSection />
      <TestimonialSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
