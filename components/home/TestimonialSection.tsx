import { getPublishedTestimonials } from "@/lib/api/testimonials";
import { ITestimonial } from "@/types";
import { MessageSquareQuote } from "lucide-react";
import Container from "../Container";
import DottedBackground from "../DottedBackground";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";
import { TestimonialCarousel } from "../TestimonialCarousel";

export default async function TestimonialSection() {
  let testimonials: ITestimonial[] = [];

  try {
    const result = await getPublishedTestimonials({
      page: 1,
      limit: 10,
    });

    testimonials = result.data;
  } catch {
    testimonials = [];
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-mist py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      <DottedBackground />
      <Container className="grid grid-cols-2 items-center gap-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[30px]">
        <SectionHeader
          eyebrow="CLIENT TESTIMONIALS"
          title="Trusted by clients. Proven through results."
          text="Hear from the people and businesses who have trusted Enviro Shield to protect their properties with reliable, professional waterproofing and construction solutions."
          headingId="testimonials-heading"
        />

        {testimonials.length > 0 ? (
          <Reveal dir="up" delay={0.1}>
            <TestimonialCarousel testimonials={testimonials} />
          </Reveal>
        ) : (
          <Reveal dir="up" delay={0.1}>
            <div className="relative overflow-hidden rounded-[24px] border border-white/80 bg-gradient-to-br from-white/85 via-white/60 to-white/35 p-10 text-center ring-1 ring-navy/[0.07] backdrop-blur-2xl shadow-[0_24px_56px_-14px_rgba(0,51,78,0.18),_inset_0_1px_2px_0_rgba(255,255,255,1)] sm:p-12">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue/10 text-blue shadow-inner">
                <MessageSquareQuote className="size-7" />
              </div>

              <h3 className="text-[20px] font-bold tracking-tight text-navy sm:text-[22px]">
                No testimonials available at this time
              </h3>

              <p className="mx-auto mt-2.5 max-w-[420px] text-[14px] leading-[1.65] text-ink/75">
                We&apos;re currently compiling fresh reviews and client stories from our recent waterproofing and coating projects. Please check back soon!
              </p>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
