import type { Metadata } from "next";
import CheckoutForm from "@/components/cart/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Enviroshield",
  description: "Enter your delivery details and place your Enviroshield order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
