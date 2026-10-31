"use client";
import { formatTaka } from "@/lib/utils";

import { useCart } from "@/components/cart/CartProvider";
import type { CartItem } from "@/lib/cart";
import { getProductImageUrl } from "@/lib/products/images";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const money = formatTaka;

export default function CartItemRow({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart();
  const image = getProductImageUrl(item.image);

  return (
    <article className="flex gap-5 border-b border-line py-6 max-[600px]:gap-3">
      <Link
        href={`/products/${item.slug}`}
        className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-mist max-[600px]:size-[88px]"
        aria-label={`View ${item.name}`}
      >
        {image ? (
          <Image
            src={image}
            alt={item.imageAlt || item.name}
            fill
            sizes="(max-width: 600px) 88px, 112px"
            className="object-cover"
          />
        ) : (
          <span className="grid h-full place-items-center text-xs text-ink/50">
            No image
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="text-base font-bold text-navy transition-colors hover:text-blue max-[600px]:text-sm"
            >
              {item.name}
            </Link>
            {item.sku && (
              <p className="mt-1 text-xs text-ink/55">
                SKU: {item.sku}
              </p>
            )}
            <p className="mt-2 text-sm font-semibold text-blue">
              {money(item.price)}{" "}
              <span className="font-normal text-ink/55">each</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink/55 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-blue"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex h-10 items-center overflow-hidden rounded-full border border-line">
            <button
              type="button"
              onClick={() =>
                setQuantity(item.productId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              aria-label={`Decrease ${item.name} quantity`}
              className="grid size-10 place-items-center text-navy transition-colors hover:bg-mist disabled:opacity-40"
            >
              <Minus size={15} />
            </button>
            <span className="min-w-9 text-center text-sm font-bold tabular-nums text-navy">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity(item.productId, item.quantity + 1)
              }
              disabled={
                item.quantity >= (item.stockQuantity ?? 99) ||
                item.quantity >= 99
              }
              aria-label={`Increase ${item.name} quantity`}
              className="grid size-10 place-items-center text-navy transition-colors hover:bg-mist disabled:opacity-40"
            >
              <Plus size={15} />
            </button>
          </div>
          <p className="text-base font-extrabold tabular-nums text-navy">
            {money(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </article>
  );
}
