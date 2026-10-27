import MyOrdersDashboard from "@/components/dashboard/user/MyOrdersDashboard";
import { requireAuth } from "@/lib/auth-guards";

export default async function MyOrdersPage() {
  await requireAuth();

  return <MyOrdersDashboard />;
}
