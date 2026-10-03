"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  ImageIcon,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";

import type { IProject } from "@/types";

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

type ViewProjectModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  project: IProject | null;
};

export default function ViewProjectModal({
  isModalOpen,
  setIsModalOpen,
  project,
}: ViewProjectModalProps) {
  if (!project) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const isPublished = project.status === "published";

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
          <DialogTitle>Project Details</DialogTitle>

          <DialogDescription>
            View complete information about this Enviroshield project.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden">
          {/* HERO */}
          <section className="relative overflow-hidden bg-navy px-6 py-6 text-white sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[340px_1fr]">
              {/* Image */}
              <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                {project.primaryImage?.url ? (
                  <Image
                    src={project.primaryImage.url}
                    alt={
                      project.primaryImage.alt || project.title
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

                  {project.primaryImage?.caption && (
                    <p className="mt-1 text-sm text-white/90">
                      {project.primaryImage.caption}
                    </p>
                  )}
                </div>
              </div>

              {/* Hero content */}
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

                      {project.status}
                    </Badge>

                    {project.isFeatured && (
                      <Badge className="gap-1 border-0 bg-amber-400 text-amber-950 hover:bg-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Project
                  </p>

                  <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                    {project.title}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
                    <span className="font-mono">
                      /projects/{project.slug}
                    </span>
                  </div>

                  <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70 sm:text-[15px]">
                    {project.description}
                  </p>
                </div>

                {/* Hero meta */}
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <HeroMeta
                    icon={<Calendar className="h-4 w-4" />}
                    label="Completed"
                    value={formatDate(project.completionDate)}
                  />

                  <HeroMeta
                    icon={<Clock className="h-4 w-4" />}
                    label="Updated"
                    value={formatDate(project.updatedAt)}
                  />

                  <HeroMeta
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label="Service"
                    value={project.serviceId?.name || "—"}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT */}
          <div className="space-y-6 p-5 sm:p-8">
            {/* PROJECT INFORMATION */}
            <section>
              <SectionHeading
                eyebrow="Overview"
                title="Project Information"
                description="Core information and configuration for this project."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Project Name"
                  value={project.title}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />

                <InfoCard
                  label="Status"
                  value={project.status}
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
                    project.isFeatured
                      ? "Featured"
                      : "Standard"
                  }
                  icon={<Star className="h-4 w-4" />}
                  accent={
                    project.isFeatured ? "amber" : "gray"
                  }
                />

                <InfoCard
                  label="Slug"
                  value={project.slug}
                  mono
                />

                <InfoCard
                  label="Project ID"
                  value={project._id}
                  mono
                />

                <InfoCard
                  label="Service"
                  value={project.serviceId?.name || "—"}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Location
                    </p>

                    <div className="mt-3 flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-navy">
                          {project.location.city},{" "}
                          {project.location.area}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {project.location.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SERVICE */}
            <section>
              <SectionHeading
                eyebrow="Service"
                title="Associated Service"
                description="The Enviroshield service associated with this project."
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    {project.serviceId?.primaryImage?.url ? (
                      <Image
                        src={
                          project.serviceId.primaryImage.url
                        }
                        alt={
                          project.serviceId.primaryImage.alt ||
                          project.serviceId.name
                        }
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShieldCheck className="h-7 w-7 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-semibold text-navy">
                        {project.serviceId?.name || "—"}
                      </h4>

                      {project.serviceId?.isFeatured && (
                        <Badge className="gap-1 border-0 bg-amber-400 text-amber-950 hover:bg-amber-400">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {project.serviceId?.slug && (
                      <p className="mt-1 font-mono text-xs text-slate-400">
                        /{project.serviceId.slug}
                      </p>
                    )}

                    {project.serviceId?.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {project.serviceId.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* CLIENT */}
            <section>
              <SectionHeading
                eyebrow="Client"
                title="Client Information"
                description="Information about the client associated with this project."
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    {project.client?.logo?.url ? (
                      <Image
                        src={project.client.logo.url}
                        alt={
                          project.client.logo.alt ||
                          project.client.name
                        }
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <User className="h-7 w-7 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-lg font-semibold text-navy">
                      {project.client?.name || "—"}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {project.client?.description || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* GALLERY */}
            <section>
              <SectionHeading
                eyebrow="Gallery"
                title="Project Gallery"
                description={`${project.gallery?.length || 0} image${
                  project.gallery?.length === 1 ? "" : "s"
                } associated with this project.`}
              />

              <div className="mt-5">
                {project.gallery?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {project.gallery.map((image, index) => (
                      <div
                        key={`${image.url}-${index}`}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="relative h-56 overflow-hidden bg-slate-100">
                          <Image
                            src={image.url}
                            alt={
                              image.alt ||
                              `${project.title} gallery image ${
                                index + 1
                              }`
                            }
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>

                        <div className="flex items-center gap-2 px-4 py-3">
                          <ImageIcon className="h-4 w-4 text-blue" />

                          <p className="truncate text-xs font-medium text-slate-600">
                            {image.alt || "Project image"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<ImageIcon className="h-6 w-6" />}
                    title="No gallery images"
                    description="There are currently no additional gallery images for this project."
                  />
                )}
              </div>
            </section>

            {/* SEO */}
            <section>
              <SectionHeading
                eyebrow="Discoverability"
                title="SEO & Social"
                description="Search engine and social sharing configuration for this project."
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
                        Metadata used by search engines and social
                        platforms.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-2">
                  <SeoCard
                    label="Meta Title"
                    value={project.seo.metaTitle}
                  />

                  <SeoCard
                    label="OG Title"
                    value={project.seo.ogTitle}
                  />

                  <SeoCard
                    label="Meta Description"
                    value={project.seo.metaDescription}
                  />

                  <SeoCard
                    label="OG Description"
                    value={project.seo.ogDescription}
                  />

                  <SeoCard
                    label="OG Image"
                    value={project.seo.ogImage}
                    link
                  />
                </div>

                <div className="grid gap-4 border-t border-slate-100 bg-slate-50/50 p-5 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Keywords
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.seo.keywords?.length ? (
                        project.seo.keywords.map(
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
                        project.seo.noIndex
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {project.seo.noIndex ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle className="h-3.5 w-3.5" />
                      )}

                      {project.seo.noIndex
                        ? "Search indexing disabled"
                        : "Search indexing enabled"}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TIMELINE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Project Timeline
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-navy">
                    Activity
                  </h3>
                </div>

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
                  <TimelineItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(project.createdAt)}
                  />

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <TimelineItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDate(project.updatedAt)}
                  />

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <TimelineItem
                    icon={<CheckCircle className="h-4 w-4" />}
                    label="Completed"
                    value={formatDate(project.completionDate)}
                  />
                </div>
              </div>
            </section>

            {/* FOOTER */}
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

      <p className="mt-1 truncate text-sm font-semibold text-white/90">
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

function SeoCard({
  label,
  value,
  link = false,
}: {
  label: string;
  value: string;
  link?: boolean;
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
        <p className="mt-2 text-sm leading-6 text-navy">
          {value}
        </p>
      )}
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