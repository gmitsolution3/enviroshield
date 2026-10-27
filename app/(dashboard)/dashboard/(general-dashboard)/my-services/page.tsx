import MyServicesDashboard from "@/components/dashboard/user/MyServicesDashboard";
import { requireAuth } from "@/lib/auth-guards";

export default async function MyServicesPage() {
  await requireAuth();

  return <MyServicesDashboard />;
}
