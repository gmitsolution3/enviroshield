import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import { ContactSection } from "@/components/home/ContactSection";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Contact Enviroshield | Start your transformation",
  description:
    "Get in touch with Enviroshield to discuss your painting or wall finishing project.",
};

const faqs = [
  {
    q: "Do you offer free quotes?",
    a: "Yes. Every project begins with a no-obligation conversation and a clear, itemised quote.",
  },
  {
    q: "How long does a typical project take?",
    a: "It depends on the scope, but most residential rooms take one to three days. We will always give you a realistic timeline up front.",
  },
  {
    q: "Do you work with businesses?",
    a: "We do — we regularly deliver commercial painting and wall finishing for offices, hospitality and retail spaces.",
  },
  {
    q: "What kind of paints do you use?",
    a: "We favour premium, low-odour, hard-wearing finishes, and we are happy to recommend the right product for your space.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT US"
        title="Let's create something beautiful together."
        text="Tell us a little about your space and what you have in mind. We will get back to you with clear next steps."
        image="https://images.pexels.com/photos/6474305/pexels-photo-6474305.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
      />

      <ContactSection full />

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container>
          <div className="mx-auto max-w-[820px]">
            <Reveal dir="up">
              <h2 className="mb-[10px] text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[-0.04em] text-navy">
                Frequently asked questions
              </h2>

              <p className="mb-9 text-ink">
                A few things we are often asked. If your question is
                not here, just send us a message.
              </p>
            </Reveal>

            <StaggerContainer className="grid gap-[14px]">
              {faqs.map((faq) => (
                <StaggerItem key={faq.q}>
                  <details className="rounded-[12px] border border-line bg-white px-[22px] py-[18px]">
                    <summary className="cursor-pointer list-none text-base font-bold text-navy">
                      {faq.q}
                    </summary>

                    <p className="mt-3 leading-[1.7] text-ink">
                      {faq.a}
                    </p>
                  </details>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </section>

      <section className="pb-[112px] max-[900px]:pb-20 max-[600px]:pb-16">
        <Container>
          <Reveal dir="scale">
            <div className="h-[360px] overflow-hidden rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <iframe
                title="Enviroshield Location - 45 Bridge Street, Brooklyn"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=45+Bridge+Street,+Brooklyn,+NY&t=&z=15&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
