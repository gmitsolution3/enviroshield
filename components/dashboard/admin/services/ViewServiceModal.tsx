"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  ImageIcon,
  Star,
  XCircle,
} from "lucide-react";
import Image from "next/image";

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

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] !max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>

          <DialogDescription>
            View complete information about this Enviroshield service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Header */}
          <div className="flex flex-col gap-5 rounded-xl border bg-muted/20 p-5 md:flex-row">
            <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-xl border bg-muted md:h-44 md:w-64">
              {service.primaryImage?.url ? (
                <Image
                  src={service.primaryImage.url}
                  alt={service.primaryImage.alt || service.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    service.status === "published"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    service.status === "published"
                      ? "gap-1 bg-green-500 hover:bg-green-600"
                      : "gap-1"
                  }
                >
                  {service.status === "published" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}

                  {service.status}
                </Badge>

                {service.isFeatured && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-amber-300 bg-amber-50 text-amber-600"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>

              <h3 className="mt-3 text-2xl font-bold tracking-tight text-navy">
                {service.name}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                /services/{service.slug}
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                {service.description}
              </p>

              {service.primaryImage.caption && (
                <p className="mt-3 text-xs italic text-muted-foreground">
                  {service.primaryImage.caption}
                </p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <DetailSection
            title="Basic Information"
            description="General information about this service."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard label="Service Name" value={service.name} />

              <DetailCard label="Slug" value={service.slug} />

              <DetailCard
                label="Detail Heading"
                value={service.detailHeading}
              />

              <DetailCard
                label="Status"
                value={service.status}
                capitalize
              />

              <DetailCard
                label="Featured"
                value={service.isFeatured ? "Yes" : "No"}
              />

              <DetailCard
                label="Service ID"
                value={service._id}
                mono
              />
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Description
              </p>

              <p className="text-sm leading-6 text-navy">
                {service.description}
              </p>
            </div>
          </DetailSection>

          {/* Why Enviroshield */}
          <ContentSection
            title="Why Enviroshield"
            description="The reasons and advantages presented for choosing Enviroshield."
            section={service.whyEnviroshield}
          />

          {/* Process */}
          <ContentSection
            title="Process"
            description="The process used to deliver this service."
            section={service.process}
          />

          {/* Benefits */}
          <ContentSection
            title="Benefits"
            description="The key benefits associated with this service."
            section={service.benefits}
          />

          {/* Projects */}
          <DetailSection
            title="Projects"
            description={`${service.projects?.length || 0} project${
              service.projects?.length === 1 ? "" : "s"
            } associated with this service.`}
          >
            {service.projects?.length ? (
              <div className="space-y-4">
                {service.projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-xl border bg-background p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg border bg-muted md:w-56">
                        {project.primaryImage?.url ? (
                          <Image
                            src={project.primaryImage.url}
                            alt={
                              project.primaryImage.alt ||
                              project.title
                            }
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-navy">
                            {project.title}
                          </h4>

                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {project.status}
                          </Badge>

                          {project.isFeatured && (
                            <Badge
                              variant="outline"
                              className="gap-1 border-amber-300 bg-amber-50 text-xs text-amber-600"
                            >
                              <Star className="h-3 w-3 fill-current" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {project.description}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Location
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {project.location.city},{" "}
                              {project.location.area},{" "}
                              {project.location.country}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Completion Date
                            </p>

                            <p className="mt-1 text-sm font-medium">
                              {formatDate(project.completionDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No projects are associated with this service.
                </p>
              </div>
            )}
          </DetailSection>

          {/* SEO */}
          {service.seo && (
            <DetailSection
              title="SEO"
              description="Search engine and social sharing configuration."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard
                  label="Meta Title"
                  value={service.seo.metaTitle}
                />

                <DetailCard
                  label="OG Title"
                  value={service.seo.ogTitle}
                />

                <DetailCard
                  label="Canonical URL"
                  value={service.seo.canonicalUrl}
                  link
                />

                <DetailCard
                  label="OG Image"
                  value={service.seo.ogImage}
                  link
                />

                <DetailCard
                  label="No Index"
                  value={service.seo.noIndex ? "Yes" : "No"}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextDetailCard
                  label="Meta Description"
                  value={service.seo.metaDescription}
                />

                <TextDetailCard
                  label="OG Description"
                  value={service.seo.ogDescription}
                />
              </div>

              <div className="rounded-lg border p-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Keywords
                </p>

                <div className="flex flex-wrap gap-2">
                  {service.seo.keywords?.length ? (
                    service.seo.keywords.map((keyword, index) => (
                      <Badge
                        key={`${keyword}-${index}`}
                        variant="secondary"
                      >
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No keywords
                    </span>
                  )}
                </div>
              </div>
            </DetailSection>
          )}

          {/* Dates */}
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />

                <span>
                  Created:{" "}
                  <span className="font-medium text-navy">
                    {formatDate(service.createdAt)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />

                <span>
                  Updated:{" "}
                  <span className="font-medium text-navy">
                    {formatDate(service.updatedAt)}
                  </span>
                </span>
              </div>

              {service.publishedAt && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />

                  <span>
                    Published:{" "}
                    <span className="font-medium text-navy">
                      {formatDate(service.publishedAt)}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t pt-5">
            <DashboardButton
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 rounded-full border-blue/30 bg-muted/30 px-5 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:border-blue/30 hover:bg-blue/10 hover:text-blue hover:shadow-md"
            >
              Close
            </DashboardButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 rounded-xl border bg-muted/20 p-5">
      <div>
        <h3 className="text-base font-semibold text-navy">{title}</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

function DetailCard({
  label,
  value,
  mono = false,
  capitalize = false,
  link = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  capitalize?: boolean;
  link?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="mb-1 text-xs font-medium text-muted-foreground">
        {label}
      </p>

      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 break-all text-sm font-medium text-blue hover:underline"
        >
          {value}
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <p
          className={`break-words text-sm font-medium ${
            mono ? "font-mono" : ""
          } ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function TextDetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {label}
      </p>

      <p className="text-sm leading-6 text-navy">{value}</p>
    </div>
  );
}

function ContentSection({
  title,
  description,
  section,
}: {
  title: string;
  description: string;
  section: IService["whyEnviroshield"];
}) {
  return (
    <DetailSection title={title} description={description}>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Section Image */}
        <div>
          <div className="relative h-52 w-full overflow-hidden rounded-xl border bg-muted">
            {section?.image?.url ? (
              <Image
                src={section.image.url}
                alt={section.image.alt || title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>

          {section?.image?.caption && (
            <p className="mt-2 text-xs italic text-muted-foreground">
              {section.image.caption}
            </p>
          )}

          {section?.image?.alt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Alt: {section.image.alt}
            </p>
          )}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {section?.items?.length ? (
            section.items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-lg border bg-background p-4"
              >
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue/10 text-xs font-bold text-blue">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-navy">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No content items available.
              </p>
            </div>
          )}
        </div>
      </div>
    </DetailSection>
  );
}
