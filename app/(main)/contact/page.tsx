import { ArrowUpRight, MapPin, Plus } from "lucide-react";

import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import ContactSection from "@/components/home/ContactSection";
import PageHero from "@/components/PageHero";

export const metadata = {
  title:
    "Contact Enviro Shield | Waterproofing & Flooring Bangladesh",
  description:
    "Contact Enviro Shield in Bangladesh for waterproofing, waterproofing paint, heatproofing, epoxy flooring, PU flooring, injection grouting, expansion joint sealing, sports flooring, polished concrete, 3D epoxy flooring, floor hardener, and ETP coating. Request a consultation for your project.",
  keywords: [
    "contact Enviro Shield",
    "waterproofing services Bangladesh",
    "waterproofing paint",
    "heatproofing services",
    "epoxy flooring Bangladesh",
    "PU flooring Bangladesh",
    "injection grouting services",
    "expansion joint sealing",
    "sports flooring",
    "polished concrete",
    "3D epoxy flooring",
    "floor hardener",
    "ETP coating",
    "construction consultation Bangladesh",
  ],
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

// TODO: replace with your real office details.
   const office = {
     name: "Enviroshield Office",
     address: "House No: 22/13-15, Block-B, Bauniabad R/A, Mirpur 11, Pallabi, Dhaka 1216",
     coords: "23.82078688876327, 90.37967728427371", // replace with your real lat,lng
     hours: "Sat – Thu · 9:00 AM – 6:00 PM",
   };

const mapQuery = encodeURIComponent(office.address);
const mapEmbedSrc = `https://maps.google.com/maps?q=${office.coords}&z=17&output=embed`;
const mapDirectionsHref = `https://www.google.com/maps/dir/?api=1&destination=${office.coords}`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT US"
        title="Let's create something beautiful together."
        text="Tell us a little about your space and what you have in mind. We will get back to you with clear next steps."
        image="/images/service-hero.jpg"
      />

      <ContactSection full />

      {/* FAQ */}
      <section
        aria-labelledby="faq-heading"
        className="bg-mist/50 py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <div className="mx-auto max-w-[820px]">
            <Reveal dir="up">
              <div className="mb-9 text-center">
                <span className="mb-4 inline-flex items-center rounded-full border border-blue/20 bg-blue/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue">
                  FAQ
                </span>

                <h2
                  id="faq-heading"
                  className="mb-3 text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[-0.04em] text-navy"
                >
                  Frequently asked questions
                </h2>

                <p className="mx-auto max-w-[520px] text-ink">
                  A few things we are often asked. If your question is
                  not here, just send us a message.
                </p>
              </div>
            </Reveal>

            <StaggerContainer className="grid gap-3">
              {faqs.map((faq, index) => (
                <StaggerItem key={faq.q}>
                  <details
                    name="faq"
                    className="group relative overflow-hidden rounded-[14px] border border-line bg-white transition-all duration-300 hover:border-blue/40 open:border-blue/40 open:shadow-[0_10px_30px_-14px_rgba(1,110,220,0.35)]"
                  >
                    {/* active accent bar */}
                    <span className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-blue to-deep transition-transform duration-300 group-open:scale-y-100" />

                    <summary className="flex cursor-pointer list-none items-center gap-4 px-[22px] py-[18px] outline-none focus-visible:ring-2 focus-visible:ring-blue/40 [&::-webkit-details-marker]:hidden">
                      <span className="text-sm font-bold tabular-nums text-blue/50 transition-colors group-open:text-blue">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="flex-1 text-base font-bold text-navy">
                        {faq.q}
                      </span>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-mist text-navy transition-all duration-300 group-hover:border-blue/40 group-open:rotate-[135deg] group-open:border-blue group-open:bg-blue group-open:text-white">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>

                    <div className="animate-in fade-in slide-in-from-top-1 px-[22px] pb-5 pl-[62px] duration-300 max-[600px]:pl-[22px]">
                      <p className="leading-[1.7] text-ink">{faq.a}</p>
                    </div>
                  </details>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </section>

      {/* Map */}
      <section
        aria-label="Enviroshield location"
        className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
      >
        <Container>
          <Reveal dir="scale">
            <div className="relative overflow-hidden rounded-[22px] border border-line bg-mist shadow-[0_18px_50px_-24px_rgba(0,51,78,0.35)]">
              <div className="h-[440px] max-[900px]:h-[360px]">
                <iframe
                  title={`${office.name} location - ${office.address}`}
                  width="100%"
                  height="100%"
                  className="border-0 grayscale-[0.35] transition duration-500 hover:grayscale-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedSrc}
                />
              </div>

              {/* Floating info card (stacks under the map on mobile) */}
              <div className="p-4 min-[901px]:pointer-events-none min-[901px]:absolute min-[901px]:left-6 min-[901px]:top-6 min-[901px]:w-[320px] min-[901px]:p-0">
                <div className="pointer-events-auto rounded-[16px] border border-line bg-white p-5 shadow-[0_12px_40px_-12px_rgba(0,51,78,0.3)]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                      <MapPin className="h-5 w-5" />
                    </span>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
                        Visit us
                      </p>

                      <h3 className="mt-1 text-lg font-bold leading-tight tracking-[-0.02em] text-navy">
                        {office.name}
                      </h3>

                      <p className="mt-1.5 text-sm leading-relaxed text-ink">
                        {office.address}
                      </p>

                      <p className="mt-1 text-sm text-ink/70">
                        {office.hours}
                      </p>
                    </div>
                  </div>

                  <a
                    href={mapDirectionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2"
                  >
                    Get directions
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}