import { FileText, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/Button";
import { getProductImageUrl } from "@/lib/products/images";
import { getTrustedTdsUrl } from "@/lib/products/tds";
import type { IPublishedProduct } from "@/types/product.type";

const CURRENCY = "৳";

export function ProductCard({
  product,
}: {
  product: IPublishedProduct;
}) {
  const name = product.name;
  const slug = product.slug;
  const category = product.categoryId?.name || "Product";
  const imageUrl = product.primaryImage?.url;
  const imageAlt = product.primaryImage?.alt || name;
  const description = product.shortDescription;
  const sku = product.sku;
  const price = product.price;
  const stockQuantity = product.stockQuantity;
  const lowStockThreshold = product.lowStockThreshold;
  const isFeatured = product.isFeatured;
  const tdsUrl = product.tdsUrl;

  const detailsHref = `/products/${slug}`;
  const safeTdsUrl = getTrustedTdsUrl(tdsUrl);
  const safeImageUrl = getProductImageUrl(imageUrl);

  const availableQuantity = Number.isFinite(stockQuantity)
    ? Math.max(0, stockQuantity)
    : 0;

  const threshold = Number.isFinite(lowStockThreshold)
    ? Math.max(0, lowStockThreshold)
    : 0;

  const outOfStock = availableQuantity === 0;
  const lowStock =
    !outOfStock && availableQuantity <= threshold;

  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:border-blue/30 hover:shadow-[0_18px_40px_rgba(0,51,78,0.12)]">
      <Link
        href={detailsHref}
        aria-label={`View ${name}`}
        className="relative block aspect-[4/3] overflow-hidden bg-mist"
      >
        {safeImageUrl ? (
          <Image
            src={safeImageUrl}
            alt={imageAlt || name}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-ink/30">
            <ImageOff size={40} aria-hidden="true" />
          </span>
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent"
        />
      </Link>

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
            Only {availableQuantity} left
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate rounded-full bg-mist px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-deep">
            {category}
          </span>

          {sku && (
            <span className="shrink-0 text-[11px] text-ink/50">
              SKU: {sku}
            </span>
          )}
        </div>

        <h3 className="text-[17px] font-bold leading-snug text-navy">
          <Link
            href={detailsHref}
            className="transition-colors hover:text-blue"
          >
            {name}
          </Link>
        </h3>

        {description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink/70">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink/50">
              Price
            </p>

            <p className="text-[22px] font-extrabold leading-none text-blue">
              {price !== null &&
              Number.isFinite(price) &&
              price >= 0
                ? `${CURRENCY}${price.toLocaleString("en-BD")}`
                : "Contact us"}
            </p>
          </div>

          {safeTdsUrl && (
            <a
              href={safeTdsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open technical data sheet for ${name} in a new tab`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-blue hover:text-blue"
            >
              <FileText size={14} aria-hidden="true" />
              View TDS
            </a>
          )}
        </div>

        <Button
          href={detailsHref}
          variant="outline"
          fullWidth
          className="mt-2"
        >
          View details
        </Button>
      </div>
    </article>
  );
}