import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
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
      <Header />
      <main>
        <PageHero
          eyebrow="CONTACT US"
          title="Let's create something beautiful together."
          text="Tell us a little about your space and what you have in mind. We will get back to you with clear next steps."
          image="https://images.pexels.com/photos/6474305/pexels-photo-6474305.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
        />
        <ContactSection full />
        <section className="section">
          <div className="container">
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <Reveal dir="up">
                <h2
                  style={{
                    fontSize: "clamp(32px,4vw,48px)",
                    color: "var(--navy)",
                    letterSpacing: "-.04em",
                    margin: "0 0 10px",
                  }}
                >
                  Frequently asked questions
                </h2>
                <p style={{ color: "var(--ink)", marginBottom: 36 }}>
                  A few things we are often asked. If your question is
                  not here, just send us a message.
                </p>
              </Reveal>
              <StaggerContainer style={{ display: "grid", gap: 14 }}>
                {faqs.map((f) => (
                  <StaggerItem key={f.q}>
                    <details
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: 12,
                        padding: "18px 22px",
                        background: "#fff",
                      }}
                    >
                      <summary
                        style={{
                          cursor: "pointer",
                          fontWeight: 700,
                          color: "var(--navy)",
                          fontSize: 16,
                          listStyle: "none",
                        }}
                      >
                        {f.q}
                      </summary>
                      <p
                        style={{
                          color: "var(--ink)",
                          lineHeight: 1.7,
                          margin: "12px 0 0",
                        }}
                      >
                        {f.a}
                      </p>
                    </details>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal dir="scale">
              <div
                style={{
                  height: 360,
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                <iframe
                  title="Enviroshield Location - 45 Bridge Street, Brooklyn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=45+Bridge+Street,+Brooklyn,+NY&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
