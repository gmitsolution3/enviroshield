import AboutSection from "@/components/home/AboutSection";
import BlogSection from "@/components/home/BlogSection";
import { ContactSection } from "@/components/home/ContactSection";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsSection from "@/components/home/ProductsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import WorkProcessSection from "@/components/home/WorkProcessSection";

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
