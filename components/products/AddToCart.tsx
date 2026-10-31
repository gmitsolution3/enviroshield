"use client";

import { addToCart } from "@/lib/cart";
import type { IPublishedProduct } from "@/types/product.type";
import { useLenis } from "lenis/react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  product: Pick<
    IPublishedProduct,
    "_id" | "slug" | "sku" | "name" | "price" | "primaryImage"
  >;
  /** Units available. 0 disables the button. */
  stock: number;
};

type CartAddAnimationDetail = {
  sourceRect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  quantity: number;
};

export default function AddToCart({ product, stock }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const outOfStock = stock <= 0;

  const clamp = (n: number) =>
    Math.min(Math.max(1, n), Math.max(1, stock));

  const handleAdd = () => {
    if (outOfStock) return;

    addToCart(
      {
        productId: product._id,
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.primaryImage?.url ?? "",
        imageAlt: product.primaryImage?.alt || product.name,
        stockQuantity: stock,
      },
      qty,
      stock,
    );

    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        force: true,
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }

    const rect = addButtonRef.current?.getBoundingClientRect();

    if (rect) {
      const detail: CartAddAnimationDetail = {
        sourceRect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        quantity: qty,
      };

      window.dispatchEvent(
        new CustomEvent<CartAddAnimationDetail>(
          "cart:add-animation",
          { detail },
        ),
      );
    }

    setAdded(true);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setAdded(false);
    }, 2200);
  };

  const stepBtn =
    "grid size-12 place-items-center text-navy transition-colors hover:bg-blue hover:text-white disabled:cursor-not-allowed disabled:text-ink/30 disabled:hover:bg-transparent disabled:hover:text-ink/30";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch gap-3">
        <div
          role="group"
          aria-label="Quantity"
          className="flex shrink-0 items-center overflow-hidden rounded-full border border-line"
        >
          <button
            type="button"
            onClick={() => setQty((q) => clamp(q - 1))}
            disabled={outOfStock || qty <= 1}
            aria-label="Decrease quantity"
            className={stepBtn}
          >
            <Minus size={16} />
          </button>

          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={Math.max(1, stock)}
            value={qty}
            disabled={outOfStock}
            onChange={(e) =>
              setQty(clamp(Number(e.target.value) || 1))
            }
            aria-label="Quantity"
            className="h-12 w-12 border-0 bg-transparent text-center text-[14px] font-bold tabular-nums text-navy outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />

          <button
            type="button"
            onClick={() => setQty((q) => clamp(q + 1))}
            disabled={outOfStock || qty >= stock}
            aria-label="Increase quantity"
            className={stepBtn}
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          ref={addButtonRef}
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-5 text-[13px] font-bold tracking-[0.01em] text-white shadow-[0_4px_14px_rgba(1,110,220,0.22)] transition-all duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-ink/30 disabled:shadow-none ${
            added
              ? "bg-deep"
              : "bg-blue hover:bg-deep hover:shadow-[0_8px_22px_rgba(1,110,220,0.32)]"
          }`}
        >
          {outOfStock ? (
            "Out of stock"
          ) : added ? (
            <>
              <Check size={17} aria-hidden="true" />
              Added to cart
            </>
          ) : (
            <>
              <ShoppingCart size={17} aria-hidden="true" />
              Add to cart
            </>
          )}
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="min-h-[18px] text-[12px] text-ink/60"
      >
        {added ? `${qty} × ${product.name} added to your cart.` : ""}
      </p>
    </div>
  );
}
