"use client";

import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import Container from "../Container";

type TopHeaderBarProps = {
  onCartClick: () => void;
  cartOpen: boolean;
  cartTriggerRef: React.RefObject<HTMLButtonElement | null>;
};

export default function TopHeaderBar({
  onCartClick,
  cartOpen,
  cartTriggerRef,
}: TopHeaderBarProps) {
  const { count } = useCart();

  return (
    <div className="hidden h-[38px] border-b border-[#e9eef1] bg-white text-[13px] text-ink min-[901px]:block">
      <Container className="flex h-full items-center justify-between">
        <span className="flex items-center gap-[7px] font-normal">
          <MapPin size={14} aria-hidden="true" />
          House No: 22/13-15, Block-B, Bauniabad R/A, Mirpur 11,
          Pallabi, Dhaka 1216
        </span>

        <div className="flex h-full items-center gap-5">
          <span className="flex items-center gap-6">
            <a
              href="mailto:enviroshield.bd@gmail.com"
              className="flex items-center gap-[7px]"
            >
              <Mail size={14} aria-hidden="true" />
              enviroshield.bd@gmail.com
            </a>

            <a
              href="tel:+8801613220101"
              className="flex items-center gap-[7px]"
            >
              <Phone size={14} aria-hidden="true" />
              +8801613220101
            </a>
          </span>

          <span className="h-4 w-px bg-[#e9eef1]" aria-hidden="true" />

          <button
            ref={cartTriggerRef}
            type="button"
            onClick={onCartClick}
            aria-label={`Open cart${count ? `, ${count} ${count === 1 ? "item" : "items"}` : ", empty"}`}
            aria-haspopup="dialog"
            aria-expanded={cartOpen}
            className="relative inline-grid size-7 shrink-0 place-items-center rounded-full text-navy transition-colors hover:bg-mist hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            <ShoppingBag size={17} aria-hidden="true" />

            {count > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 grid min-w-[16px] place-items-center rounded-full bg-blue px-1 text-[9px] font-bold leading-4 text-white"
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        </div>
      </Container>
    </div>
  );
}