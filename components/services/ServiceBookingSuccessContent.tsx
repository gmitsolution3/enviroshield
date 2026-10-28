"use client";

import {
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  MapPin,
  ShieldCheck,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "@/components/Container";
import ServiceBookingSuccessLoading from "@/components/services/ServiceBookingSuccessLoading";
import {
  getMyBookingById,
  type BookingConfirmation,
  type BookingServiceSummary,
  type BookingUserSummary,
} from "@/lib/api/bookings";

const formatDate = (dateString?: string) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

type StatusPresentation = {
  label: string;
  heading: string;
  highlight: string;
  message: string;
  cardTitle: string;
  cardMessage: string;
  Icon: LucideIcon;
  badgeClass: string;
  iconFrameClass: string;
  iconClass: string;
  textClass: string;
};

const statusPresentations: Record<string, StatusPresentation> = {
  pending: {
    label: "Booking Pending",
    heading: "Service Request",
    highlight: "Awaiting Review",
    message:
      "We have successfully received your service booking request. Our technical team is reviewing your project location and will contact you to confirm next steps.",
    cardTitle: "Request Received",
    cardMessage: "Our engineering team will contact you shortly.",
    Icon: CheckCircle2,
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconFrameClass: "border-emerald-200 bg-emerald-50 shadow-[0_0_0_12px_rgba(16,185,129,0.06)]",
    iconClass: "bg-emerald-100 text-emerald-700",
    textClass: "text-emerald-900",
  },
  confirmed: {
    label: "Booking Confirmed",
    heading: "Your Service is",
    highlight: "Confirmed",
    message:
      "Your service booking has been confirmed by Enviroshield. Our technical team will follow up according to the scheduled arrangements.",
    cardTitle: "Booking Confirmed",
    cardMessage: "Your project is scheduled for site execution.",
    Icon: CheckCircle2,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass: "border-blue/20 bg-blue/5",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  "in-progress": {
    label: "In Progress",
    heading: "Service Work",
    highlight: "In Progress",
    message:
      "Work on your project is actively in progress under our quality-controlled application protocols.",
    cardTitle: "Work In Progress",
    cardMessage: "Surface treatment and application underway.",
    Icon: Wrench,
    badgeClass: "border-blue/20 bg-blue/5 text-blue",
    iconFrameClass: "border-blue/20 bg-blue/5",
    iconClass: "bg-blue/10 text-blue",
    textClass: "text-blue",
  },
  completed: {
    label: "Service Completed",
    heading: "Project Successfully",
    highlight: "Completed",
    message:
      "All service work has been completed and inspected. Warranty and protection documentation has been archived.",
    cardTitle: "Project Completed",
    cardMessage: "Protection applied with verified warranty.",
    Icon: ShieldCheck,
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconFrameClass: "border-emerald-200 bg-emerald-50",
    iconClass: "bg-emerald-100 text-emerald-700",
    textClass: "text-emerald-900",
  },
  cancelled: {
    label: "Booking Cancelled",
    heading: "This Booking was",
    highlight: "Cancelled",
    message:
      "This service booking request has been cancelled. You may submit a new reservation whenever you are ready.",
    cardTitle: "Cancelled",
    cardMessage: "This booking is no longer active.",
    Icon: XCircle,
    badgeClass: "border-red-200 bg-red-50 text-red-800",
    iconFrameClass: "border-red-200 bg-red-50",
    iconClass: "bg-red-100 text-red-700",
    textClass: "text-red-900",
  },
  rejected: {
    label: "Booking Declined",
    heading: "Booking Request",
    highlight: "Declined",
    message:
      "We were unable to accommodate this booking request. Please reach out to our team if you need further clarification.",
    cardTitle: "Declined",
    cardMessage: "Request could not be processed.",
    Icon: XCircle,
    badgeClass: "border-red-200 bg-red-50 text-red-800",
    iconFrameClass: "border-red-200 bg-red-50",
    iconClass: "bg-red-100 text-red-700",
    textClass: "text-red-900",
  },
};

type ServiceBookingSuccessContentProps = {
  bookingId: string;
};

export default function ServiceBookingSuccessContent({
  bookingId,
}: ServiceBookingSuccessContentProps) {
  const [bookingLookup, setBookingLookup] = useState<{
    bookingId: string;
    booking?: BookingConfirmation;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const checked = !bookingId.trim() || bookingLookup?.bookingId === bookingId;
  const booking =
    bookingLookup?.bookingId === bookingId
      ? bookingLookup.booking ?? null
      : null;
  const errorMessage = !bookingId.trim()
    ? "No booking ID was provided."
    : bookingLookup?.bookingId === bookingId
      ? bookingLookup.error ?? ""
      : "";
  const loading = !checked;

  useEffect(() => {
    let active = true;

    if (!bookingId.trim()) {
      return () => {
        active = false;
      };
    }

    getMyBookingById(bookingId)
      .then((retrievedBooking) => {
        if (active) {
          setBookingLookup({ bookingId, booking: retrievedBooking });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not retrieve your booking details.";
          setBookingLookup({ bookingId, error: message });
        }
      });

    return () => {
      active = false;
    };
  }, [bookingId]);

  const copyBookingNumber = async () => {
    if (!booking?.bookingNumber) return;
    try {
      await navigator.clipboard.writeText(booking.bookingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore clipboard error
    }
  };

  if (loading) {
    return <ServiceBookingSuccessLoading />;
  }

  if (errorMessage || !booking) {
    return (
      <section className="min-h-[70vh] bg-mist/35 py-16">
        <Container>
          <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,51,78,0.04)]">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-red-600">
              <XCircle size={32} />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-navy">
              Booking Not Found
            </h1>
            <p className="mt-2 text-sm text-ink/70">
              {errorMessage || "We could not find the requested service booking."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard/my-services"
                className="rounded-full bg-blue px-6 py-2.5 text-sm font-bold text-white transition hover:bg-deep"
              >
                Go to My Bookings
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-line bg-white px-6 py-2.5 text-sm font-bold text-navy transition hover:border-blue hover:text-blue"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const statusPresentation =
    statusPresentations[booking.status] ?? statusPresentations.pending;
  const StatusIcon = statusPresentation.Icon;
  const isCancelled = booking.status === "cancelled" || booking.status === "rejected";

  const service =
    booking.serviceId && typeof booking.serviceId === "object"
      ? (booking.serviceId as BookingServiceSummary)
      : null;

  const user =
    booking.userId && typeof booking.userId === "object"
      ? (booking.userId as BookingUserSummary)
      : null;

  return (
    <section className="min-h-[80vh] bg-mist/35 py-14 max-[600px]:py-9">
      <Container>
        <div className="mx-auto max-w-[1080px]">
          {/* Top Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/dashboard/my-services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue transition-colors hover:text-deep"
            >
              <ArrowRight size={16} className="rotate-180" aria-hidden="true" />
              View All My Service Bookings
            </Link>
          </div>

          {/* Hero Banner Card */}
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-[0_12px_36px_rgba(0,51,78,0.06)]">
            <div className="grid items-center gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider ${statusPresentation.badgeClass}`}
                >
                  <StatusIcon size={14} aria-hidden="true" />
                  {statusPresentation.label}
                </div>

                <h1 className="mt-5 text-[clamp(32px,4.5vw,50px)] font-extrabold leading-tight tracking-[-0.04em] text-navy">
                  {statusPresentation.heading}
                  {statusPresentation.highlight && (
                    <span
                      className={`block ${
                        isCancelled ? "text-red-700" : "text-blue"
                      }`}
                    >
                      {statusPresentation.highlight}
                    </span>
                  )}
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:text-base">
                  {statusPresentation.message}
                </p>

                {/* Actions */}
                <div className="mt-7 flex flex-wrap gap-3">
                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={copyBookingNumber}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(1,110,220,0.22)] transition hover:-translate-y-0.5 hover:bg-deep focus-visible:outline-blue"
                    >
                      {copied ? (
                        <Check size={17} aria-hidden="true" />
                      ) : (
                        <Copy size={16} aria-hidden="true" />
                      )}
                      {copied ? "Booking number copied!" : "Copy booking number"}
                    </button>
                  )}

                  <Link
                    href="/dashboard/my-services"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-bold text-navy transition hover:border-blue hover:text-blue"
                  >
                    View in Dashboard
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>

                  <Link
                    href="/services"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-transparent px-5 text-sm font-bold text-ink/70 transition hover:text-navy"
                  >
                    Browse other services
                  </Link>
                </div>
              </div>

              {/* Status Graphic Frame */}
              <div className="flex flex-col items-center py-2">
                <div
                  className={`relative grid size-36 place-items-center rounded-full border sm:size-40 ${statusPresentation.iconFrameClass}`}
                >
                  <div
                    className={`grid size-24 place-items-center rounded-full sm:size-28 ${statusPresentation.iconClass}`}
                  >
                    <StatusIcon
                      size={54}
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="mt-5 w-full max-w-[320px] rounded-2xl border border-line bg-white p-4 text-center shadow-sm">
                  <p
                    className={`text-base font-extrabold ${statusPresentation.textClass}`}
                  >
                    {statusPresentation.cardTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink/65">
                    {statusPresentation.cardMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* LEFT COLUMN: Booking & Project Details */}
            <div className="space-y-6">
              {/* Reference Details */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(0,51,78,0.03)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="grid size-10 place-items-center rounded-2xl bg-blue/10 text-blue">
                    <FileText size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-navy">
                      Booking Information
                    </h2>
                    <p className="text-xs text-ink/60">
                      Keep this reference for communication and site visits
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-line bg-[#fbfcfe] p-4">
                    <p className="text-xs font-semibold text-ink/60">
                      Booking Number
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="font-mono text-base font-extrabold text-navy">
                        {booking.bookingNumber}
                      </p>
                      <button
                        type="button"
                        onClick={copyBookingNumber}
                        aria-label="Copy booking number"
                        className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-white text-ink/70 transition hover:border-blue hover:text-blue"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-[#fbfcfe] p-4">
                    <p className="text-xs font-semibold text-ink/60">
                      Booking Status
                    </p>
                    <div className="mt-2">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${statusPresentation.badgeClass}`}
                      >
                        <StatusIcon size={13} aria-hidden="true" />
                        <span>{statusPresentation.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-[#fbfcfe] p-4">
                    <p className="text-xs font-semibold text-ink/60">
                      Estimated Price
                    </p>
                    <p className="mt-1.5 font-display text-lg font-extrabold text-navy">
                      BDT {booking.finalPrice.toLocaleString("en-BD")}
                    </p>
                    <p className="mt-0.5 text-[10px] text-ink/50">
                      Base quote. Final quotation subject to site diagnosis.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-line bg-[#fbfcfe] p-4">
                    <p className="text-xs font-semibold text-ink/60">
                      Site Visit Requested
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-navy">
                      {booking.isSiteVisit ? (
                        <>
                          <CalendarCheck size={16} className="text-blue" />
                          <span>Yes (Inspection Requested)</span>
                        </>
                      ) : (
                        <span>Standard Review</span>
                      )}
                    </div>
                    {booking.siteVisitDate && (
                      <p className="mt-1 text-xs text-blue">
                        Visit Date: {formatDate(booking.siteVisitDate)}
                      </p>
                    )}
                  </div>
                </div>

                {user && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-mist/60 p-3.5 text-xs">
                    <User size={16} className="shrink-0 text-blue" />
                    <div>
                      <p className="font-bold text-navy">{user.name || "Customer"}</p>
                      <p className="text-ink/60">
                        {user.email}
                        {user.phone ? ` • ${user.phone}` : ""}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 border-t border-line pt-4 text-xs text-ink/50">
                  Booked on {formatDate(booking.createdAt)}
                </div>
              </div>

              {/* Project Site Details */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(0,51,78,0.03)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="grid size-10 place-items-center rounded-2xl bg-blue/10 text-blue">
                    <MapPin size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-navy">
                      Project Location & Specifications
                    </h2>
                    <p className="text-xs text-ink/60">
                      Submitted project and site requirements
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-ink/60">
                      Site Address
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy">
                      {booking.project.location}
                    </p>
                  </div>

                  {(booking.project.areaSize !== undefined || booking.project.areaUnit) && (
                    <div>
                      <p className="text-xs font-semibold text-ink/60">
                        Project Area
                      </p>
                      <p className="mt-1 text-sm font-semibold text-navy">
                        {booking.project.areaSize != null
                          ? `${booking.project.areaSize} ${booking.project.areaUnit || "sqft"}`
                          : booking.project.areaUnit || "Not specified"}
                      </p>
                    </div>
                  )}

                  {booking.project.message && (
                    <div>
                      <p className="text-xs font-semibold text-ink/60">
                        Customer Notes / Scope Description
                      </p>
                      <div className="mt-1 rounded-xl bg-mist/60 p-3 text-xs leading-relaxed text-ink/80">
                        {booking.project.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Service Card & Next Steps */}
            <div className="space-y-6">
              {/* Selected Service Card */}
              {service && (
                <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_8px_24px_rgba(0,51,78,0.03)]">
                  {service.primaryImage?.url && (
                    <div className="relative h-44 w-full bg-mist/60">
                      <Image
                        src={service.primaryImage.url}
                        alt={service.primaryImage.alt || service.name}
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue">
                        Reserved Service
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        Active Solution
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-extrabold text-navy">
                      {service.name}
                    </h3>

                    <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                      <span className="text-xs text-ink/60">Base Price:</span>
                      <span className="font-display text-base font-bold text-navy">
                        BDT {service.price?.toLocaleString("en-BD") || "0"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue hover:underline"
                      >
                        Review service specifications
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* What Happens Next Roadmap */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(0,51,78,0.03)] sm:p-7">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                  <span className="grid size-10 place-items-center rounded-2xl bg-blue/10 text-blue">
                    <ShieldCheck size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-navy">
                      What Happens Next?
                    </h2>
                    <p className="text-xs text-ink/60">
                      Our typical service onboarding timeline
                    </p>
                  </div>
                </div>

                <ol className="mt-5 space-y-4">
                  <li className="flex items-start gap-3 text-xs leading-relaxed">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue text-[11px] font-bold text-white">
                      1
                    </span>
                    <div>
                      <strong className="block font-bold text-navy">
                        Engineering Review
                      </strong>
                      <span className="text-ink/70">
                        Our technical specialists review your submitted location, area measurements, and reported issues.
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 text-xs leading-relaxed">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue/15 text-[11px] font-bold text-blue">
                      2
                    </span>
                    <div>
                      <strong className="block font-bold text-navy">
                        Direct Customer Consultation
                      </strong>
                      <span className="text-ink/70">
                        An assigned engineer reaches out via phone or email to clarify surface conditions and confirm on-site inspection timing.
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 text-xs leading-relaxed">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-blue/15 text-[11px] font-bold text-blue">
                      3
                    </span>
                    <div>
                      <strong className="block font-bold text-navy">
                        Detailed Project Quotation & Execution
                      </strong>
                      <span className="text-ink/70">
                        We present an itemized scope and material warranty before surface preparation begins.
                      </span>
                    </div>
                  </li>
                </ol>

                <div className="mt-6 rounded-2xl bg-blue/[0.04] p-4 text-xs text-ink/70">
                  <p className="font-semibold text-navy">Questions about your booking?</p>
                  <p className="mt-1">
                    Reach our technical help desk via{" "}
                    <Link href="/contact" className="font-bold text-blue hover:underline">
                      Support Contact
                    </Link>{" "}
                    mentioning booking number{" "}
                    <strong className="font-mono text-navy">{booking.bookingNumber}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
