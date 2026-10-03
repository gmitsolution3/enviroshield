import type { Metadata } from "next";

import AboutSection from "@/components/home/AboutSection";
import BlogSection from "@/components/home/BlogSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsSection from "@/components/home/ProductsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import WorkProcessSection from "@/components/home/WorkProcessSection";

export const metadata: Metadata = {
  title:
    "Waterproofing, Flooring & Protective Coating Solutions | Enviroshield",
  description:
    "Enviroshield provides professional waterproofing, flooring, heat insulation, injection grouting, polished concrete, and protective coating solutions for residential, commercial, and industrial spaces.",
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
