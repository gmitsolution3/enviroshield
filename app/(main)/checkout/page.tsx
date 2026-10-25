import type { Metadata } from "next";

import CheckoutForm from "@/components/cart/CheckoutForm";
import { requireAuth } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Checkout | Enviroshield",
  description: "Enter your delivery details and place your Enviroshield order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  await requireAuth("/checkout");

  return <CheckoutForm />;
}