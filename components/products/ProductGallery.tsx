"use client";

import { ChevronLeft, ChevronRight, Maximize2, Package, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IProductImage } from "@/types/product.type";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProductGallery({
  images,
  name,
}: {
  images: Pick<IProductImage, "url" | "alt">[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const current = images[active];

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + count) % count),
    [count],
  );

  // Lightbox: keyboard, scroll lock, focus
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
          'button:not([disabled])',
        );
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open, go]);

  if (!current) {
    return (
      <div className="grid aspect-[4/4.2] place-items-center rounded-[16px] border border-line bg-muted text-ink/50">
        <Package size={48} />
      </div>
    );
  }

  const arrowBtn =
    "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center border border-line bg-white text-navy transition-colors hover:border-blue hover:bg-blue hover:text-white";

  return (
    <>
      <div
        className="flex gap-4 max-[700px]:flex-col-reverse"
        onKeyDown={(e) => {
          if (count < 2 || open) return;
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        {/* Thumbnails */}
        {count > 1 && (
          <ul
            aria-label="Product gallery"
            className="flex shrink-0 gap-3 overflow-auto [scrollbar-width:none] min-[701px]:max-h-[560px] min-[701px]:w-[76px] min-[701px]:flex-col [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, i) => (
              <li key={img.url + i} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1} of ${count}`}
                  aria-current={i === active ? "true" : undefined}
                  className={`relative block size-[76px] overflow-hidden rounded-[10px] border-2 bg-white transition-colors duration-200 max-[700px]:size-16 ${
                    i === active ? "border-blue" : "border-line hover:border-ink/40"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${name} image ${i + 1}`}
                    fill
                    sizes="76px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Main image */}
        <div className="group/gallery relative aspect-[4/4.2] min-w-0 flex-1 min-[701px]:self-start overflow-hidden rounded-[16px] border border-line bg-white">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseLeave={() => setZoom(null)}
            aria-label="Open image full screen"
            className="absolute inset-0 cursor-zoom-in"
          >
            <Image
              key={current.url}
              src={current.url}
              alt={current.alt || name}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 45vw"
              className="animate-in fade-in object-cover duration-500 motion-reduce:animate-none"
              style={{
                transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "50% 50%",
                transform: zoom ? "scale(1.9)" : "scale(1)",
                transition: zoom ? "transform 150ms ease-out" : "transform 300ms ease-out",
              }}
            />
          </button>

          {/* counter */}
          {count > 1 && (
            <span className="pointer-events-none absolute bottom-0 left-0 bg-white px-3 py-1.5 text-[12px] font-bold tabular-nums tracking-wider text-navy">
              {pad(active + 1)} <span className="text-ink/40">/ {pad(count)}</span>
            </span>
          )}

          {/* expand */}
          <span className="pointer-events-none absolute right-3 top-3 grid size-9 place-items-center border border-line bg-white text-navy">
            <Maximize2 size={15} aria-hidden="true" />
          </span>

          {/* arrows */}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className={`${arrowBtn} left-0 border-l-0 opacity-0 transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100 max-[900px]:opacity-100`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className={`${arrowBtn} right-0 border-r-0 opacity-0 transition-opacity group-hover/gallery:opacity-100 focus-visible:opacity-100 max-[900px]:opacity-100`}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image viewer`}
          className="fixed inset-0 z-[100] flex flex-col bg-navy/95"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <p className="truncate pr-4 text-[14px] font-bold">{name}</p>
            <div className="flex items-center gap-4">
              {count > 1 && (
                <span className="text-[13px] tabular-nums text-white/70">
                  {pad(active + 1)} / {pad(count)}
                </span>
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid size-10 place-items-center border border-white/30 transition-colors hover:bg-white hover:text-navy"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <Image
              key={current.url}
              src={current.url}
              alt={current.alt || name}
              fill
              sizes="100vw"
              className="object-contain p-4 min-[701px]:p-12"
            />

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-white/30 text-white transition-colors hover:bg-white hover:text-navy"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-white/30 text-white transition-colors hover:bg-white hover:text-navy"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
