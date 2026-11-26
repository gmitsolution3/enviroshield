import Container from "@/components/Container";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Enviroshield",
  description:
    "Learn how Enviroshield collects, uses, protects, and handles your personal information, inquiry submissions, site audit requests, and cookie data in compliance with data privacy standards.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 16, 2026";

  return (
    <>
      {/* Header Banner */}
      <section className="bg-navy py-16 text-white sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-paste">
              PRIVACY & DATA PROTECTION
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Privacy Policy
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
            {/* Introduction */}
            <div className="rounded-2xl border border-line bg-mist/40 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                1. Overview & Commitment
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                At <strong>Enviroshield</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, process, retain, and safeguard personal information obtained through our website, quote request forms, customer service channels, and technical site audit bookings.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                2. Information We Collect
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                We collect personal information necessary to deliver our waterproofing, industrial flooring, chemical distribution, and contracting services:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80 sm:text-base">
                <li>
                  <strong>Contact & Project Information:</strong> When you submit a quote request, damp inspection form, or contact inquiry, we collect your name, phone number, email address, property address, and project specifications.
                </li>
                <li>
                  <strong>Account & Order Details:</strong> If you register an account or purchase products via our online catalogue, we collect billing details, shipping addresses, order histories, and purchase invoices.
                </li>
                <li>
                  <strong>Technical & Analytics Data:</strong> When you browse our website, we automatically log standard device data including IP address, browser type, operating system, page response times, referring URLs, and interaction signals via privacy-first cookies and analytics.
                </li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                3. How We Use Your Information
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                The information collected is used exclusively for legitimate business operations:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80 sm:text-base">
                <li>To coordinate on-site damp audits, engineering inspections, and technical site visits.</li>
                <li>To prepare tailored commercial quotations, contracts, and material dosage recommendations.</li>
                <li>To fulfill orders, process payments, and dispatch chemical deliveries across Bangladesh.</li>
                <li>To provide responsive technical support, warranty validation, and customer after-sales care.</li>
                <li>To maintain, optimize, and enhance the security and performance of our digital platforms.</li>
              </ul>
            </div>

            {/* Cookies & Tracking */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                4. Cookies & Tracking Technologies
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                We use cookies and similar technologies to facilitate session navigation, maintain your shopping cart, and measure website traffic. You can modify your cookie settings at any time using our on-site cookie preferences manager or through your browser settings. Essential cookies required for website security and checkout cannot be switched off.
              </p>
            </div>

            {/* Data Sharing */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                5. Data Sharing & Third Parties
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                <strong>We do not sell, rent, or trade your personal data.</strong> We may share necessary details with trusted third parties strictly to fulfill contracted services:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/80 sm:text-base">
                <li>Logistics and courier partners for product shipments and on-site material deliveries.</li>
                <li>Secure payment processors for authorized credit/debit card and mobile banking transactions.</li>
                <li>Law enforcement or regulatory bodies when required to comply with applicable laws of Bangladesh.</li>
              </ul>
            </div>

            {/* Retention & Security */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                6. Data Retention & Security
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                We implement industry-standard administrative, physical, and technical safeguards—including TLS encryption and restricted database access—to protect your personal information. Customer project records, warranty documentation, and transaction histories are retained in compliance with commercial statutory retention requirements.
              </p>
            </div>

            {/* Your Rights */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                7. Your Rights & Choices
              </h2>
              <p className="text-sm leading-relaxed text-ink/80 sm:text-base">
                You have the right to request access to the personal data we hold about you, request corrections to outdated details, or ask for deletion of marketing records by contacting our privacy officer.
              </p>
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl border border-line bg-mist/60 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-navy sm:text-2xl">
                8. Contact Our Privacy Team
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
                If you have questions, concerns, or requests regarding this Privacy Policy, please contact us:
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
                  Contact Privacy Officer
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
