import { Reveal } from "@/components/animations/reveal";
import type { IService } from "@/types/admin/service.type";
import { ArrowUpRight, Briefcase, ListChecks } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedServiceCard({
  service,
}: {
  service: IService;
}) {
  const projectCount = service.projects?.length ?? 0;
  const processSteps = service.process?.items?.length ?? 0;

  return (
    <Reveal dir="up">
      <Link
        href={`/services/${service.slug}`}
        aria-label={`Learn more about ${service.name}`}
        className="group grid grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-[20px] bg-navy max-[900px]:grid-cols-1"
      >
        <div className="relative min-h-[460px] overflow-hidden max-[900px]:aspect-[4/3] max-[900px]:min-h-0">
          <Image
            src={service.primaryImage.url}
            alt={service.primaryImage.alt || service.name}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-col justify-center p-12 max-[900px]:p-8 max-[600px]:p-6">
          <div className="mb-5 flex items-center gap-[10px] text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
            <span className="h-[2px] w-7 bg-current" aria-hidden="true" />
            FEATURED SERVICE
          </div>

          <h4 className="mb-4 text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
            {service.name}
          </h4>

          {service.description && (
            <p className="mb-6 line-clamp-4 text-[15px] leading-[1.75] text-white/70">
              {service.description}
            </p>
          )}

          {(projectCount > 0 || processSteps > 0) && (
            <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[13px] text-white/75">
              {projectCount > 0 && (
                <span className="flex items-center gap-2">
                  <Briefcase
                    size={15}
                    aria-hidden="true"
                    className="text-paste"
                  />
                  {projectCount} {projectCount === 1 ? "project" : "projects"}
                </span>
              )}

              {processSteps > 0 && (
                <span className="flex items-center gap-2">
                  <ListChecks
                    size={15}
                    aria-hidden="true"
                    className="text-paste"
                  />
                  {processSteps}-step process
                </span>
              )}
            </div>
          )}

          <span className="inline-flex items-center gap-2 text-[14px] font-bold text-white transition-[gap] duration-200 group-hover:gap-3">
            Explore service
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}