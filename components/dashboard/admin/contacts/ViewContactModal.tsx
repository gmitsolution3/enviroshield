"use client";

import {
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Ruler,
  User,
  XCircle,
} from "lucide-react";

import type {
  IContact,
  TContactProjectTimeline,
  TContactProjectType,
  TContactSource,
  TContactStatus,
} from "@/types";

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

type ViewContactModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  contact: IContact | null;
};

const statusLabels: Record<TContactStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  "site-visit": "Site Visit",
  "proposal-sent": "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

const sourceLabels: Record<TContactSource, string> = {
  website: "Website",
  phone: "Phone",
  referral: "Referral",
  other: "Other",
};

const projectTypeLabels: Record<TContactProjectType, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  warehouse: "Warehouse",
  factory: "Factory",
  hospital: "Hospital",
  school: "School",
  hotel: "Hotel",
  office: "Office",
  "shopping-mall": "Shopping Mall",
  "sports-facility": "Sports Facility",
  other: "Other",
};

const timelineLabels: Record<TContactProjectTimeline, string> = {
  immediate: "Immediate",
  "within-1-month": "Within 1 Month",
  "1-3-months": "1–3 Months",
  "3-6-months": "3–6 Months",
  "6-plus-months": "6+ Months",
  "not-decided": "Not Decided",
};

