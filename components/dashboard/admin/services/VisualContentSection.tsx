import Image from "next/image";
import type { IServiceContentSection } from "@/types";

export function VisualContentSection({
  title,
  section,
  imagePosition,
  imageSrc,
}: {
  eyebrow: string;
  title: string;
  description: string;
  section: IServiceContentSection;
  imagePosition: "left" | "right";
  imageSrc: string;
}) {
  const image = (
    <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-slate-100 lg:min-h-[360px]">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
          {title}
        </p>
      </div>
    </div>
  );

  const items = (
    <div className="space-y-3">
      {section?.items?.map((item, index) => (
        <div
          key={index}
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue/10 text-xs font-bold text-blue">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <h4 className="text-sm font-bold text-navy">{item.title}</h4>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {imagePosition === "left" ? (
        <>
          {image}
          {items}
        </>
      ) : (
        <>
          {items}
          {image}
        </>
      )}
    </div>
  );
}
