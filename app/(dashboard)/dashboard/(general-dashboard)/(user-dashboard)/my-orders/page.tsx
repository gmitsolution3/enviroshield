import MyOrdersDashboard from "@/components/dashboard/user/orders/MyOrdersDashboard";
import { requireAuth } from "@/lib/auth-guards";

export default async function MyOrdersPage() {
  const session = await requireAuth();

  return <MyOrdersDashboard userId={session.user.id} />;
}

