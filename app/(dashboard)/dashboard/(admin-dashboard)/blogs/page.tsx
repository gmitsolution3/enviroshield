import BlogDashboard from "@/components/dashboard/admin/blogs/BlogDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function BlogsPage() {
  await requireRole("admin");

  return <BlogDashboard />;
}