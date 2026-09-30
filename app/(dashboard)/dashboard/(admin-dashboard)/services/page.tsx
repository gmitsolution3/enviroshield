import { requireRole } from "@/lib/auth-guards";
import ServicesDashboard from "@/components/dashboard/admin/services/ServicesDashboard";

export default async function ServicesPage() {
  await requireRole("admin");

  return <ServicesDashboard />;
}
