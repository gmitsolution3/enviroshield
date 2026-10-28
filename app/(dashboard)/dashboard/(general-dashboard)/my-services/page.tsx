import MyServicesDashboard from "@/components/dashboard/user/services/MyServicesDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function MyServicesPage() {
  await requireRole("user");

  return <MyServicesDashboard />;
}
