import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";
import { TestimonialCarousel } from "../TestimonialCarousel";

export default function TestimonialSection() {
  return (
    <section className="bg-mist py-[112px] max-[900px]:py-20 max-[600px]:py-16">
      <Container className="grid grid-cols-2 items-center gap-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[30px]">
        <SectionHeader
          eyebrow="TESTIMONIALS"
          title="What our clients are saying"
          text="Real experiences from homeowners and businesses we have helped transform."
        />

        <Reveal dir="up" delay={0.1}>
          <TestimonialCarousel />
        </Reveal>
      </Container>
    </section>
  );
}
