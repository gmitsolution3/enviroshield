import type { Metadata } from "next";
import CheckoutSuccessContent from "@/components/cart/CheckoutSuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmation | Enviroshield",
  description: "Your Enviroshield order confirmation.",
  robots: { index: false, follow: false },
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ orderId?: string | string[] }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0] ?? ""
    : params.orderId ?? "";

  return <CheckoutSuccessContent orderId={orderId} />;
}
