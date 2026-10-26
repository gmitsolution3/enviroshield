import UsersDashboard from "@/components/dashboard/admin/users/UsersDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function UsersPage() {
  await requireRole("admin");

  return <UsersDashboard />;
}