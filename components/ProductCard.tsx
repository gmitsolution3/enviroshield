import Image from "next/image";
import Link from "next/link";
import { FileText, ImageOff } from "lucide-react";
import { Button } from "@/components/Button";
import type { IPublishedProduct } from "@/types/product.type"; // adjust path if yours differs

const CURRENCY = "৳";

export function ProductCard({ product }: { product: IPublishedProduct }) {
  const {
    name,
    slug,
    sku,
    shortDescription,
    primaryImage,
    price,
    stockQuantity,
    lowStockThreshold,
    isFeatured,
    tdsUrl,
    categoryId,
  } = product;

  const detailsHref = `/products/${slug}`;
  const outOfStock = stockQuantity <= 0;
  const lowStock = !outOfStock && stockQuantity <= lowStockThreshold;

  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:border-blue/30 hover:shadow-[0_18px_40px_rgba(0,51,78,0.12)]">
      {/* ---------- Image ---------- */}
      <Link
        href={detailsHref}
        aria-label={`View ${name}`}
        className="relative block aspect-[4/3] overflow-hidden bg-mist"
      >
        {primaryImage?.url ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-ink/30">
            <ImageOff size={40} />
          </span>
        )}

        {/* soft gradient so the badges stay readable */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent"
        />
      </Link>

      {/* ---------- Badges ---------- */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
        {isFeatured && (
          <span className="rounded-full bg-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(1,110,220,0.35)]">
            Featured
          </span>
        )}
        {outOfStock ? (
          <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Out of stock
          </span>
        ) : lowStock ? (
          <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Only {stockQuantity} left
          </span>
        ) : null}
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate rounded-full bg-mist px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-deep">
            {categoryId?.name}
          </span>
          {sku && <span className="shrink-0 text-[11px] text-ink/50">SKU: {sku}</span>}
        </div>

        <h3 className="text-[17px] font-bold leading-snug text-navy">
          <Link href={detailsHref} className="transition-colors hover:text-blue">
            {name}
          </Link>
        </h3>

        {shortDescription && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink/70">{shortDescription}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink/50">Price</p>
            <p className="text-[22px] font-extrabold leading-none text-blue">
              {CURRENCY}
              {price.toLocaleString()}
            </p>
          </div>

          {tdsUrl && (
            <a
              href={tdsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-blue hover:text-blue"
            >
              <FileText size={14} />
              TDS
            </a>
          )}
        </div>

        <Button href={detailsHref} variant="outline" fullWidth className="mt-2">
          View details
        </Button>
      </div>
    </article>
  );
}