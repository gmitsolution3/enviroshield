import CategoriesDashboard from "@/components/dashboard/admin/ecommerce/categories/CategoriesDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function CategoriesPage() {
  await requireRole("admin");

  return <CategoriesDashboard />;
}
