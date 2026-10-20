"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { getProductImageUrl } from "@/lib/products/images";

const money = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

export default function CartDrawer({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { items, count, subtotal, setQuantity, removeItem } = useCart();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab") {
        const root = document.getElementById("cart-drawer");
        const focusable = root?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart preview"
            className="fixed inset-0 z-[60] cursor-default bg-navy/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="fixed inset-y-0 right-0 z-[61] flex h-dvh w-full max-w-[460px] flex-col border-l border-line bg-white shadow-[-16px_0_50px_rgba(0,51,78,0.18)] max-[600px]:max-w-none"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-line px-6 py-5">
              <div>
                <h2 id="cart-drawer-title" className="text-xl font-extrabold text-navy">Your cart</h2>
                <p className="mt-1 text-sm text-ink/60">{count} {count === 1 ? "item" : "items"}</p>
              </div>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close cart" className="grid size-10 place-items-center rounded-full border border-line text-navy transition-colors hover:border-blue hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-mist text-blue"><ShoppingBag size={28} aria-hidden="true" /></span>
                <h3 className="mt-5 text-lg font-bold text-navy">Your cart is empty</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-ink/65">Browse our product catalogue and add something for your next project.</p>
                <Link href="/products" onClick={onClose} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Browse products <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            ) : (
              <>
                <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-6">
                  {items.map((item) => {
                    const image = getProductImageUrl(item.image);
                    return (
                      <li key={item.productId} className="flex gap-4 py-5">
                        <Link href={`/products/${item.slug}`} onClick={onClose} className="relative size-[76px] shrink-0 overflow-hidden rounded-xl bg-mist" aria-label={`View ${item.name}`}>
                          {image ? <Image src={image} alt={item.imageAlt || item.name} fill sizes="76px" className="object-cover" /> : <span className="grid h-full place-items-center text-xs text-ink/50">No image</span>}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link href={`/products/${item.slug}`} onClick={onClose} className="line-clamp-2 text-sm font-bold leading-5 text-navy hover:text-blue">{item.name}</Link>
                              {item.sku && <p className="mt-1 text-xs text-ink/55">SKU: {item.sku}</p>}
                            </div>
                            <button type="button" onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.name} from cart`} className="grid size-8 shrink-0 place-items-center rounded-full text-ink/50 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-blue"><Trash2 size={15} aria-hidden="true" /></button>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex h-9 items-center overflow-hidden rounded-full border border-line">
                              <button type="button" onClick={() => setQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Decrease ${item.name} quantity`} className="grid size-9 place-items-center text-navy hover:bg-mist disabled:opacity-40"><Minus size={14} /></button>
                              <span className="min-w-8 text-center text-sm font-bold tabular-nums text-navy" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                              <button type="button" onClick={() => setQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= (item.stockQuantity ?? 99) || item.quantity >= 99} aria-label={`Increase ${item.name} quantity`} className="grid size-9 place-items-center text-navy hover:bg-mist disabled:opacity-40"><Plus size={14} /></button>
                            </div>
                            <span className="text-sm font-extrabold tabular-nums text-navy">{money(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <footer className="shrink-0 border-t border-line bg-white px-6 pb-6 pt-5">
                  <div className="flex items-center justify-between text-sm"><span className="text-ink/65">Subtotal</span><span className="text-lg font-extrabold tabular-nums text-navy">{money(subtotal)}</span></div>
                  <p className="mt-2 text-xs leading-5 text-ink/55">Delivery is calculated at checkout. Final prices are confirmed when your order is placed.</p>
                  <Link href="/cart" onClick={onClose} className="mt-5 flex min-h-12 items-center justify-center rounded-full border border-blue text-sm font-bold text-blue transition-colors hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">View cart</Link>
                  <Link href="/checkout" onClick={onClose} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue text-sm font-bold text-white transition-colors hover:bg-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">Proceed to checkout <ArrowRight size={16} aria-hidden="true" /></Link>
                  <button type="button" onClick={onClose} className="mt-3 w-full py-2 text-sm font-semibold text-ink/65 underline decoration-transparent underline-offset-4 hover:text-blue hover:decoration-current">Continue shopping</button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
