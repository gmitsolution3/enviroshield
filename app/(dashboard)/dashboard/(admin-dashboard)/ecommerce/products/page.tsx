import { requireRole } from "@/lib/auth-guards";
import ProductsDashboard from "@/components/dashboard/admin/ecommerce/products/ProductsDashboard";

export default async function ProductsPage() {
  await requireRole("admin");

  return <ProductsDashboard />;
}
