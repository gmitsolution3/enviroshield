import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";
import { TestimonialCarousel } from "../TestimonialCarousel";

export default function TestimonialSection() {
  return (
    <section className="section testimonial-section">
      <div className="container testimonial-layout">
        <SectionHeader
          eyebrow="TESTIMONIALS"
          title="What our clients are saying"
          text="Real experiences from homeowners and businesses we have helped transform."
        />
        <Reveal dir="up" delay={0.1}>
          <TestimonialCarousel />
        </Reveal>
      </div>
    </section>
  );
}
