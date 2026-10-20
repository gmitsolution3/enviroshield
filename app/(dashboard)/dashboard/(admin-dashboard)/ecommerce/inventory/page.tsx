
import { requireRole } from "@/lib/auth-guards";
import InventoryDashboard from "@/components/dashboard/admin/ecommerce/inventory/InventoryDashboard";

export default async function InventoryPage() {
  await requireRole("admin");

  return <InventoryDashboard />;
}
