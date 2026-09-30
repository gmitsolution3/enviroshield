
"use client";

import Image from "next/image";
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  ImageIcon,
  Layers3,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react";

import type { IService } from "@/types";

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

type ViewServiceModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  service: IService | null;
};

export default function ViewServiceModal({
  isModalOpen,
  setIsModalOpen,
  service,
}: ViewServiceModalProps) {
  if (!service) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const isPublished = service.status === "published";

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
        {/* =========================================================
            HEADER
        ========================================================= */}
        <DialogHeader className="sr-only">
          <DialogTitle>Service Details</DialogTitle>

          <DialogDescription>
            View complete information about this Enviroshield service.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden">
          {/* =======================================================
              HERO
          ======================================================= */}
          <section className="relative overflow-hidden bg-navy px-6 py-6 text-white sm:px-8 sm:py-8">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[340px_1fr]">
              {/* Hero Image */}
              <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                {service.primaryImage?.url ? (
                  <Image
                    src={service.primaryImage.url}
                    alt={
                      service.primaryImage.alt ||
                      service.name
                    }
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[240px] items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-white/30" />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 pb-4 pt-16">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                    Primary Image
                  </p>

                  {service.primaryImage.caption && (
                    <p className="mt-1 text-sm text-white/90">
                      {service.primaryImage.caption}
                    </p>
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

                      {service.status}
                    </Badge>

                    {service.isFeatured && (
                      <Badge className="gap-1 border-0 bg-amber-400 text-amber-950 hover:bg-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Service
                  </p>

                  <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                    {service.name}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
                    <span className="font-mono">
                      /services/{service.slug}
                    </span>
                  </div>

                  <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70 sm:text-[15px]">
                    {service.description}
                  </p>
                </div>

                {/* Hero Meta */}
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <HeroMeta
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(service.createdAt)}
                  />

                  <HeroMeta
                    icon={<Clock className="h-4 w-4" />}
                    label="Updated"
                    value={formatDate(service.updatedAt)}
                  />

                  <HeroMeta
                    icon={<Layers3 className="h-4 w-4" />}
                    label="Projects"
                    value={`${service.projects?.length || 0}`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =======================================================
              CONTENT
          ======================================================= */}
          <div className="space-y-6 p-5 sm:p-8">
            {/* =====================================================
                BASIC INFORMATION
            ===================================================== */}
            <section>
              <SectionHeading
                eyebrow="Overview"
                title="Service Information"
                description="Core information and configuration for this service."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Service Name"
                  value={service.name}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />

                <InfoCard
                  label="Status"
                  value={service.status}
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
                  label="Featured"
                  value={
                    service.isFeatured ? "Featured" : "Standard"
                  }
                  icon={<Star className="h-4 w-4" />}
                  accent={
                    service.isFeatured ? "amber" : "gray"
                  }
                />

                <InfoCard
                  label="Slug"
                  value={service.slug}
                  mono
                />

                <InfoCard
                  label="Service ID"
                  value={service._id}
                  mono
                />

                <InfoCard
                  label="Published"
                  value={
                    service.publishedAt
                      ? formatDate(service.publishedAt)
                      : "Not published"
                  }
                  icon={<Globe className="h-4 w-4" />}
                />
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Detail Heading
                </p>

                <h3 className="mt-2 text-lg font-semibold tracking-tight text-navy">
                  {service.detailHeading}
                </h3>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Description
                  </p>

                  <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
                    {service.description}
                  </p>
                </div>
              </div>
            </section>

            {/* =====================================================
                WHY ENVIROSHIELD
            ===================================================== */}
            <VisualContentSection
              eyebrow="01"
              title="Why Enviroshield"
              description="The reasons and advantages presented for choosing Enviroshield."
              section={service.whyEnviroshield}
              imagePosition="left"
            />

            {/* =====================================================
                PROCESS
            ===================================================== */}
            <VisualContentSection
              eyebrow="02"
              title="Our Process"
              description="The process used to deliver this service."
              section={service.process}
              imagePosition="right"
            />

            {/* =====================================================
                BENEFITS
            ===================================================== */}
            <VisualContentSection
              eyebrow="03"
              title="Benefits"
              description="The key benefits associated with this service."
              section={service.benefits}
              imagePosition="left"
            />

            {/* =====================================================
                PROJECTS
            ===================================================== */}
            <section>
              <SectionHeading
                eyebrow="Portfolio"
                title="Projects"
                description={`${service.projects?.length || 0} project${
                  service.projects?.length === 1
                    ? ""
                    : "s"
                } associated with this service.`}
              />

              <div className="mt-5">
                {service.projects?.length ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {service.projects.map((project) => (
                      <div
                        key={project._id}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="relative h-52 overflow-hidden bg-slate-100">
                          {project.primaryImage?.url ? (
                            <Image
                              src={
                                project.primaryImage.url
                              }
                              alt={
                                project.primaryImage.alt ||
                                project.title
                              }
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-10 w-10 text-slate-300" />
                            </div>
                          )}

                          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                            <Badge className="border-0 bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white">
                              {project.status}
                            </Badge>

                            {project.isFeatured && (
                              <Badge className="gap-1 border-0 bg-amber-400 text-amber-950 shadow-sm hover:bg-amber-400">
                                <Star className="h-3 w-3 fill-current" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="p-5">
                          <h4 className="text-lg font-semibold tracking-tight text-navy">
                            {project.title}
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {project.description}
                          </p>

                          <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                            <div className="flex gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue" />

                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                  Location
                                </p>

                                <p className="mt-1 text-sm font-medium text-navy">
                                  {project.location.city},{" "}
                                  {project.location.area},{" "}
                                  {project.location.country}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-blue" />

                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                  Completed
                                </p>

                                <p className="mt-1 text-sm font-medium text-navy">
                                  {formatDate(
                                    project.completionDate,
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Layers3 className="h-6 w-6" />}
                    title="No projects yet"
                    description="There are currently no projects associated with this service."
                  />
                )}
              </div>
            </section>

            {/* =====================================================
                SEO
            ===================================================== */}
            {service.seo && (
              <section>
                <SectionHeading
                  eyebrow="Discoverability"
                  title="SEO & Social"
                  description="Search engine and social sharing configuration for this service."
                />

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue/10 text-blue">
                        <Search className="h-4 w-4" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-navy">
                          Search Engine Configuration
                        </h4>

                        <p className="text-xs text-slate-500">
                          Metadata used by search engines and social platforms.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <SeoCard
                      label="Meta Title"
                      value={service.seo.metaTitle}
                    />

                    <SeoCard
                      label="OG Title"
                      value={service.seo.ogTitle}
                    />

                    <SeoCard
                      label="Meta Description"
                      value={service.seo.metaDescription}
                      large
                    />

                    <SeoCard
                      label="OG Description"
                      value={service.seo.ogDescription}
                      large
                    />

                    <SeoCard
                      label="Canonical URL"
                      value={service.seo.canonicalUrl}
                      link
                    />

                    <SeoCard
                      label="OG Image"
                      value={service.seo.ogImage}
                      link
                    />
                  </div>

                  <div className="grid gap-4 border-t border-slate-100 bg-slate-50/50 p-5 md:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Keywords
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.seo.keywords?.length ? (
                          service.seo.keywords.map(
                            (keyword, index) => (
                              <span
                                key={`${keyword}-${index}`}
                                className="rounded-full border border-blue/15 bg-blue/5 px-3 py-1.5 text-xs font-medium text-blue"
                              >
                                {keyword}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-sm text-slate-500">
                            No keywords
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          service.seo.noIndex
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {service.seo.noIndex ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}

                        {service.seo.noIndex
                          ? "Search indexing disabled"
                          : "Search indexing enabled"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* =====================================================
                TIMELINE
            ===================================================== */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Service Timeline
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-navy">
                    Activity
                  </h3>
                </div>

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
                  <TimelineItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(
                      service.createdAt,
                    )}
                  />

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <TimelineItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDate(
                      service.updatedAt,
                    )}
                  />

                  {service.publishedAt && (
                    <>
                      <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                      <TimelineItem
                        icon={<Globe className="h-4 w-4" />}
                        label="Published"
                        value={formatDate(
                          service.publishedAt,
                        )}
                      />
                    </>
                  )}
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

/* ===============================================================
   VISUAL CONTENT SECTION
=============================================================== */

function VisualContentSection({
  eyebrow,
  title,
  description,
  section,
  imagePosition,
}: {
  eyebrow: string;
  title: string;
  description: string;
  section: IService["whyEnviroshield"];
  imagePosition: "left" | "right";
}) {
  const image = (
    <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-slate-100 lg:min-h-[360px]">
      {section?.image?.url ? (
        <Image
          src={section.image.url}
          alt={section.image.alt || title}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full min-h-[280px] items-center justify-center">
          <ImageIcon className="h-12 w-12 text-slate-300" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
          {title}
        </p>

        {section?.image?.caption && (
          <p className="mt-1 max-w-md text-sm font-medium text-white">
            {section.image.caption}
          </p>
        )}
      </div>
    </div>
  );

  const content = (
    <div className="flex flex-col justify-center">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue text-xs font-bold text-white shadow-sm">
            {eyebrow}
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <h3 className="mt-5 text-2xl font-bold tracking-tight text-navy">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {section?.items?.length ? (
          section.items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue/20 hover:shadow-md"
            >
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue/5 text-[11px] font-bold text-blue transition-colors group-hover:bg-blue group-hover:text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-navy">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<ImageIcon className="h-5 w-5" />}
            title="No content available"
            description={`No ${title.toLowerCase()} information has been added.`}
          />
        )}
      </div>
    </div>
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className={`grid lg:grid-cols-2 ${
          imagePosition === "right"
            ? "lg:[&>*:first-child]:order-2"
            : ""
        }`}
      >
        <div className="relative p-2 sm:p-3">
          {image}
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          {content}
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   SEO CARD
=============================================================== */

function SeoCard({
  label,
  value,
  link = false,
  large = false,
}: {
  label: string;
  value: string;
  link?: boolean;
  large?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>

      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-start gap-2 break-all text-sm font-medium leading-6 text-blue hover:underline"
        >
          <span>{value}</span>

          <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <p
          className={`mt-2 text-sm leading-6 text-navy ${
            large ? "max-w-2xl" : ""
          }`}
        >
          {value}
        </p>
      )}
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
   EMPTY STATE
=============================================================== */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold text-navy">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
