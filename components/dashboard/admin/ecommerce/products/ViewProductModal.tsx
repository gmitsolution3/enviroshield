"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Package,
  Search,
  Tag,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";


import type { IProduct } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { HeroMeta, InfoCard, OgImagePreview, SectionHeading, SeoCard, TimelineItem } from "../../common/ViewModalUI";
import { ProductDescriptionViewer } from "./ProductDescriptionViewer";
import { MetricCard } from "./ProductMetricCard";

import DashboardButton from "@/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


type ViewProductModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  product: IProduct | null;
};

export default function ViewProductModal({
  isModalOpen,
  setIsModalOpen,
  product,
}: ViewProductModalProps) {
  if (!product) return null;

  const isPublished = product.status === "published";
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock =
    !isOutOfStock && product.stockQuantity <= product.lowStockThreshold;

  const description =
    product.description &&
    typeof product.description === "object" &&
    !Array.isArray(product.description)
      ? product.description
      : {
          type: "doc",
          content: [{ type: "paragraph" }],
        };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-h-[92vh] !max-w-6xl overflow-y-auto border-0 bg-[#f8fafc] p-0 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            View complete product information, description, inventory, technical
            data, and SEO settings.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden">
          {/* HERO */}
          <section className="relative overflow-hidden bg-navy px-6 py-6 text-white sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />

            <div className="relative grid gap-6 lg:grid-cols-[340px_1fr]">
              {/* Primary image */}
              <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
                {product.primaryImage?.url ? (
                  <Image
                    src={product.primaryImage.url}
                    alt={product.primaryImage.alt || product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 340px"
                    unoptimized
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex h-full min-h-[240px] items-center justify-center">
                    <Package className="h-14 w-14 text-white/30" />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-4 pt-12">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                    Primary Product Image
                  </p>
                  {product.primaryImage?.alt && (
                    <p className="mt-1 text-sm text-white/90">
                      {product.primaryImage.alt}
                    </p>
                  )}
                </div>
              </div>

              {/* Product heading */}
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
                      <span className="capitalize">{product.status}</span>
                    </Badge>

                    <Badge
                      className={`gap-1 border-0 ${
                        isOutOfStock
                          ? "bg-red-500/20 text-red-100 hover:bg-red-500/20"
                          : isLowStock
                            ? "bg-amber-500/20 text-amber-100 hover:bg-amber-500/20"
                            : "bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/20"
                      }`}
                    >
                      <Package className="h-3 w-3" />
                      {isOutOfStock
                        ? "Out of stock"
                        : isLowStock
                          ? "Low stock"
                          : "In stock"}
                    </Badge>

                    {product.isFeatured && (
                      <Badge className="gap-1 border-0 bg-blue/20 text-blue-100 hover:bg-blue/20">
                        <Tag className="h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                    Ecommerce / Product
                  </p>

                  <h2 className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-4xl">
                    {product.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
                    <span className="break-all font-mono">
                      SKU: {product.sku}
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
                    <span className="break-all font-mono">/{product.slug}</span>
                  </div>

                  {product.shortDescription && (
                    <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70 sm:text-[15px]">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Hero metadata */}
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <HeroMeta
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(product.createdAt)}
                  />
                  <HeroMeta
                    icon={<Clock className="h-4 w-4" />}
                    label="Updated"
                    value={formatDate(product.updatedAt)}
                  />
                  <HeroMeta
                    icon={<Globe className="h-4 w-4" />}
                    label="Published"
                    value={
                      product.publishedAt
                        ? formatDate(product.publishedAt)
                        : "Not published"
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-6 p-5 sm:p-8">
            {/* PRODUCT INFORMATION */}
            <section>
              <SectionHeading
                eyebrow="Overview"
                title="Product Information"
                description="Product identity, category, pricing, and inventory details."
              />

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  label="Product Name"
                  value={product.name}
                  icon={<Package className="h-4 w-4" />}
                />

                <InfoCard
                  label="SKU"
                  value={product.sku || "Not provided"}
                  mono
                />

                <InfoCard
                  label="Category"
                  value={product.categoryId?.name || "Uncategorized"}
                  icon={<Tag className="h-4 w-4" />}
                />

                <InfoCard label="Slug" value={product.slug} mono />

                <InfoCard label="Product ID" value={product._id} mono />

                <InfoCard
                  label="Weight"
                  value={`${product.weight ?? 0} kg`}
                  icon={<Truck className="h-4 w-4" />}
                />
              </div>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Short Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {product.shortDescription || "No short description provided."}
                </p>
              </div>
            </section>

            {/* PRICING AND INVENTORY */}
            <section>
              <SectionHeading
                eyebrow="Commerce"
                title="Pricing & Inventory"
                description="Current selling price, cost, and stock availability."
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Selling Price"
                  value={`৳${(product.price ?? 0).toLocaleString("en-BD")}`}
                  detail="Current product price"
                  accent="blue"
                />

                <MetricCard
                  label="Cost Price"
                  value={`৳${(product.costPrice ?? 0).toLocaleString("en-BD")}`}
                  detail="Product cost"
                  accent="gray"
                />

                <MetricCard
                  label="Available Stock"
                  value={`${product.stockQuantity ?? 0}`}
                  detail="Units available"
                  accent={isOutOfStock ? "red" : isLowStock ? "amber" : "green"}
                />

                <MetricCard
                  label="Low Stock Threshold"
                  value={`${product.lowStockThreshold ?? 0}`}
                  detail="Low-stock alert level"
                  accent="amber"
                />
              </div>
            </section>

            {/* GALLERY */}
            <section>
              <SectionHeading
                eyebrow="Media"
                title="Product Gallery"
                description="Additional images associated with this product."
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {product.gallery?.length ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {product.gallery.map((image, index) => (
                      <a
                        key={`${image.publicId || image.url}-${index}`}
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-shadow hover:shadow-md"
                      >
                        <div className="relative aspect-square">
                          {image.url ? (
                            <Image
                              src={image.url}
                              alt={
                                image.alt ||
                                `${product.name} image ${index + 1}`
                              }
                              fill
                              sizes="(max-width: 640px) 50vw, 25vw"
                              unoptimized
                              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-2">
                          <p className="truncate text-xs text-slate-500">
                            {image.alt || `Image ${index + 1}`}
                          </p>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <EmptyMessage message="No additional product images have been added." />
                )}
              </div>
            </section>

            {/* RICH TEXT DESCRIPTION */}
            <section>
              <SectionHeading
                eyebrow="Product Details"
                title="Full Description"
                description="Complete product content rendered from the rich text editor."
              />

              <div className="mt-5">
                <ProductDescriptionViewer content={description} />
              </div>
            </section>

            {/* TECHNICAL DATA SHEET */}
            <section>
              <SectionHeading
                eyebrow="Documentation"
                title="Technical Data Sheet"
                description="Technical documentation associated with this product."
              />

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {product.tdsUrl ? (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy">
                          Technical Data Sheet
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          Product technical documentation
                        </p>
                      </div>
                    </div>

                    <a
                      href={product.tdsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-blue/30 px-4 text-xs font-semibold text-navy transition-colors hover:bg-blue/5 hover:text-blue"
                    >
                      View document
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ) : (
                  <EmptyMessage message="No technical data sheet has been uploaded." />
                )}
              </div>
            </section>

            {/* SEO */}
            {product.seo && (
              <section>
                <SectionHeading
                  eyebrow="Discoverability"
                  title="SEO & Social"
                  description="Search engine metadata and social sharing configuration."
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
                          Metadata for search engines and social platforms.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <SeoCard label="Meta Title" value={product.seo.metaTitle} />
                    <SeoCard label="OG Title" value={product.seo.ogTitle} />
                    <SeoCard
                      label="Meta Description"
                      value={product.seo.metaDescription}
                    />
                    <SeoCard
                      label="OG Description"
                      value={product.seo.ogDescription}
                    />

                    <OgImagePreview value={product.seo.ogImage} />
                  </div>

                  <div className="grid gap-4 border-t border-slate-100 bg-slate-50/50 p-5 md:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Keywords
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.seo.keywords?.length ? (
                          product.seo.keywords.map((keyword, index) => (
                            <span
                              key={`${keyword}-${index}`}
                              className="rounded-full border border-blue/15 bg-blue/5 px-3 py-1.5 text-xs font-medium text-blue"
                            >
                              {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">
                            No keywords provided.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          product.seo.noIndex
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {product.seo.noIndex ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        {product.seo.noIndex
                          ? "Search indexing disabled"
                          : "Search indexing enabled"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TIMELINE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Product Timeline
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-navy">
                    Record Activity
                  </h3>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <TimelineItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Created"
                    value={formatDate(product.createdAt)}
                  />

                  <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                  <TimelineItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDate(product.updatedAt)}
                  />

                  {product.publishedAt && (
                    <>
                      <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                      <TimelineItem
                        icon={<Globe className="h-4 w-4" />}
                        label="Published"
                        value={formatDate(product.publishedAt)}
                      />
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <div className="flex justify-end border-t border-slate-200 pt-5">
              <DashboardButton
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-10 rounded-full border-blue/30 bg-white px-6 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:bg-blue/5 hover:text-blue"
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
   RICH TEXT DESCRIPTION VIEWER
=============================================================== */

function EmptyMessage({ message }: { message: string }) {
  return <p className="text-sm text-slate-500">{message}</p>;
}
