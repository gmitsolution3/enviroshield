import ServiceBookingsDashboard from "@/components/dashboard/admin/service-bookings/ServiceBookingsDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function ServiceBookingsPage() {
  await requireRole("admin");

  return <ServiceBookingsDashboard />;
}
