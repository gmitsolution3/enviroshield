import OrdersDashboard from "@/components/dashboard/admin/ecommerce/orders/OrdersDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function OrdersPage() {
  await requireRole("admin");

  return <OrdersDashboard />;
}
