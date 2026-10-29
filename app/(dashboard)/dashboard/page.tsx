import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import UserDashboard from "@/components/dashboard/user/UserDashboard";
import { requireAuth } from "@/lib/auth-guards";

export default async function DashboardPage() {
  const session = await requireAuth();

  const role = session.user.role ?? "user";

  if (role === "admin") {
    return <AdminDashboard user={session.user} />;
  }

  return <UserDashboard name={session.user.name} />;
}
