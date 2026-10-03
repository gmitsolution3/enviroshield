"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  MessageSquareQuote,
  Star,
  User,
  XCircle,
} from "lucide-react";

import type { ITestimonial } from "@/types";

import DashboardButton from "../../DashboardButton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";

type ViewTestimonialModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  testimonial: ITestimonial | null;
};

export default function ViewTestimonialModal({
  isModalOpen,
  setIsModalOpen,
  testimonial,
}: ViewTestimonialModalProps) {
  if (!testimonial) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const isPublished = testimonial.status === "published";

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-h-[92vh] !max-w-4xl overflow-y-auto border-0 bg-[#f8fafc] p-0 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Testimonial Details</DialogTitle>

          <DialogDescription>
            View complete information about this customer testimonial.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden">
          {/* HERO */}
          <section className="relative overflow-hidden bg-navy px-6 py-7 text-white sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />

            <div className="relative grid gap-7 lg:grid-cols-[180px_1fr]">
              {/* Client Image */}
              <div className="flex items-start justify-center lg:justify-start">
                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                  {testimonial.clientImage?.url ? (
                    <img
                      src={testimonial.clientImage.url}
                      alt={
                        testimonial.clientImage.alt ||
                        testimonial.clientName
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <MessageSquareQuote className="h-14 w-14 text-white/30" />
                  )}
                </div>
              </div>

              {/* Hero Content */}
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        isPublished
                          ? "gap-1 border-0 bg-emerald-500 text-white hover:bg-emerald-500"
                          : "gap-1 border-0 bg-white/10 text-white hover:bg-white/15"
                      }
                    >
                      {isPublished ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}

                      {testimonial.status}
                    </Badge>

                    <Badge className="gap-1 border-0 bg-amber-400 text-amber-950 hover:bg-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      {testimonial.rating}/5
                    </Badge>
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Customer Testimonial
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {testimonial.clientName}
                  </h2>

                  <div className="mt-4 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={[
                          "h-5 w-5",
                          index < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/20",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>

                {/* Hero Meta */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <HeroMeta
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(testimonial.createdAt)}
                  />

                  <HeroMeta
                    icon={<Clock className="h-4 w-4" />}
                    label="Updated"
                    value={formatDate(testimonial.updatedAt)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT */}
          <div className="space-y-6 p-5 sm:p-8">
            {/* Testimonial */}
            <section>
              <SectionHeading
                eyebrow="Review"
                title="Customer Feedback"
                description="The testimonial content submitted by the customer."
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                    <MessageSquareQuote className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-lg font-medium leading-8 text-navy">
                      “{testimonial.content}”
                    </p>

                    <div className="mt-5 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={[
                              "h-4 w-4",
                              index < testimonial.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300",
                            ].join(" ")}
                          />
                        ))}
                      </div>

                      <span className="text-sm font-semibold text-slate-500">
                        {testimonial.rating} out of 5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Information */}
            <section>
              <SectionHeading
                eyebrow="Overview"
                title="Testimonial Information"
                description="Core information and configuration for this testimonial."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Client Name"
                  value={testimonial.clientName}
                  icon={<User className="h-4 w-4" />}
                />

                <InfoCard
                  label="Rating"
                  value={`${testimonial.rating}/5`}
                  icon={<Star className="h-4 w-4" />}
                  accent="amber"
                />

                <InfoCard
                  label="Status"
                  value={testimonial.status}
                  icon={
                    isPublished ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )
                  }
                  accent={isPublished ? "green" : "gray"}
                  capitalize
                />

                <InfoCard
                  label="Testimonial ID"
                  value={testimonial._id}
                  mono
                />

                <InfoCard
                  label="Created"
                  value={formatDate(testimonial.createdAt)}
                  icon={<Calendar className="h-4 w-4" />}
                />

                <InfoCard
                  label="Last Updated"
                  value={formatDate(testimonial.updatedAt)}
                  icon={<Clock className="h-4 w-4" />}
                />
              </div>
            </section>

            {/* Client Image */}
            {testimonial.clientImage && (
              <section>
                <SectionHeading
                  eyebrow="Media"
                  title="Client Image"
                  description="The image associated with this customer testimonial."
                />

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <img
                        src={testimonial.clientImage.url}
                        alt={
                          testimonial.clientImage.alt ||
                          testimonial.clientName
                        }
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Alt Text
                      </p>

                      <p className="mt-1 text-sm font-semibold text-navy">
                        {testimonial.clientImage.alt ||
                          testimonial.clientName}
                      </p>

                      <p className="mt-4 break-all text-xs text-slate-500">
                        {testimonial.clientImage.url}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Timeline */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Testimonial Timeline
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-navy">
                    Activity
                  </h3>
                </div>

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
                  <TimelineItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(testimonial.createdAt)}
                  />

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <TimelineItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDate(testimonial.updatedAt)}
                  />
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-200 pt-5">
              <DashboardButton
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-10 rounded-full border-blue/30 bg-white px-6 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/5 hover:text-blue hover:shadow-md"
              >
                Close
              </DashboardButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HeroMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-white/40">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-semibold text-white/90">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 h-9 w-1 shrink-0 rounded-full bg-blue" />

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue">
          {eyebrow}
        </p>

        <h3 className="mt-1 text-xl font-bold tracking-tight text-navy">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  accent = "blue",
  mono = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: "blue" | "green" | "amber" | "gray";
  mono?: boolean;
  capitalize?: boolean;
}) {
  const accentClasses = {
    blue: "bg-blue/10 text-blue",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    gray: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentClasses[accent]}`}
          >
            {icon}
          </div>
        )}

        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
          {label}
        </p>
      </div>

      <p
        className={`mt-3 break-words text-sm font-semibold text-navy ${
          mono ? "font-mono text-xs" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function TimelineItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/5 text-blue">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-navy">
          {value}
        </p>
      </div>
    </div>
  );
}
