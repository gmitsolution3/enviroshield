import { getFeaturedServices } from "@/lib/api/services";
import { IService } from "@/types";
import ServicesSectionContent from "./ServicesSectionContent";

export default async function ServicesSection() {
  let services: IService[] = [];

  try {
    services = await getFeaturedServices();
  } catch {
    services = [];
  }

  return <ServicesSectionContent services={services} />;
}
