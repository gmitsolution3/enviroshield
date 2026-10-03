import { requireRole } from "@/lib/auth-guards";
import ProjectsDashboard from "@/components/dashboard/admin/projects/ProjectsDashboard";

export default async function ProjectsPage() {
  await requireRole("admin");

  return <ProjectsDashboard />;
}