export default function ViewContactModal({
  isModalOpen,
  setIsModalOpen,
  contact,
}: ViewContactModalProps) {
  if (!contact) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const isWon = contact.status === "won";
  const isLost = contact.status === "lost";

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-h-[92vh] !max-w-6xl overflow-y-auto border-0 bg-[#f8fafc] p-0 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Contact Details</DialogTitle>

          <DialogDescription>
            View complete information about this contact and project
            inquiry.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden">
          {/* =========================================================
              HERO
          ========================================================= */}

          <section className="relative overflow-hidden bg-navy px-6 py-7 text-white sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                {/* Contact identity */}

                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur-sm">
                    <User className="h-7 w-7" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={`
                          border-0 text-white
                          ${
                            isWon
                              ? "bg-emerald-500 hover:bg-emerald-500"
                              : isLost
                                ? "bg-red-500 hover:bg-red-500"
                                : "bg-blue hover:bg-blue"
                          }
                        `}
                      >
                        {isWon ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : isLost ? (
                          <XCircle className="mr-1 h-3 w-3" />
                        ) : null}

                        {statusLabels[contact.status]}
                      </Badge>

                      <Badge className="border-0 bg-white/10 text-white hover:bg-white/15">
                        {sourceLabels[contact.source]}
                      </Badge>
                    </div>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                      Contact Inquiry
                    </p>

                    <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                      {contact.fullName}
                    </h2>

                    {contact.projectName && (
                      <p className="mt-2 text-sm text-white/60">
                        {contact.projectName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact actions */}

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${contact.phoneNumber}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/15"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>

                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/15"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </div>

              {/* Hero meta */}

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <HeroMeta
                  icon={<Calendar className="h-4 w-4" />}
                  label="Received"
                  value={formatDate(contact.createdAt)}
                />

                <HeroMeta
                  icon={<Clock className="h-4 w-4" />}
                  label="Updated"
                  value={formatDate(contact.updatedAt)}
                />

                <HeroMeta
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={contact.phoneNumber}
                />

                <HeroMeta
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={contact.email}
                />
              </div>
            </div>
          </section>

          {/* =========================================================
              CONTENT
          ========================================================= */}

          <div className="space-y-6 p-5 sm:p-8">
            {/* =====================================================
                CUSTOMER INFORMATION
            ===================================================== */}

            <section>
              <SectionHeading
                eyebrow="01"
                title="Customer Information"
                description="Contact and company information submitted by the customer."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Full Name"
                  value={contact.fullName}
                  icon={<User className="h-4 w-4" />}
                />

                <InfoCard
                  label="Phone Number"
                  value={contact.phoneNumber}
                  icon={<Phone className="h-4 w-4" />}
                />

                <InfoCard
                  label="Email Address"
                  value={contact.email}
                  icon={<Mail className="h-4 w-4" />}
                />

                <InfoCard
                  label="Company"
                  value={contact.companyName || "Not provided"}
                  icon={<Building2 className="h-4 w-4" />}
                />

                <InfoCard
                  label="Job Title"
                  value={contact.jobTitle || "Not provided"}
                  icon={<BriefcaseBusiness className="h-4 w-4" />}
                />

                <InfoCard
                  label="Contact ID"
                  value={contact._id}
                  mono
                />
              </div>
            </section>

            {/* =====================================================
                PROJECT INFORMATION
            ===================================================== */}

            <section>
              <SectionHeading
                eyebrow="02"
                title="Project Information"
                description="Project requirements and information submitted with the inquiry."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Project Name"
                  value={contact.projectName || "Not provided"}
                  icon={<FileText className="h-4 w-4" />}
                />

                <InfoCard
                  label="Project Type"
                  value={
                    contact.projectType
                      ? projectTypeLabels[contact.projectType]
                      : "Not provided"
                  }
                  icon={<Building2 className="h-4 w-4" />}
                />

                <InfoCard
                  label="Project Timeline"
                  value={
                    contact.projectTimeline
                      ? timelineLabels[contact.projectTimeline]
                      : "Not provided"
                  }
                  icon={<Clock className="h-4 w-4" />}
                />

                <InfoCard
                  label="Project Area"
                  value={
                    contact.projectAreaSize
                      ? `${contact.projectAreaSize.toLocaleString()} ${
                          contact.projectAreaUnit || ""
                        }`
                      : "Not provided"
                  }
                  icon={<Ruler className="h-4 w-4" />}
                />

                <InfoCard
                  label="Site Visit"
                  value={
                    contact.siteVisitRequired
                      ? "Required"
                      : "Not required"
                  }
                  icon={
                    contact.siteVisitRequired ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )
                  }
                  accent={
                    contact.siteVisitRequired ? "green" : "gray"
                  }
                />

                <InfoCard
                  label="Source"
                  value={sourceLabels[contact.source]}
                  icon={<ClipboardCheck className="h-4 w-4" />}
                />
              </div>

              {/* Location */}

              {contact.projectLocation && (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Project Location
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-navy">
                        {contact.projectLocation.address && (
                          <>
                            <span>
                              {contact.projectLocation.address}
                            </span>
                            <span className="text-slate-300">•</span>
                          </>
                        )}

                        {contact.projectLocation.area && (
                          <>
                            <span>
                              {contact.projectLocation.area}
                            </span>
                            <span className="text-slate-300">•</span>
                          </>
                        )}

                        <span>{contact.projectLocation.city}</span>

                        <span className="text-slate-300">•</span>

                        <span>{contact.projectLocation.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* =====================================================
                CUSTOMER MESSAGE
            ===================================================== */}

            <section>
              <SectionHeading
                eyebrow="03"
                title="Customer Message"
                description="The message submitted by the customer with this inquiry."
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                    <MessageSquare className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Message
                    </p>

                    {contact.message ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {contact.message}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm italic text-slate-400">
                        No message was provided.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                ADMIN NOTES
            ===================================================== */}

            <section>
              <SectionHeading
                eyebrow="04"
                title="Admin Notes"
                description="Internal notes recorded by the Enviroshield team."
              />

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-600">
                      Internal Note
                    </p>

                    {contact.adminNotes ? (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-amber-950/80">
                        {contact.adminNotes}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm italic text-amber-700/60">
                        No admin notes have been added.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                CONTACT STATUS
            ===================================================== */}

            <section>
              <SectionHeading
                eyebrow="05"
                title="Contact Status"
                description="Current status and origin of this contact inquiry."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Current Status"
                  value={statusLabels[contact.status]}
                  icon={
                    isWon ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isLost ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <ClipboardCheck className="h-4 w-4" />
                    )
                  }
                  accent={isWon ? "green" : isLost ? "gray" : "blue"}
                />

                <InfoCard
                  label="Source"
                  value={sourceLabels[contact.source]}
                  icon={<GlobeIcon />}
                />

                <InfoCard
                  label="Received"
                  value={formatDate(contact.createdAt)}
                  icon={<Calendar className="h-4 w-4" />}
                />
              </div>
            </section>

            {/* =====================================================
                TIMELINE
            ===================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Contact Timeline
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-navy">
                    Activity
                  </h3>
                </div>

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
                  <TimelineItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(contact.createdAt)}
                  />

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <TimelineItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDate(contact.updatedAt)}
                  />
                </div>
              </div>
            </section>

            {/* =====================================================
                FOOTER
            ===================================================== */}

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

/* ===============================================================
   HERO META
=============================================================== */

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
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-white/40">
        {icon}

        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-sm font-semibold text-white/90">
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   SECTION HEADING
=============================================================== */

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

/* ===============================================================
   INFO CARD
=============================================================== */

function InfoCard({
  label,
  value,
  icon,
  accent = "blue",
  mono = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: "blue" | "green" | "amber" | "gray";
  mono?: boolean;
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
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ===============================================================
   TIMELINE ITEM
=============================================================== */

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

/* ===============================================================
   SMALL ICON HELPER
=============================================================== */

function GlobeIcon() {
  return (
    <span className="text-current">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </span>
  );
}
