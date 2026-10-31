import { ExternalLink } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

/* ===============================================================
   HERO META
=============================================================== */

export function HeroMeta({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
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
      <p className="mt-1 text-sm font-semibold text-white/90">{value}</p>
    </div>
  );
}

/* ===============================================================
   SECTION HEADING
=============================================================== */

export function SectionHeading({
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
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* ===============================================================
   INFO CARD
=============================================================== */

export function InfoCard({
  label,
  value,
  icon,
  accent = "blue",
  mono = false,
  capitalize = false,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
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
   SEO CARD
=============================================================== */

export function SeoCard({
  label,
  value,
  link = false,
  large = false,
}: {
  label: string;
  value?: string;
  link?: boolean;
  large?: boolean;
}) {
  const displayValue = value || "Not provided";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>
      {link && value ? (
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
          className={`mt-2 break-words leading-6 text-navy ${
            large ? "text-base font-semibold" : "text-sm"
          }`}
        >
          {displayValue}
        </p>
      )}
    </div>
  );
}

/* ===============================================================
   OG IMAGE PREVIEW
=============================================================== */

export function OgImagePreview({
  value,
  label = "OG Image",
}: {
  value?: string;
  label?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
        {label}
      </p>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-3 block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          aria-label={`Open ${label} in a new tab`}
        >
          <div className="relative aspect-[1200/630] w-full">
            <Image
              src={value}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              unoptimized
            />
          </div>
        </a>
      ) : (
        <div className="mt-3 flex aspect-[1200/630] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
          No OG image provided
        </div>
      )}
    </div>
  );
}

/* ===============================================================
   TIMELINE ITEM
=============================================================== */

export function TimelineItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
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
        <p className="mt-0.5 text-sm font-semibold text-navy">{value}</p>
      </div>
    </div>
  );
}

/* ===============================================================
   EMPTY STATE
=============================================================== */

export function ModalEmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold text-navy">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

