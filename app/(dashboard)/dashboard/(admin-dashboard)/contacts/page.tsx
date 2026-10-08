import ContactsDashboard from "@/components/dashboard/admin/contacts/ContactsDashboard";
import { requireRole } from "@/lib/auth-guards";

export default async function ContactsPage() {
  await requireRole("admin");

  return <ContactsDashboard />;
}
