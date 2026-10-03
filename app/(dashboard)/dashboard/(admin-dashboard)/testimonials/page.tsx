import TestimonialsDashboard from "@/components/dashboard/admin/testimonials/TestimonialsDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function TestimonialsPage() {
  await requireRole("admin");

  return <TestimonialsDashboard />;
}
