import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import AboutSection from "@/components/home/AboutSection";
import BlogSection from "@/components/home/BlogSection";
import { ContactSection } from "@/components/home/ContactSection";
import HeroSlider from "@/components/home/HeroSlider";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import WorkProcessSection from "@/components/home/WorkProcessSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <AboutSection />
        <ServicesSection />
        <WorkProcessSection />
        <ProjectsSection />
        <TestimonialSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
