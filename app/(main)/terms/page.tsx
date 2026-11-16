import Container from "@/components/Container";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | Enviroshield",
  description:
    "Read the terms and conditions governing the use of Enviroshield's website, industrial waterproofing and flooring products, engineering consultations, and application services in Bangladesh.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
};

export default function TermsPage() {
  const lastUpdated = "November 16, 2026";

  return (
    <>
      {/* Header Banner */}
      <section className="bg-navy py-16 text-white sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-paste">
              <span className="h-0.5 w-6 bg-paste" aria-hidden="true" />
              LEGAL DOCUMENTATION
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-sm text-white/80 sm:text-base">
              Last updated: {lastUpdated}
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl space-y-12 text-navy/90">
            {/* Overview */}
            <div className="rounded-2xl border border-line bg-mist/40 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                1. Agreement to Terms
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                Welcome to <strong>Enviroshield</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                By accessing or using our website, services, product catalogues, site inspection bookings, or purchasing our protective coating materials, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please refrain from using our website or services.
              </p>
            </div>

            {/* Industrial Products & Representations */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                2. Industrial Products & Technical Specifications
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                Enviroshield manufactures and distributes specialized construction chemicals, waterproofing polymers, epoxy/PU flooring compounds, crystalline systems, and protective coatings. While we make every effort to display accurate technical specifications, coverage rates, and Technical Data Sheets (TDS), real-world performance depends heavily on site conditions, substrate preparation, ambient humidity, temperature, and applicator expertise.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80 sm:text-base">
                <li>
                  Product batch colours and textures may experience minor variances due to industrial manufacturing processes.
                </li>
                <li>
                  Technical data sheets, application manuals, and dosage ratios are provided for qualified industrial guidance and should be verified during pre-application site testing.
                </li>
                <li>
                  Chemical products must be stored, handled, and applied in accordance with the relevant safety guidelines and Material Safety Data Sheets (MSDS).
                </li>
              </ul>
            </div>

            {/* Services & Consultations */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                3. Site Inspections, Consultations & Application Services
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                When you request a site inspection, damp audit, or project quotation through Enviroshield:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80 sm:text-base">
                <li>
                  Site assessments and moisture readings are evaluated based on observable conditions at the time of inspection.
                </li>
                <li>
                  Formal quotations are valid for the timeframe specified in the project proposal (typically 30 days) and are subject to substrate condition confirmation upon mobilization.
                </li>
                <li>
                  Applicator warranties are tied directly to contracted full-system applications executed or supervised by certified Enviroshield engineering personnel.
                </li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                4. Intellectual Property Rights
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                All content published on this website—including but not limited to brand trademarks, logos, system diagrams, project photographs, technical documentation, design layouts, and software code—is the proprietary property of <strong>Enviroshield</strong> and is protected under the copyright and trademark laws of Bangladesh and international treaties. You may not reproduce, distribute, or create derivative works without prior written consent.
              </p>
            </div>

            {/* Orders & Payments */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                5. Orders, Invoicing & Payment Terms
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                For chemical purchases and commercial contracts:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80 sm:text-base">
                <li>
                  Prices listed on our product catalogue are quoted in Bangladeshi Taka (BDT) and are subject to applicable taxes unless stated otherwise.
                </li>
                <li>
                  We reserve the right to decline or adjust orders in the event of stock unavailability, typographical pricing errors, or logistics constraints outside our control.
                </li>
                <li>
                  Commercial application contracts follow milestone billing schedules stipulated in the signed service agreement.
                </li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                6. Limitation of Liability
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                To the fullest extent permitted by applicable law, Enviroshield shall not be held liable for indirect, incidental, consequential, or punitive damages arising out of improper product storage, unauthorized third-party application, structural shifts, seismic events, or substrate failures not attributable to certified material defects.
              </p>
            </div>

            {/* Governing Law */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                7. Governing Law & Jurisdiction
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                These Terms and Conditions shall be governed by and construed in accordance with the substantive laws of the <strong>People&rsquo;s Republic of Bangladesh</strong>. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts of Dhaka, Bangladesh.
              </p>
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl border border-line bg-mist/60 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                8. Contact Information
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                For questions regarding these Terms & Conditions or contractual inquiries, please contact our legal and administrative department:
              </p>
              <div className="mt-4 space-y-2 text-sm text-navy">
                <p>
                  <strong>Entity:</strong> Enviroshield
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:enviroshield.bd@gmail.com"
                    className="font-semibold text-blue underline hover:text-navy"
                  >
                    enviroshield.bd@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:+8801613220101"
                    className="font-semibold text-blue underline hover:text-navy"
                  >
                    +880 1613-220101
                  </a>
                </p>
                <p>
                  <strong>Address:</strong> House #13~15, Road # 22, Block # B, Bauniabad R/A, Mirpur-11, Dhaka., Mirpur, Bangladesh, 1216
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-navy"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
