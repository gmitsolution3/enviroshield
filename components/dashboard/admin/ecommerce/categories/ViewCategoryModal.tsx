"use client";

import {
  Calendar,
  Clock,
  Copy,
  FolderTree,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

import type { ICategory } from "@/types";
import { formatDate } from "@/utils/formatDate";

import DashboardButton from "@/components/dashboard/DashboardButton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ViewCategoryModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  category: ICategory | null;
};

export default function ViewCategoryModal({
  isModalOpen,
  setIsModalOpen,
  category,
}: ViewCategoryModalProps) {
  if (!category) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(category._id);
      toast.success("Category ID copied.");
    } catch {
      toast.error("Unable to copy category ID.");
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto border-0 bg-[#f8fafc] p-0 shadow-2xl sm:max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>
            View the details and timestamps for this category.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <section className="relative overflow-hidden bg-navy px-6 py-7 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-blue/10 blur-3xl" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-blue-200">
              <FolderTree className="h-6 w-6" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Ecommerce / Categories
            </p>

            <h2 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">
              {category.name}
            </h2>

            <p className="mt-3 break-all font-mono text-sm text-white/60">
              /{category.slug}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <HeroMeta
                icon={<Calendar className="h-4 w-4" />}
                label="Created"
                value={formatDate(category.createdAt)}
              />

              <HeroMeta
                icon={<Clock className="h-4 w-4" />}
                label="Last Updated"
                value={formatDate(category.updatedAt)}
              />
            </div>
          </div>
        </section>

        {/* Details */}
        <div className="space-y-5 p-5 sm:p-8">
          <section>
            <div className="flex items-start gap-4">
              <div className="mt-0.5 h-9 w-1 shrink-0 rounded-full bg-blue" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue">
                  Overview
                </p>

                <h3 className="mt-1 text-xl font-bold tracking-tight text-navy">
                  Category Information
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Basic information stored for this category.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<FolderTree className="h-4 w-4" />}
                label="Category Name"
                value={category.name}
              />

              <InfoCard
                icon={<Hash className="h-4 w-4" />}
                label="Slug"
                value={category.slug}
                mono
              />
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Category ID
                  </p>

                  <p className="mt-2 break-all font-mono text-xs leading-6 text-slate-600">
                    {category._id}
                  </p>
                </div>

                <DashboardButton
                  type="button"
                  variant="outline"
                  icon={<Copy className="h-4 w-4" />}
                  onClick={handleCopyId}
                  className="h-9 shrink-0 rounded-full border-blue/30 bg-white px-4 text-xs font-semibold text-navy hover:bg-blue/5 hover:text-blue"
                >
                  Copy ID
                </DashboardButton>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Record Timeline
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TimelineItem
                icon={<Calendar className="h-4 w-4" />}
                label="Created"
                value={formatDate(category.createdAt)}
              />

              <TimelineItem
                icon={<Clock className="h-4 w-4" />}
                label="Last Updated"
                value={formatDate(category.updatedAt)}
              />
            </div>
          </section>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <DashboardButton
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 rounded-full border-blue/30 bg-white px-6 text-sm font-semibold text-navy shadow-sm hover:bg-blue/5 hover:text-blue"
            >
              Close
            </DashboardButton>
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
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-2 text-white/50">
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

function InfoCard({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
          {icon}
        </div>

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
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-navy">
          {value}
        </p>
      </div>
    </div>
  );
}
