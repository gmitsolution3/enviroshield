import type { Metadata } from "next";
import CheckoutSuccessContent from "@/components/cart/CheckoutSuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmation | Enviroshield",
  description: "Your Enviroshield order confirmation.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessContent />;
}
