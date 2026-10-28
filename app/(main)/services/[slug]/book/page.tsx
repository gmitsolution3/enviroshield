import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ServiceBookingForm from "@/components/services/ServiceBookingForm";
import { getPublishedServiceBySlug } from "@/lib/api/services";
import { requireAuth } from "@/lib/auth-guards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const service = await getPublishedServiceBySlug(slug);
    return {
      title: `Book ${service.name} | Enviroshield`,
      description: `Schedule and book ${service.name} with Enviroshield waterproofing and construction chemical specialists.`,
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title: "Book Service | Enviroshield",
      robots: { index: false, follow: false },
    };
  }
}

export default async function ServiceBookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Protect route: requires authenticated customer session
  await requireAuth(`/services/${slug}/book`);

  const service = await getPublishedServiceBySlug(slug).catch(() => null);

  if (!service) {
    notFound();
  }

  return <ServiceBookingForm service={service} />;
}

