import type { Metadata } from "next";
import CartPageContent from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Your Cart | Enviroshield",
  description: "Review the products in your Enviroshield cart.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageContent />;
}
