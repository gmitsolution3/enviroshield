import Image from "next/image";
import Link from "next/link";
import { FileText, ImageOff } from "lucide-react";

import { Button } from "@/components/Button";
import AddToCart from "@/components/products/AddToCart";
import { products as staticProducts } from "@/lib/data/content";
import { getProductImageUrl } from "@/lib/products/images";
import { getTrustedTdsUrl } from "@/lib/products/tds";
import type { IPublishedProduct } from "@/types/admin/product.type";

type StaticProduct = (typeof staticProducts)[number];
type ProductCardProduct = IPublishedProduct | StaticProduct;
const CURRENCY = "৳";

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const isPublishedProduct = "primaryImage" in product;
  const name = product.name;
  const slug = product.slug;
  const category = isPublishedProduct ? product.categoryId?.name : product.category;
  const imageUrl = isPublishedProduct ? product.primaryImage?.url : product.image;
  const imageAlt = isPublishedProduct ? product.primaryImage?.alt : `${name} - ${category}`;
  const description = isPublishedProduct ? product.shortDescription : product.description;
  const features = isPublishedProduct ? [] : product.features;
  const sku = isPublishedProduct ? product.sku : "";
  const price = isPublishedProduct ? product.price : null;
  const stockQuantity = isPublishedProduct ? product.stockQuantity : 1;
  const lowStockThreshold = isPublishedProduct ? product.lowStockThreshold : 0;
  const isFeatured = isPublishedProduct && product.isFeatured;
  const tdsUrl = isPublishedProduct ? product.tdsUrl : "";

  const detailsHref = `/products/${slug}`;
  const safeTdsUrl = getTrustedTdsUrl(tdsUrl);
  const safeImageUrl = getProductImageUrl(imageUrl);
  const availableQuantity = Number.isFinite(stockQuantity)
    ? Math.max(0, stockQuantity)
    : 0;
  const threshold = Number.isFinite(lowStockThreshold)
    ? Math.max(0, lowStockThreshold)
    : 0;
  const outOfStock = isPublishedProduct && availableQuantity === 0;
  const lowStock = isPublishedProduct && !outOfStock && availableQuantity <= threshold;

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
            className={`object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 ${outOfStock ? "opacity-60 grayscale" : ""}`}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-ink/30">
            <ImageOff size={40} aria-hidden="true" />
          </span>
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
      </Link>

      <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
        {isFeatured && <span className="rounded-full bg-blue px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(1,110,220,0.35)]">Featured</span>}
        {outOfStock ? (
          <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Out of stock</span>
        ) : lowStock ? (
          <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">Only {availableQuantity} left</span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate rounded-full bg-mist px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-deep">{category}</span>
          {sku && <span className="shrink-0 text-[11px] text-ink/50">SKU: {sku}</span>}
        </div>

        <h3 className="text-[17px] font-bold leading-snug text-navy">
          <Link href={detailsHref} className="transition-colors hover:text-blue">{name}</Link>
        </h3>

        {description && <p className="line-clamp-2 text-sm leading-relaxed text-ink/70">{description}</p>}

        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => <span key={feature} className="rounded-[5px] bg-mist px-2 py-[6px] text-[10px] text-navy">{feature}</span>)}
          </div>
        )}

        {isPublishedProduct && (
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink/50">Price</p>
              <p className="text-[22px] font-extrabold leading-none text-blue">
                {price !== null && Number.isFinite(price) && price >= 0 ? `${CURRENCY}${price.toLocaleString("en-BD")}` : "Contact us"}
              </p>
            </div>
            {safeTdsUrl && (
              <a href={safeTdsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open technical data sheet for ${name} in a new tab`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-blue hover:text-blue">
                <FileText size={14} aria-hidden="true" />
                View TDS
              </a>
            )}
          </div>
        )}

        {isPublishedProduct && (
          <AddToCart product={product} stock={availableQuantity} />
        )}
        <Button href={detailsHref} variant="outline" fullWidth className="mt-2">View details</Button>
      </div>
    </article>
  );
}
