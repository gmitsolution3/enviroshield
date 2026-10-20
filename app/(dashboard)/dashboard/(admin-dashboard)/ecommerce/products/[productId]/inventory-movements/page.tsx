import ProductInventoryMovementsDashboard from "@/components/dashboard/admin/ecommerce/products/ProductInventoryMovementsDashboard";
import { requireRole } from "@/lib/auth-guards";
import { notFound } from "next/navigation";

export default async function ProductInventoryMovementsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  await requireRole("admin");
  const { productId } = await params;

  if (!productId.trim()) notFound();

  return (
    <ProductInventoryMovementsDashboard
      key={productId}
      productId={productId}
    />
  );
}
